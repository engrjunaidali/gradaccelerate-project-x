import React from 'react'
import { Head } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { PinIcon, ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { NoteStatus } from '../../../app/enums/NoteStatus.js'

interface Note {
  id: number
  title: string
  content: string
  status: typeof NoteStatus
  pinned: boolean
  createdAt: string
  updatedAt: string | null
}

interface SharedNotePageProps {
  note: Note
}

const getStatusColor = (status: string) => {
  switch (status) {
    case NoteStatus.PENDING: return 'bg-gray-500/20 text-gray-300'
    case NoteStatus.IN_PROGRESS: return 'bg-blue-500/20 text-blue-300'
    case NoteStatus.COMPLETED: return 'bg-green-500/20 text-green-300'
    default: return 'bg-gray-500/20 text-gray-300'
  }
}

const SharedNotePage: React.FC<SharedNotePageProps> = ({ note }) => {
  const timeAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })

  return (
    <>

      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </button>
            <svg width="32" height="32" viewBox="0 0 188 354" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
              <path d="M69.8447 1.82232C87.701 1.82232 109.843 1.2517 127.692 0.933476L166.846 0.247858C173.654 0.163964 180.756 -0.346625 187.5 0.401914C187.471 2.1514 186.276 3.12195 185.245 4.48958C168.635 31.5433 149.663 57.6453 131.887 83.9635C125.465 93.4754 118.291 102.926 112.571 112.87C113.996 113.818 115.199 113.894 116.845 114.129C122.086 112.258 175.336 112.98 184.257 113.504L173.06 128.764L111.361 210.908C106.357 217.569 96.2051 233.408 90.8141 238.123L85.6237 245.276C83.254 248.378 80.963 251.857 78.2354 254.634C61.9276 278.442 50.5433 291.46 35.244 316.629C28.7568 325.064 14.7477 348.616 5.72741 353.296C4.47767 353.945 1.80906 352.966 1.00125 351.988C-0.241596 350.484 -0.126339 348.336 0.278159 346.542C0.978659 343.451 2.42368 340.794 3.49196 337.842C22.6108 284.507 44.2408 230.055 66.8593 178.063C59.7859 178.032 52.7126 177.961 45.6392 177.849C33.2465 178.311 20.7107 177.936 8.29798 177.937C11.1224 153.688 60.4958 26.7594 69.8447 1.82232Z" fill="url(#paint0_linear_99_30)" />
              <defs>
                <linearGradient id="paint0_linear_99_30" x1="-135.668" y1="210.459" x2="25.2897" y2="30.4275" gradientUnits="userSpaceOnUse">
                  <stop offset="0.035" stopColor="#FFB30F" />
                  <stop offset="0.505" stopColor="#FFBA06" />
                  <stop offset="1" stopColor="#D73E47" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="text-3xl font-bold">Shared Note</h1>
          </motion.div>

          {/* Shared Note Card - Read-only version of note-card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div
              className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 border rounded-xl ${
                note.pinned
                  ? 'border-yellow-500/50 ring-2 ring-yellow-500/30 shadow-yellow-500/20'
                  : 'border-[#3A3A3C]'
              }`}
              style={{
                boxShadow: note.pinned
                  ? '0 4px 30px rgba(234, 179, 8, 0.15), 0 0 0 1px rgba(234, 179, 8, 0.1)'
                  : '0 4px 30px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Pinned indicator stripe */}
              {note.pinned ? (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              ) : null}

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-2xl font-bold ${note.pinned ? 'text-yellow-100' : 'text-white'}`}>
                      {note.title}
                    </h2>
                    {note.pinned ?  (
                      <PinIcon size={18} className="text-yellow-500" />
                    ) : null}
                  </div>
                </div>

                {/* Note Content */}
                <div className="text-[#E0E0E0] mb-6 prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
                      h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-white">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-white">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-medium mb-2 text-white">{children}</h3>,
                      code: ({ inline, children, ...props }) =>
                        inline ? (
                          <code className="bg-[#3A3A3C] text-[#FF6B6B] px-2 py-1 rounded text-sm" {...props}>
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-[#1C1C1E] text-[#E0E0E0] p-4 rounded-lg text-sm overflow-x-auto mb-3" {...props}>
                            {children}
                          </code>
                        ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-[#0A84FF] pl-4 italic text-[#B0B0B0] my-4">
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-3">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-3">{children}</ol>,
                      li: ({ children }) => <li className="text-[#E0E0E0]">{children}</li>,
                      strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="text-[#B0B0B0] italic">{children}</em>,
                      a: ({ children, href }) => (
                        <a href={href} className="text-[#0A84FF] hover:text-[#0A74FF] underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {note.content}
                  </ReactMarkdown>
                </div>

                {/* Note Metadata */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#3A3A3C]">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(note.status ?? '')}`}>
                    {note.status}
                  </div>
                  <span className="text-sm text-[#98989D]">Created {timeAgo}</span>
                  {note.updatedAt && (
                    <span className="text-sm text-[#98989D]">
                      • Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sharing info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8 text-sm text-[#98989D]"
          >
            This note has been shared with you. It is read-only.
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default SharedNotePage
