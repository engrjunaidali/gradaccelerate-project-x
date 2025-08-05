import type React from "react"
import { motion } from "framer-motion"
import { SaveIcon, PinIcon, EyeIcon, EditIcon, Share2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { NoteStatus } from "../../../app/enums/NoteStatus.js"
import axios from 'axios'

interface NoteFormProps {
  isEditing?: boolean
  editingNote?: {
    id: number
    title: string
    content: string
    status: typeof NoteStatus
    pinned: boolean
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
  const { flash } = usePage<PageProps>().props

  const [showPreview, setShowPreview] = useState(false)
  const [shareableLink, setShareableLink] = useState<string | null>(null)

  const { data, setData, post, put, processing, reset, errors } = useForm({
    title: editingNote?.title || '',
    content: editingNote?.content || '',
    status: editingNote?.status || NoteStatus.PENDING,
    pinned: editingNote?.pinned || false
  })

  const handleShare = async () => {
    if (!editingNote) return;
    try {
      const response = await axios.post(`/notes/${editingNote.id}/share`);
      setShareableLink(response.data.shareableLink);
    } catch (error) {
      console.error("Failed to share note:", error);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing && editingNote) {
      put(`/notes/${editingNote.id}`, {
        onSuccess: () => {
          onSuccess?.()
          reset()
        }
      })
    } else {
      post('/notes', {
        onSuccess: () => {
          onSuccess?.()
          reset()
        }
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e)
    }
  }
  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-xl p-6 backdrop-blur-lg border border-[#3A3A3C]"
      style={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">
          {isEditing ? 'Edit Note' : 'New Note'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${showPreview
                ? 'bg-[#0A84FF] text-white'
                : 'bg-[#3A3A3C] text-[#98989D] hover:bg-[#4A4A4C]'
              }`}
          >
            {showPreview ? <EditIcon size={14} /> : <EyeIcon size={14} />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors bg-[#3A3A3C] text-[#98989D] hover:bg-[#4A4A4C]"
            >
              <Share2Icon size={14} />
              Share
            </button>
          )}
        </div>
      </div>
      {shareableLink && (
        <div className="mb-4 p-3 bg-[#3A3A3C] rounded-lg">
          <p className="text-white">Shareable Link:</p>
          <input
            type="text"
            readOnly
            value={shareableLink}
            className="w-full bg-[#1C1C1E] text-white p-2 rounded mt-1"
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            type="text"
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
            placeholder="Note title"
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
            required
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
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
                {data.content || '*No content to preview*'}
              </ReactMarkdown>
            </div>
          ) : (
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              value={data.content}
              onChange={(e) => setData("content", e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write your note... (Markdown supported)

Examples:
# Heading
**Bold text**
*Italic text*
- List item
`code`
[Link](https://example.com)"
              className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none min-h-[120px] transition-all duration-200 font-mono"
              required
            />
          )}
        </div>
        {errors.content && (
          <p className="text-red-400 text-sm mt-1">{errors.content}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Status
          </label>
          <motion.select
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            value={data.status}
            onChange={(e) => setData('status', e.target.value)}
            className="w-full px-4 py-3 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none transition-all duration-200"
            disabled={processing}
          >
            <option value={NoteStatus.PENDING}>Pending</option>
            <option value={NoteStatus.IN_PROGRESS}>In Progress</option>
            <option value={NoteStatus.COMPLETED}>Completed</option>
          </motion.select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={processing}
          className="w-full bg-[#0A84FF] text-white px-4 py-3 rounded-lg hover:bg-[#0A74FF] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-2 focus:ring-offset-[#2C2C2E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {processing
            ? (isEditing ? "Updating..." : "Adding...")
            : (isEditing ? "Update Note" : "Add Note")
          }
        </motion.button>
        <p className="text-center text-sm text-[#98989D] mt-2">
          Hit {navigator.platform?.includes("Mac") ? "⌘" : "Ctrl"} + Enter to {isEditing ? "update" : "add"} note • Toggle preview to see Markdown rendering
        </p>
      </form>
    </motion.div>
  )
} 