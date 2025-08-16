import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { EditIcon, PinIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { NoteStatus } from '../../../app/enums/NoteStatus.js'
import useAppStore from '../../stores/store';
import { Button } from "../../../inertia/components/ui.js/button"


interface Note {
  id: number;
  title: string;
  content: string;
  status: typeof NoteStatus;
  pinned: boolean;
  labels: string[];
  createdAt: string;
  updatedAt: string | null;
}

interface NoteCardProps {
  note: Note
}

export default function NoteCard({ note }: NoteCardProps) {
  const { viewType, getStatusColor, handleNoteEdit, handleNoteDelete, handleTogglePin } = useAppStore()
  const timeAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })

  return (
    <motion.div
      className={`group relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 border ${viewType === 'grid' ? 'rounded-xl' : 'rounded-lg'
        } ${note.pinned
          ? 'border-yellow-500/50 ring-2 ring-yellow-500/30 shadow-yellow-500/20'
          : 'border-[#3A3A3C]'
        }`}
      style={{
        boxShadow: note.pinned
          ? '0 4px 30px rgba(234, 179, 8, 0.15), 0 0 0 1px rgba(234, 179, 8, 0.1)'
          : '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >

      {/* Pinned indicator stripe */}
      {note.pinned ? (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
      ) : null}

      <div className={`p-5 ${viewType === 'list' ? 'flex items-center gap-4' : ''}`}>
        <div className={viewType === 'list' ? 'flex-1' : ''}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-medium ${note.pinned ? 'text-yellow-100' : 'text-white'}`}>
                {note.title}
              </h2>
              {note.pinned ? (
                <PinIcon size={14} className="text-yellow-500" />
              ) : null}
            </div>
            <div className="flex flex-wrap gap-1">
              {note.labels && note.labels.map((label) => (
                <span
                  key={label}
                  className="px-2 py-0.5 text-xs font-medium rounded-full bg-[#0A84FF] bg-opacity-20 text-white "
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          </div>

          <div className={`text-[#98989D] text-sm mb-2 ${viewType === 'grid' ? 'line-clamp-3' : 'line-clamp-2'}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                h1: ({ children }) => <h1 className="text-base font-bold mb-1 text-white">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-semibold mb-1 text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-medium mb-1 text-white">{children}</h3>,
                code: ({ children, ...props }) => {
                  const isInline = !String(children).includes('\n')
                  return isInline ? (
                    <code className="bg-[#3A3A3C] text-[#FF6B6B] px-1 py-0.5 rounded text-xs" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-[#1C1C1E] text-[#E0E0E0] p-2 rounded text-xs overflow-x-auto" {...props}>
                      {children}
                    </code>
                  )
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#0A84FF] pl-2 italic text-[#B0B0B0]">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-[#98989D]">{children}</li>,
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

          <div className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(String(note.status ?? ''))}`}>
            {String(note.status)}
          </div>

          <span className="text-xs px-2 text-[#98989D]">{timeAgo}</span>
        </div>
      </div>

      {/* Action buttons - visible on hover */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-1 group-hover:opacity-100 transition-opacity duration-200">


        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleTogglePin(note.id);
          }}
          className={`p-1.5 rounded-full transition-colors duration-200 ${note.pinned
            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
            : 'bg-[#3A3A3C] text-[#98989D] hover:bg-yellow-500/20 hover:text-yellow-400'
            }`}
          title={note.pinned ? 'Unpin note' : 'Pin note'}
        >
          <PinIcon size={14} />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleNoteEdit(note);
          }}
          className="p-1.5 rounded-full bg-[#3A3A3C] text-[#98989D] hover:bg-[#4A4A4C] hover:text-white transition-colors"
          title="Edit note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleNoteDelete(note.id);
          }}
          className="p-1.5 rounded-full bg-[#3A3A3C] text-[#98989D] hover:bg-red-500 hover:text-white transition-colors"
          title="Delete note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>

      {viewType === 'grid' && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#2C2C2E] to-transparent" />
      )}
    </motion.div>
  )
}
