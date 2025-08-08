import type React from "react"
import { EyeIcon, EditIcon, Share2Icon } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { NoteStatus } from "../../../app/enums/NoteStatus.js"
import { noteSchema, type NoteFormData } from '../../schemas/noteSchema'
import GiphyPicker from '../../components/GiphyPicker'
import { useNotesStore } from '../../stores/useNotesStore'

import { Button } from "../../../inertia/components/ui.js/button"
import { Input } from "../../../inertia/components/ui.js/input"
import { Card } from "../../../inertia/components/ui.js/card"

interface NoteFormProps {
  isEditing?: boolean
  editingNote?: {
    id: number
    title: string
    content: string
    status: keyof typeof NoteStatus
    pinned: boolean
    labels: string[]
  }
  onCancel?: () => void
  onSuccess?: () => void
}

interface PageProps {
  flash?: {
    success?: string
    error?: string
  }
}

export default function NoteForm({
  isEditing = false,
  editingNote,
  onCancel,
  onSuccess
}: NoteFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [shareableLink, setShareableLink] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const {
    showGiphyPicker,
    giphySearchQuery,
    handleGifSelect
  } = useNotesStore()

  // Initialize form with Zod validation
  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      status: NoteStatus.PENDING,
      pinned: false,
      labels: []
    }
  })

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = form
  const watchedContent = watch('content')
  const watchedLabels = watch('labels')

  // Fixed: Better useEffect dependency handling
  useEffect(() => {
    if (isEditing && editingNote) {
      reset({
        title: editingNote.title,
        content: editingNote.content,
        status: editingNote.status,
        pinned: Boolean(editingNote.pinned),
        labels: editingNote.labels || []
      })
    } else {
      reset({
        title: '',
        content: '',
        status: NoteStatus.PENDING,
        pinned: false,
        labels: []
      })
    }
  }, [isEditing, editingNote?.id, reset])

  // Form submission handler
  const onSubmit = async (data: NoteFormData) => {
    setProcessing(true)

    try {
      if (isEditing && editingNote) {
        // Update existing note
        router.put(`/notes/${editingNote.id}`, data, {
          preserveState: true, // Added: Preserve component state
          preserveScroll: true, // Added: Preserve scroll position
          onSuccess: (page) => {
            onSuccess?.()
          },
          onError: (errors) => {
            console.error('Update failed:', errors)
          },
          onFinish: () => {
            setProcessing(false)
          }
        })
      } else {
        // Create new note
        router.post('/notes', data, {
          preserveState: true, // Added: Preserve component state
          preserveScroll: true, // Added: Preserve scroll position
          onSuccess: (page) => {
            reset() // Reset form after successful creation
            onSuccess?.()
          },
          onError: (errors) => {
            console.error('Creation failed:', errors)
          },
          onFinish: () => {
            setProcessing(false)
          }
        })
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setProcessing(false)
    }
  }

  // Handle share functionality
  const handleShare = async () => {
    if (!editingNote) return

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

      if (!csrfToken) {
        console.error('CSRF token not found')
        return
      }

      const response = await fetch(`/notes/${editingNote.id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setShareableLink(data.shareableLink)
      } else {
        console.error('Share request failed:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  // Handle content change for GIF integration
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setValue('content', value, { shouldDirty: true, shouldTouch: true }) // Added: Mark field as dirty and touched

    // Handle /giphy command
    if (value.includes('/giphy ')) {
      const giphyMatch = value.match(/\/giphy\s+(.+)/)
      if (giphyMatch) {
        const searchTerm = giphyMatch[1]
        useNotesStore.getState().setGiphySearchQuery(searchTerm)
        useNotesStore.getState().setShowGiphyPicker(true)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault() // Added: Prevent default behavior
      handleSubmit(onSubmit)()
    }
  }


  return (
    <Card
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
      style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)" }}
    >
      {/* GiphyPicker Modal */}
      {showGiphyPicker && (
        <GiphyPicker
          isOpen={showGiphyPicker}
          searchQuery={giphySearchQuery}
          onGifSelect={(gif) => {
            const currentContent = watchedContent || ''
            const gifMarkdown = `![${gif.title}](${gif.images.original.url})`
            const newContent = currentContent.replace(/\/giphy\s+.+/, gifMarkdown)
            setValue('content', newContent, { shouldDirty: true, shouldTouch: true })

            // Focus back to textarea
            if (textareaRef.current) {
              textareaRef.current.focus()
            }

            useNotesStore.getState().setShowGiphyPicker(false)
          }}
          onClose={() => useNotesStore.getState().setShowGiphyPicker(false)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          {isEditing ? `Edit Note ${editingNote?.id ? `#${editingNote.id}` : ''}` : 'New Note'}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${showPreview
              ? 'text-white'
              : 'text-[#98989D] hover:bg-[#4A4A4C]'
              }`}
          >
            {showPreview ? <EditIcon size={14} /> : <EyeIcon size={14} />}
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          {isEditing && editingNote && (
            <Button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors text-[#98989D] hover:bg-[#4A4A4C]"
            >
              <Share2Icon size={14} />
              Share
            </Button>
          )}
          {isEditing && onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors text-[#98989D] hover:bg-[#4A4A4C]"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
      {shareableLink && (
        <div className="mb-4 p-3 bg-[#3A3A3C] rounded-lg">
          <p className="text-white">Shareable Link:</p>
          <Input
            type="text"
            readOnly
            value={shareableLink}
            className="w-full text-white p-2 rounded mt-1"
            onClick={(e) => {
              e.currentTarget.select()
              navigator.clipboard.writeText(shareableLink)
            }}
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Input
            type="text"
            {...register('title')}
            placeholder="Note title"
            className="text-white"
            disabled={processing}
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div className="mb-4">
          {showPreview ? (
            <div className="min-h-[120px] bg-[#3A3A3C] rounded-lg p-4 border border-[#3A3A3C]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 text-white">{children}</p>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-white">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-white">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-medium mb-1 text-white">{children}</h3>,
                  code: ({ inline, children, ...props }) =>
                    inline ? (
                      <code className="bg-[#1C1C1E] text-[#FF6B6B] px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-[#1C1C1E] text-[#E0E0E0] p-3 rounded text-sm overflow-x-auto" {...props}>
                        {children}
                      </code>
                    ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#0A84FF] pl-4 italic text-[#B0B0B0] my-2">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-white">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-white">{children}</ol>,
                  li: ({ children }) => <li className="text-white">{children}</li>,
                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="text-[#B0B0B0] italic">{children}</em>,
                  a: ({ children, href }) => (
                    <a href={href} className="text-[#0A84FF] hover:text-[#0A74FF] underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {watchedContent || '*No content to preview*'}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              {...register('content')}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              disabled={processing}
              placeholder="Write your note... (Markdown supported)

Examples:
# Heading
**Bold text**
*Italic text*
- List item
`code`
[Link](https://example.com)

Slash Commands:
/giphy [search term] - Insert a GIF"
              className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200 min-h-[120px] resize-vertical"
            />
          )}
          {errors.content && (
            <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
            disabled={processing}
          >
            <option value={NoteStatus.PENDING}>Pending</option>
            <option value={NoteStatus.IN_PROGRESS}>In Progress</option>
            <option value={NoteStatus.COMPLETED}>Completed</option>
          </select>
          {errors.status && (
            <p className="text-red-400 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Labels
          </label>
          <div className="flex flex-wrap gap-2">
            {['Work', 'Personal', 'Important', 'Ideas', 'Tasks'].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  const currentLabels = new Set(watchedLabels || [])
                  if (currentLabels.has(label)) {
                    currentLabels.delete(label)
                  } else {
                    currentLabels.add(label)
                  }
                  setValue('labels', Array.from(currentLabels), { shouldDirty: true, shouldTouch: true })
                }}
                disabled={processing}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${(watchedLabels || []).includes(label)
                  ? 'bg-[#0A84FF] text-white'
                  : 'bg-[#3A3A3C] text-[#98989D] hover:bg-[#4A4A4C]'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Hidden input to register labels with react-hook-form */}
          <input type="hidden" {...register('labels')} />
          {errors.labels && (
            <p className="text-red-400 text-sm mt-1">{errors.labels.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={processing}
          className="w-full bg-[#0A84FF] hover:bg-[#0A74FF] text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing
            ? (isEditing ? "Updating..." : "Adding...")
            : (isEditing ? "Update Note" : "Add Note")
          }
        </Button>
        <p className="text-center text-sm text-[#98989D] mt-2">
          Hit {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"} + Enter to {isEditing ? "update" : "add"} note • Toggle preview to see Markdown rendering
        </p>
      </form>
    </Card>
  )
}
