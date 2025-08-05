import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Loader2 } from 'lucide-react'
import axios from 'axios'

interface GiphyGif {
  id: string
  title: string
  url: string
  images: {
    original: {
      url: string
      width: string
      height: string
    }
    fixed_height: {
      url: string
      width: string
      height: string
    }
    fixed_width: {
      url: string
      width: string
      height: string
    }
    preview_gif: {
      url: string
      width: string
      height: string
    }
  }
}

interface GiphyPickerProps {
  isOpen: boolean
  searchQuery: string
  onGifSelect: (gif: GiphyGif) => void
  onClose: () => void
}

export default function GiphyPicker({ isOpen, searchQuery, onGifSelect, onClose }: GiphyPickerProps) {
  const [gifs, setGifs] = useState<GiphyGif[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery)

  useEffect(() => {
    if (searchQuery && isOpen) {
      searchGifs(searchQuery)
    }
  }, [searchQuery, isOpen])

  const searchGifs = async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`/api/giphy/search?q=${encodeURIComponent(query)}&limit=20`)
      setGifs(response.data.gifs || [])
    } catch (err) {
      console.error('Error fetching GIFs:', err)
      setError('Failed to fetch GIFs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentSearchQuery.trim()) {
      searchGifs(currentSearchQuery)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-[#2C2C2E] rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Select a GIF</h3>
            <button
              onClick={onClose}
              className="text-[#98989D] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#98989D]" size={16} />
                <input
                  type="text"
                  value={currentSearchQuery}
                  onChange={(e) => setCurrentSearchQuery(e.target.value)}
                  placeholder="Search GIFs..."
                  className="w-full pl-10 pr-4 py-2 bg-[#3A3A3C] text-white placeholder-[#98989D] rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A74FF] disabled:opacity-50 transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Search'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-[#0A84FF]" size={24} />
                <span className="ml-2 text-[#98989D]">Searching GIFs...</span>
              </div>
            ) : gifs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gifs.map((gif) => (
                  <motion.button
                    key={gif.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onGifSelect(gif)}
                    className="relative overflow-hidden rounded-lg bg-[#3A3A3C] aspect-square"
                  >
                    <img
                      src={gif.images.fixed_height.url}
                      alt={gif.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200" />
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#98989D]">No GIFs found. Try a different search term.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
