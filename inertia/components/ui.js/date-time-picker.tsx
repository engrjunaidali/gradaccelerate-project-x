import { useState, useRef, useEffect } from 'react'
import { CalendarIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '../../lib.js/utils'

interface DateTimePickerProps {
  selected: Date | null
  onChange: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  minDate?: Date
  error?: boolean
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function DateTimePicker({
  selected,
  onChange,
  placeholder = "Select date and time...",
  disabled = false,
  className,
  minDate = new Date(),
  error = false
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date())
  const [timeValue, setTimeValue] = useState(selected ? `${selected.getHours().toString().padStart(2, '0')}:${selected.getMinutes().toString().padStart(2, '0')}` : '09:00')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return placeholder
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    return `${dateStr} at ${timeStr}`
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const handleDateSelect = (date: Date) => {
    const [hours, minutes] = timeValue.split(':').map(Number)
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
    onChange(newDate)
    setIsOpen(false)
  }

  const handleTimeChange = (time: string) => {
    setTimeValue(time)
    if (selected) {
      const [hours, minutes] = time.split(':').map(Number)
      const newDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), hours, minutes)
      onChange(newDate)
    }
  }

  const isDateDisabled = (date: Date) => {
    if (!minDate) return false
    return date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    if (!selected) return false
    return date.toDateString() === selected.toDateString()
  }

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        options.push(timeStr)
      }
    }
    return options
  }

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {/* Input Display */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-2 border-transparent focus-within:border-[#0A84FF] cursor-pointer transition-all duration-200",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-[#FF453A]",
          isOpen && "border-[#0A84FF]"
        )}
      >
        <CalendarIcon size={18} className="text-[#98989D] flex-shrink-0" />
        <span className={cn(
          "flex-1 text-left",
          !selected && "text-[#98989D]"
        )}>
          {formatDisplayDate(selected)}
        </span>
        <ClockIcon size={16} className="text-[#98989D] flex-shrink-0" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#2C2C2E] border border-[#3A3A3C] rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#3A3A3C]">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              className="p-2 hover:bg-[#3A3A3C] rounded-lg transition-colors"
            >
              <ChevronLeftIcon size={16} className="text-white" />
            </button>
            <h3 className="text-white font-semibold">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              className="p-2 hover:bg-[#3A3A3C] rounded-lg transition-colors"
            >
              <ChevronRightIcon size={16} className="text-white" />
            </button>
          </div>

          <div className="flex">
            {/* Calendar */}
            <div className="flex-1 p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs text-[#98989D] font-medium p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => date && !isDateDisabled(date) && handleDateSelect(date)}
                    disabled={!date || isDateDisabled(date)}
                    className={cn(
                      "p-2 text-sm rounded-lg transition-all duration-200 hover:bg-[#3A3A3C]",
                      !date && "invisible",
                      date && isDateDisabled(date) && "text-[#98989D]/50 cursor-not-allowed",
                      date && isToday(date) && !isSelected(date) && "bg-[#FF9F0A]/20 text-[#FF9F0A] font-semibold",
                      date && isSelected(date) && "bg-[#0A84FF] text-white font-semibold",
                      date && !isDateDisabled(date) && !isToday(date) && !isSelected(date) && "text-white"
                    )}
                  >
                    {date?.getDate()}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Picker */}
            <div className="w-32 border-l border-[#3A3A3C] p-4">
              <h4 className="text-white font-medium mb-3">Time</h4>
              <select
                value={timeValue}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full bg-[#3A3A3C] text-white border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#0A84FF] focus:outline-none max-h-32 overflow-y-auto"
                size={8}
              >
                {generateTimeOptions().map(time => (
                  <option key={time} value={time} className="py-1">
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-4 border-t border-[#3A3A3C] bg-[#2C2C2E]">
            <button
              type="button"
              onClick={() => {
                onChange(null)
                setIsOpen(false)
              }}
              className="text-[#98989D] hover:text-white text-sm transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-[#0A84FF] hover:bg-[#0A74FF] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
