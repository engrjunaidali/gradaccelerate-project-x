/**
 * Browser Notification Service for Reminder Module
 * Handles browser notification permissions and display
 */

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  tag?: string
  data?: any
  requireInteraction?: boolean
}

export class BrowserNotificationService {
  /**
   * Check if browser notifications are supported
   */
  static isSupported(): boolean {
    return 'Notification' in window
  }

  /**
   * Get current notification permission status
   */
  static getPermission(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied'
    }
    return Notification.permission
  }

  /**
   * Request notification permission from user
   */
  static async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('Browser notifications are not supported')
      return 'denied'
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      console.log('Notification permission:', permission)
      return permission
    }

    return Notification.permission
  }

  /**
   * Show a browser notification
   */
  static async showNotification(options: NotificationOptions): Promise<Notification | null> {
    if (!this.isSupported()) {
      console.warn('Browser notifications are not supported')
      return null
    }

    // Request permission if not granted
    const permission = await this.requestPermission()
    if (permission !== 'granted') {
      console.warn('Notification permission denied')
      return null
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        // Badge for mobile devices
        badge: options.icon || '/favicon.ico',
      })

      // Auto-close after 10 seconds if not requiring interaction
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close()
        }, 10000)
      }

      // Handle notification click
      notification.onclick = () => {
        window.focus()
        notification.close()
        
        // If there's custom data, handle it
        if (options.data && options.data.url) {
          window.location.href = options.data.url
        }
      }

      return notification
    } catch (error) {
      console.error('Failed to show notification:', error)
      return null
    }
  }

  /**
   * Show reminder notification with default styling
   */
  static async showReminderNotification(
    title: string,
    description?: string,
    reminderId?: number
  ): Promise<Notification | null> {
    const options: NotificationOptions = {
      title: `🔔 ${title}`,
      body: description || 'Your scheduled reminder is due!',
      icon: '/favicon.ico',
      tag: `reminder-${reminderId}`,
      requireInteraction: true, // Keep notification until user interacts
      data: {
        type: 'reminder',
        reminderId,
        url: '/reminders'
      }
    }

    return this.showNotification(options)
  }

  /**
   * Check and request permission on app initialization
   */
  static async initializeNotifications(): Promise<void> {
    if (!this.isSupported()) {
      console.log('Browser notifications not supported')
      return
    }

    const permission = this.getPermission()
    console.log('Current notification permission:', permission)

    if (permission === 'default') {
      console.log('Notification permission not set, will request when needed')
    } else if (permission === 'denied') {
      console.warn('Notification permission denied by user')
    } else if (permission === 'granted') {
      console.log('Notification permission already granted')
    }
  }
}
