import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { EditIcon, CheckCircleIcon, ClockIcon, TrashIcon, BellIcon, MailIcon, TestTubeIcon } from 'lucide-react'
import type { Reminder } from '../../stores/types/remindersTypes'
import { Button } from "../../components/ui.js/button"
import { ReminderStatusColors } from "../../constants/ReminderStatusColors"
import { formatReminderDateTime, isReminderOverdue } from '../../utils/reminder-utils.js'
import axios from 'axios'
import { useState } from 'react'
interface ReminderCardProps {
  reminder: Reminder
  viewType: 'grid' | 'list'
  onEdit: () => void
  onDelete: () => void
}

export default function ReminderCard({
  reminder,
  viewType,
  onEdit,
  onDelete,
}: ReminderCardProps) {
  const [isTestingEmail, setIsTestingEmail] = useState(false)

  const handleTestEmail = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsTestingEmail(true)

    try {
      // Send test email with this specific reminder's details
      const response = await axios.post('/reminders/create-test-reminder-email', {
        title: `📧 Test: ${reminder.title}`,
        description: reminder.description || 'This is a test email notification for this reminder.',
        reminderDateTime: new Date(Date.now() + 60000).toISOString(), // 1 minute from now
      }, {
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        }
      })

      if (response.data.success) {
        alert(`✅ Test email reminder created! You should receive an email notification in about 1 minute with the details of "${reminder.title}".`)
      } else {
        alert(`❌ ${response.data.message}`)
      }
    } catch (error) {
      console.error('Error creating test email reminder:', error)
      alert('❌ Failed to create test email reminder')
    } finally {
      setIsTestingEmail(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircleIcon
      case 'cancelled': return TrashIcon
      default: return ClockIcon // pending
    }
  }

  const StatusIcon = getStatusIcon(reminder.status)
  const overdue = isReminderOverdue(reminder.reminderDateTime, reminder.status)

  if (viewType === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`bg-[#2C2C2E] rounded-lg p-4 border transition-all duration-200 ${overdue ? 'border-[#FF453A] hover:border-[#FF6B6B]' : 'border-[#3A3A3C] hover:border-[#0A84FF]'
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Status Icon */}
            <div className="flex-shrink-0">
              <StatusIcon size={20} className={`${ReminderStatusColors[reminder.status]}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white truncate">{reminder.title}</h3>
                {overdue && (
                  <span className="px-2 py-1 text-xs bg-[#FF453A]/20 text-[#FF453A] rounded-full">
                    Overdue
                  </span>
                )}
              </div>
              {reminder.description && (
                <p className="text-sm text-[#98989D] mb-2 line-clamp-2">{reminder.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-[#98989D]">
                <span className="flex items-center gap-1">
                  <ClockIcon size={14} />
                  {formatReminderDateTime(reminder.reminderDateTime)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">

                    <div className="flex items-center gap-1">
                      <MailIcon size={14} className={reminder.isEmailNotification ? 'text-[#0A84FF]' : 'text-[#98989D]'} />
                      <span>Email</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BellIcon size={14} className={reminder.isBrowserNotification ? 'text-[#34C759]' : 'text-[#98989D]'} />
                      <span>Browser</span>
                    </div>

                </span>
                <span>•</span>
                <span>Created {formatDistanceToNow(new Date(reminder.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {reminder.isEmailNotification && (
              <Button
                onClick={handleTestEmail}
                disabled={isTestingEmail}
                variant="ghost"
                size="sm"
                className="text-[#98989D] hover:text-[#0A84FF] p-2"
                title="Test Email Notification"
              >
                <TestTubeIcon size={16} />
              </Button>
            )}
            <Button
              onClick={onEdit}
              variant="ghost"
              size="sm"
              className="text-[#98989D] hover:text-white p-2"
            >
              <EditIcon size={16} />
            </Button>
            <Button
              onClick={onDelete}
              variant="ghost"
              size="sm"
              className="text-[#98989D] hover:text-[#FF453A] p-2"
            >
              <TrashIcon size={16} />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-[#2C2C2E] rounded-lg border transition-all duration-200 overflow-hidden group ${overdue ? 'border-[#FF453A] hover:border-[#FF6B6B]' : 'border-[#3A3A3C] hover:border-[#0A84FF]'
        }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#3A3A3C]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Status Icon */}
            <div className="flex-shrink-0">
              <StatusIcon size={24} className={`${ReminderStatusColors[reminder.status]}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white truncate">{reminder.title}</h3>
                {overdue && (
                  <span className="px-2 py-1 text-xs bg-[#FF453A]/20 text-[#FF453A] rounded-full">
                    Overdue
                  </span>
                )}
              </div>
              {reminder.description && (
                <p className="text-sm text-[#98989D] mb-2 line-clamp-2">{reminder.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-[#98989D]">
                <ClockIcon size={12} />
                <span>{formatReminderDateTime(reminder.reminderDateTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {reminder.description && (
          <p className="text-sm text-[#98989D] mb-4 line-clamp-3">{reminder.description}</p>
        )}

        {/* Notification Settings */}
        <div className="flex items-center gap-4 mb-4 text-sm text-[#98989D]">
          <div className="flex items-center gap-1">
            <MailIcon size={14} className={reminder.isEmailNotification ? 'text-[#0A84FF]' : 'text-[#98989D]'} />
            <span>Email</span>
          </div>
          <div className="flex items-center gap-1">
            <BellIcon size={14} className={reminder.isBrowserNotification ? 'text-[#34C759]' : 'text-[#98989D]'} />
            <span>Browser</span>
          </div>
        </div>

        <div className="text-xs text-[#98989D] mb-4">
          Created {formatDistanceToNow(new Date(reminder.createdAt), { addSuffix: true })}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${reminder.status === 'completed' ? 'bg-[#34C759]/20 text-[#34C759]' :
              reminder.status === 'cancelled' ? 'bg-[#FF453A]/20 text-[#FF453A]' :
                'bg-[#FF9F0A]/20 text-[#FF9F0A]'
            }`}>
            {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
          </div>

          <div className="flex items-center gap-1">
            {reminder.isEmailNotification && (
              <Button
                onClick={handleTestEmail}
                disabled={isTestingEmail}
                variant="ghost"
                size="sm"
                className="text-[#98989D] hover:text-[#0A84FF] p-2"
                title="Test Email Notification"
              >
                <MailIcon size={16} />
              </Button>
            )}
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              variant="ghost"
              size="sm"
              className="text-[#98989D] hover:text-white p-2"
            >
              <EditIcon size={16} />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              variant="ghost"
              size="sm"
              className="text-[#98989D] hover:text-[#FF453A] p-2"
            >
              <TrashIcon size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
