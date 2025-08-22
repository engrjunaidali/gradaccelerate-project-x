import type React from "react"
import { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { bookmarkSchema, type BookmarkFormData } from '../../schemas/bookmarkSchema'
import useAppStore from '../../stores/store.js'
import { Button } from "../../components/ui.js/button"
import { Input } from "../../components/ui.js/input"
import { Card } from "../../components/ui.js/card"
import { StarIcon } from 'lucide-react'

interface BookmarkFormProps {
  isEditing?: boolean
  editingBookmark?: {
    id: number
    title: string
    url: string
    isFavorite: boolean
  }
  onCancel?: () => void
  onSuccess?: () => void
}

export default function BookmarkForm({
  isEditing = false,
  editingBookmark,
  onCancel,
  onSuccess
}: BookmarkFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)

  // Initialize form with Zod validation
  const form = useForm<BookmarkFormData>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      title: '',
      url: '',
      isFavorite: false
    },
    mode: 'onChange'
  })

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = form
  const watchedIsFavorite = watch('isFavorite')

  // Focus title input when form opens
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [])

  // Better useEffect dependency handling
  useEffect(() => {
    if (isEditing && editingBookmark) {
      reset({
        title: editingBookmark.title,
        url: editingBookmark.url,
        isFavorite: Boolean(editingBookmark.isFavorite)
      })
    } else {
      reset({
        title: '',
        url: '',
        isFavorite: false
      })
    }
  }, [isEditing, editingBookmark?.id, reset])

  const onSubmit = async (data: BookmarkFormData) => {
    setProcessing(true)

    try {
      const url = isEditing && editingBookmark ? `/bookmarks/${editingBookmark.id}` : '/bookmarks'
      const method = isEditing ? 'patch' : 'post'

      router[method](url, data, {
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
        form.handleSubmit(onSubmit)()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [form])

  return (
    <Card className="w-full max-w-2xl mx-auto bg-[#2C2C2E] border-[#3A3A3C] p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? 'Edit Bookmark' : 'Add New Bookmark'}
          </h2>
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={processing}
              className="text-[#98989D] hover:text-black"
            >
              Cancel
            </Button>
          )}
        </div>

        {/* Title Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Title *
          </label>
          <Input
            {...register('title')}
            // ref={titleInputRef}
            type="text"
            placeholder="Enter bookmark title..."
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
            disabled={processing}
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* URL Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            URL *
          </label>
          <Input
            {...register('url')}
            type="url"
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
            disabled={processing}
          />
          {errors.url && (
            <p className="text-red-400 text-sm mt-1">{errors.url.message}</p>
          )}
        </div>

        {/* Favorite Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register('isFavorite')}
              type="checkbox"
              className="sr-only"
              disabled={processing}
            />
            <div className="relative">
              <div className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
                watchedIsFavorite
                  ? 'bg-[#FF9F0A] border-[#FF9F0A]'
                  : 'bg-transparent border-[#98989D] hover:border-[#FF9F0A]'
              }`}>
                {watchedIsFavorite && (
                  <StarIcon size={14} className="text-white fill-current absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-[#98989D]">
              Add to favorites
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={processing}
          className="w-full bg-[#0A84FF] hover:bg-[#0A74FF] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing
            ? (isEditing ? "Updating..." : "Adding...")
            : (isEditing ? "Update Bookmark" : "Add Bookmark")
          }
        </Button>
        <p className="text-center text-sm text-[#98989D] mt-2">
          Hit {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"} + Enter to {isEditing ? "update" : "add"} bookmark • Press Escape to cancel
        </p>
      </form>
    </Card>
  )
}
