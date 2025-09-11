import { useRef, useEffect, useState } from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { reminderSchema, type ReminderFormData } from '../../schemas/reminderSchema'
import { Button } from "../../components/ui.js/button"
import { Input } from "../../components/ui.js/input"
import { Card } from "../../components/ui.js/card"
import DateTimePicker from "../../components/ui.js/date-time-picker"
import { BellIcon, MailIcon } from 'lucide-react'

interface ReminderFormProps {
  isEditing?: boolean
  editingReminder?: {
    id: number
    title: string
    description: string | null
    reminderDateTime: string
    isEmailNotification: boolean
    isBrowserNotification: boolean
  }
  onCancel?: () => void
  onSuccess?: () => void
}

export default function ReminderForm({
  isEditing = false,
  editingReminder,
  onCancel,
  onSuccess
}: ReminderFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)

  // Initialize form with Zod validation
  const form = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: '',
      description: '',
      reminderDateTime: '',
      isEmailNotification: false,
      isBrowserNotification: true
    },
    mode: 'onChange'
  })

  const { register, handleSubmit, watch, control, formState: { errors }, reset } = form
  const watchedIsEmailNotification = watch('isEmailNotification')
  const watchedIsBrowserNotification = watch('isBrowserNotification')

  // Focus title input when form opens
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [])

  // Better useEffect dependency handling
  useEffect(() => {
    if (isEditing && editingReminder) {
      // Format the datetime for the input (ISO string format)
      const formattedDateTime = editingReminder.reminderDateTime || ''

      reset({
        title: editingReminder.title,
        description: editingReminder.description || '',
        reminderDateTime: formattedDateTime,
        isEmailNotification: Boolean(editingReminder.isEmailNotification),
        isBrowserNotification: Boolean(editingReminder.isBrowserNotification)
      })
    } else {
      reset({
        title: '',
        description: '',
        reminderDateTime: '',
        isEmailNotification: false,
        isBrowserNotification: true
      })
    }
  }, [isEditing, editingReminder?.id, reset])

  const onSubmit: SubmitHandler<ReminderFormData> = async (data) => {
    setProcessing(true)

    try {
      // Convert the datetime input to ISO string if it's not already
      const submitData = {
        ...data,
        reminderDateTime: typeof data.reminderDateTime === 'string'
          ? data.reminderDateTime
          : new Date(data.reminderDateTime).toISOString()
      }

      const url = isEditing && editingReminder ? `/reminders/${editingReminder.id}` : '/reminders'
      const method = isEditing ? 'patch' : 'post'

      router[method](url, submitData, {
        onSuccess: () => {
          setProcessing(false)
          reset()
          if (onSuccess) onSuccess()
        },
        onError: (errors) => {
          setProcessing(false)
          console.error('Form submission errors:', errors)
        }
      })
    } catch (error) {
      setProcessing(false)
      console.error('Submission error:', error)
    }
  }

  const handleCancel = () => {
    reset()
    if (onCancel) onCancel()
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit(onSubmit)()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSubmit, onSubmit])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-[#2C2C2E] border-[#3A3A3C] shadow-2xl">
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#0A84FF]/10 rounded-full">
                  <BellIcon size={24} className="text-[#0A84FF]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isEditing ? 'Edit Reminder' : 'Create Reminder'}
                  </h2>
                  <p className="text-[#98989D] text-sm mt-1">
                    {isEditing ? 'Update your reminder details' : 'Set up a new reminder'}
                  </p>
                </div>
              </div>
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={processing}
                  className="text-[#98989D] hover:text-white hover:bg-[#3A3A3C] rounded-full p-3"
                >
                  ×
                </Button>
              )}
            </div>

            {/* Title Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">
                Reminder Title
                <span className="text-[#FF453A] ml-1">*</span>
              </label>
              <Input
                {...register('title')}
                ref={titleInputRef}
                type="text"
                placeholder="What would you like to be reminded about?"
                className="w-full px-4 py-4 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-xl border-2 border-transparent focus:border-[#0A84FF] focus:ring-0 focus:outline-none transition-all duration-200 text-base"
                disabled={processing}
              />
              {errors.title && (
                <p className="text-[#FF453A] text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#FF453A] rounded-full"></span>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">
                Description
                <span className="text-[#98989D] ml-2 font-normal">(Optional)</span>
              </label>
              <textarea
                {...register('description')}
                placeholder="Add any additional details..."
                rows={4}
                className="w-full px-4 py-4 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-xl border-2 border-transparent focus:border-[#0A84FF] focus:ring-0 focus:outline-none transition-all duration-200 resize-none text-base"
                disabled={processing}
              />
              {errors.description && (
                <p className="text-[#FF453A] text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#FF453A] rounded-full"></span>
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Date and Time Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">
                When should we remind you?
                <span className="text-[#FF453A] ml-1">*</span>
              </label>
              <Controller
                name="reminderDateTime"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.toISOString() : '')
                    }}
                    placeholder="Select date and time..."
                    minDate={new Date()}
                    disabled={processing}
                    error={!!errors.reminderDateTime}
                  />
                )}
              />
              {errors.reminderDateTime && (
                <p className="text-[#FF453A] text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#FF453A] rounded-full"></span>
                  {errors.reminderDateTime.message}
                </p>
              )}
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Notification Preferences</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Notification Toggle */}
                <div>
                  <label className="flex items-center gap-4 p-4 bg-[#3A3A3C] rounded-xl cursor-pointer hover:bg-[#404042] transition-all duration-200">
                    <input
                      {...register('isEmailNotification')}
                      type="checkbox"
                      className="sr-only"
                      disabled={processing}
                    />
                    <div className="relative">
                      <div className={`w-12 h-7 rounded-full transition-all duration-200 ${
                        watchedIsEmailNotification
                          ? 'bg-[#0A84FF]'
                          : 'bg-[#98989D]/30'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-200 ${
                          watchedIsEmailNotification ? 'left-6' : 'left-1'
                        }`}></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <MailIcon size={20} className={watchedIsEmailNotification ? 'text-[#0A84FF]' : 'text-[#98989D]'} />
                      <div>
                        <span className="text-white font-medium">Email</span>
                        <p className="text-[#98989D] text-sm">Get notified via email</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Browser Notification Toggle */}
                <div>
                  <label className="flex items-center gap-4 p-4 bg-[#3A3A3C] rounded-xl cursor-pointer hover:bg-[#404042] transition-all duration-200">
                    <input
                      {...register('isBrowserNotification')}
                      type="checkbox"
                      className="sr-only"
                      disabled={processing}
                    />
                    <div className="relative">
                      <div className={`w-12 h-7 rounded-full transition-all duration-200 ${
                        watchedIsBrowserNotification
                          ? 'bg-[#34C759]'
                          : 'bg-[#98989D]/30'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-200 ${
                          watchedIsBrowserNotification ? 'left-6' : 'left-1'
                        }`}></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <BellIcon size={20} className={watchedIsBrowserNotification ? 'text-[#34C759]' : 'text-[#98989D]'} />
                      <div>
                        <span className="text-white font-medium">Browser</span>
                        <p className="text-[#98989D] text-sm">Get browser notifications</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-[#3A3A3C]">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-[#0A84FF] to-[#0A74FF] hover:from-[#0A74FF] hover:to-[#0A64FF] text-white font-semibold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {processing ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isEditing ? "Updating..." : "Creating..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <BellIcon size={18} />
                      {isEditing ? "Update Reminder" : "Create Reminder"}
                    </div>
                  )}
                </Button>

                {onCancel && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={processing}
                    className="px-6 py-4 text-[#98989D] hover:text-white hover:bg-[#3A3A3C] rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </Button>
                )}
              </div>

              <p className="text-center text-sm text-[#98989D] mt-4">
                Press {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"} + Enter to {isEditing ? "update" : "create"} • Press Escape to cancel
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
