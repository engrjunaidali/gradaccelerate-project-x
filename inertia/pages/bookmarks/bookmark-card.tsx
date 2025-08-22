import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { EditIcon, StarIcon, ExternalLinkIcon, TrashIcon } from 'lucide-react'
import type { Bookmark } from '../../stores/storeTypes'
import { Button } from "../../components/ui.js/button"

interface BookmarkCardProps {
  bookmark: Bookmark
  viewType: 'grid' | 'list'
  onEdit: () => void
  onDelete: () => void
  onToggleFavorite: () => void
}

export default function BookmarkCard({
  bookmark,
  viewType,
  onEdit,
  onDelete,
  onToggleFavorite
}: BookmarkCardProps) {
  const handleVisitUrl = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
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
                {bookmark.isFavorite ? (
                  <StarIcon size={16} className="text-[#FF9F0A] fill-current flex-shrink-0" />
                ) : ''}
              </div>
              <div className="flex items-center gap-4 text-sm text-[#98989D]">
                <span className="truncate">{getDomainFromUrl(bookmark.url)}</span>
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
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate mb-1">{bookmark.title}</h3>
              <p className="text-sm text-[#98989D] truncate">{getDomainFromUrl(bookmark.url)}</p>
            </div>
          </div>
          {bookmark.isFavorite ? (
            <StarIcon size={20} className="text-[#FF9F0A] fill-current flex-shrink-0" />
          ):''}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-sm text-[#98989D] mb-4 break-all">
          {bookmark.url}
        </div>

        <div className="text-xs text-[#98989D] mb-4">
          Added {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })}
        </div>
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
