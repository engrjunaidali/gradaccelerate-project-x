import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { EditIcon, StarIcon, ExternalLinkIcon, TrashIcon, FileTextIcon } from 'lucide-react'
import { useState } from 'react'
import type { Bookmark } from '../../stores/storeTypes'
import { Button } from "../../components/ui.js/button"

interface BookmarkCardProps {
  bookmark: Bookmark
  viewType: 'grid' | 'list'
  onEdit: () => void
  onDelete: () => void
  onToggleFavorite: () => void
  csrfToken: string
}

export default function BookmarkCard({
  bookmark,
  viewType,
  onEdit,
  onDelete,
  onToggleFavorite,
  csrfToken
}: BookmarkCardProps) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [currentSummary, setCurrentSummary] = useState(bookmark.summary)

  const handleVisitUrl = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
  }



  const handleGenerateTLDR = async () => {
    if (isGeneratingSummary) return

    setIsGeneratingSummary(true)
    try {
      console.log('csrfToken', csrfToken);
      if (!csrfToken) {
        throw new Error('CSRF token not found')
      }

      const response = await fetch(`/bookmarks/${bookmark.id}/tldr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json'
        }
      })

      const data = await response.json()
      console.log('data', data);
      if (data.success && data.summary) {
        setCurrentSummary(data.summary)
        setShowSummary(true)
      } else {
        console.error('Failed to generate TL;DR:', data.message)
      }
    } catch (error) {
      console.error('Error generating TL;DR:', error)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch {
      return url
    }
  }


  if (viewType === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="bg-[#2C2C2E] rounded-lg p-4 border border-[#3A3A3C] hover:border-[#0A84FF] transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white truncate">{bookmark.title}</h3>
                {bookmark.isFavorite && (
                  <StarIcon size={16} className="text-[#FF9F0A] fill-current flex-shrink-0" />
                )}
              </div>
              {bookmark.description && (
                <p className="text-sm text-[#98989D] mb-2 line-clamp-2">{bookmark.description}</p>
              )}
              {bookmark.labels && bookmark.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {bookmark.labels.slice(0, 3).map((label, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-[#0A84FF]/20 text-[#0A84FF] rounded-full"
                    >
                      {label}
                    </span>
                  ))}
                  {bookmark.labels.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-[#3A3A3C] text-[#98989D] rounded-full">
                      +{bookmark.labels.length - 3}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-[#98989D]">
                <span className="truncate">{bookmark.siteName || getDomainFromUrl(bookmark.url)}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={handleVisitUrl}
              variant="ghost"
              size="sm"
              className="text-[#98989D] hover:text-[#0A84FF] p-2"
            >
              <ExternalLinkIcon size={16} />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                if (currentSummary) {
                  setShowSummary(!showSummary)
                } else {
                  handleGenerateTLDR()
                }
              }}
              variant="ghost"
              size="sm"
              className={`p-2 ${currentSummary ? 'text-[#34C759]' : 'text-[#98989D] hover:text-[#34C759]'} ${isGeneratingSummary ? 'opacity-50' : ''}`}
              disabled={isGeneratingSummary}
            >
              <FileTextIcon size={16} className={isGeneratingSummary ? 'animate-pulse' : ''} />
            </Button>
            <Button
              onClick={onToggleFavorite}
              variant="ghost"
              size="sm"
              className={`p-2 ${bookmark.isFavorite ? 'text-[#FF9F0A]' : 'text-[#98989D] hover:text-[#FF9F0A]'}`}
            >
              <StarIcon size={16} className={bookmark.isFavorite ? 'fill-current' : ''} />
            </Button>
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
      className="bg-[#2C2C2E] rounded-lg border border-[#3A3A3C] hover:border-[#0A84FF] transition-all duration-200 overflow-hidden group cursor-pointer"
      onClick={handleVisitUrl}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#3A3A3C]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {bookmark.imageUrl ? (
              <img
                src={bookmark.imageUrl}
                alt={bookmark.title}
                className="w-16 h-16 rounded object-cover flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = `https://www.google.com/s2/favicons?domain=${bookmark.url}` || '/default-favicon.png'
                  e.currentTarget.className = 'w-8 h-8 rounded flex-shrink-0'
                }}
              />
            ) : (
              <img
                src={`https://www.google.com/s2/favicons?domain=${bookmark.url}` || '/default-favicon.png'}
                alt=""
                className="w-8 h-8 rounded flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate mb-1">{bookmark.title}</h3>
              {bookmark.description && (
                <p className="text-sm text-[#98989D] mb-2 line-clamp-2">{bookmark.description}</p>
              )}
              {bookmark.labels && bookmark.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {bookmark.labels.slice(0, 4).map((label, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-[#0A84FF]/20 text-[#0A84FF] rounded-full"
                    >
                      {label}
                    </span>
                  ))}
                  {bookmark.labels.length > 4 && (
                    <span className="px-2 py-1 text-xs bg-[#3A3A3C] text-[#98989D] rounded-full">
                      +{bookmark.labels.length - 4}
                    </span>
                  )}
                </div>
              )}
              <p className="text-sm text-[#98989D] truncate">{bookmark.siteName || getDomainFromUrl(bookmark.url)}</p>
            </div>
          </div>
          {bookmark.isFavorite ? (
            <StarIcon size={20} className="text-[#FF9F0A] fill-current flex-shrink-0" />
          ) : ''}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {bookmark.imageUrl && (
          <div className="mb-4">
            <img
              src={bookmark.imageUrl}
              alt={bookmark.title}
              className="w-full h-32 object-cover rounded"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        {bookmark.description && (
          <p className="text-sm text-[#98989D] mb-4 line-clamp-3">{bookmark.description}</p>
        )}

        {bookmark.labels && bookmark.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {bookmark.labels.map((label, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-[#0A84FF]/20 text-[#0A84FF] rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        <div className="text-sm text-[#98989D] mb-2 break-all">
          {bookmark.url}
        </div>

        <div className="text-xs text-[#98989D] mb-4">
          Added {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })}
        </div>

        {/* TL;DR Summary */}
        {currentSummary && (
          <div className="mb-4 p-3 bg-[#1C1C1E] rounded-lg border border-[#34C759]/30">
            <div className="flex items-center gap-2 mb-2">
              <FileTextIcon size={14} className="text-[#34C759]" />
              <span className="text-sm font-medium text-[#34C759]">TL;DR</span>
            </div>
            <p className="text-sm text-[#E5E5E7] leading-relaxed">{currentSummary}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleVisitUrl()
            }}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-[#0A84FF] border-[#0A84FF] hover:bg-[#0A84FF] hover:text-white"
          >
            <ExternalLinkIcon size={14} />
            Visit
          </Button>

          <div className="flex items-center gap-1">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                if (currentSummary) {
                  setShowSummary(!showSummary)
                } else {
                  handleGenerateTLDR()
                }
              }}
              variant="ghost"
              size="sm"
              className={`p-2 ${currentSummary ? 'text-[#34C759]' : 'text-[#98989D] hover:text-[#34C759]'} ${isGeneratingSummary ? 'opacity-50' : ''}`}
              disabled={isGeneratingSummary}
              title={currentSummary ? 'View TL;DR' : 'Generate TL;DR'}
            >
              <FileTextIcon size={16} className={isGeneratingSummary ? 'animate-pulse' : ''} />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
              variant="ghost"
              size="sm"
              className={`p-2 ${bookmark.isFavorite ? 'text-[#FF9F0A]' : 'text-[#98989D] hover:text-[#FF9F0A]'}`}
            >
              <StarIcon size={16} className={bookmark.isFavorite ? 'fill-current' : ''} />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              variant="ghost"
              size="sm"
              className="text-[#98989D] hover:text-white p-2 hover:text-black"
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
