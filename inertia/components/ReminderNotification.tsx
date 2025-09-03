import { useEffect, useState } from 'react'
import { getPusherInstance } from '../lib/pusher.js'
import { BrowserNotificationService } from '../services/browser-notification-service.js'
import type { Channel } from 'pusher-js'

interface ReminderNotification {
  id: number
  title: string
  description: string | null
  reminderDateTime: string
  message: string
  timestamp: string
}

interface TestNotification {
  message: string
  timestamp: string
}

interface ReminderNotificationProps {
  userId: number
}

export default function ReminderNotificationComponent({ userId }: ReminderNotificationProps) {
  const [notifications, setNotifications] = useState<ReminderNotification[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const pusher = getPusherInstance()
    const channelName = `user-${userId}-reminders`
    const channel: Channel = pusher.subscribe(channelName)

    // Initialize browser notifications
    BrowserNotificationService.initializeNotifications()

    // Listen for reminder due events
    channel.bind('reminder-due', async (data: ReminderNotification) => {
      console.log('Received reminder notification:', data)

      // Add to in-app notifications
      setNotifications(prev => [...prev, data])
      setIsVisible(true)

      // Show browser notification
      await BrowserNotificationService.showReminderNotification(
        data.title,
        data.description || data.message,
        data.id
      )

      // Auto-hide in-app notification after 10 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== data.id))
      }, 10000)
    })

    // Listen for test notifications
    channel.bind('test-notification', async (data: TestNotification) => {
      console.log('Received test notification:', data)

      // Show as alert for test notifications (for debugging)
      alert(`Test Notification: ${data.message}`)

      // Show browser notification
      await BrowserNotificationService.showNotification({
        title: '🧪 Test Notification',
        body: data.message,
        tag: 'test-notification'
      })
    })

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(channelName)
    }
  }, [userId])

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const dismissAll = () => {
    setNotifications([])
    setIsVisible(false)
  }

  if (!isVisible || notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-[#FF9F0A] text-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">🔔 Reminder Due!</h4>
              <p className="font-medium">{notification.title}</p>
              {notification.description && (
                <p className="text-sm opacity-90 mt-1">{notification.description}</p>
              )}
              <p className="text-xs opacity-75 mt-2">
                {new Date(notification.reminderDateTime).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="ml-2 text-white hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      ))}

      {notifications.length > 1 && (
        <div className="text-center">
          <button
            onClick={dismissAll}
            className="text-xs text-[#98989D] hover:text-white transition-colors"
          >
            Dismiss All
          </button>
        </div>
      )}
    </div>
  )
}
