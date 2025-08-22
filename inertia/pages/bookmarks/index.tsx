import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  SearchIcon,
  GridIcon,
  ListIcon,
  ArrowLeft,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from 'lucide-react'
import useAppStore from '../../stores/store'
import BookmarkCard from './bookmark-card.js'
import BookmarkForm from './bookmark-form.js'
import type {
  Bookmark,
  BookmarksData,
  SortField,
  PaginationMeta
} from '../../stores/storeTypes'

interface PageProps {
  bookmarks: {
    data: Bookmark[]
    meta: PaginationMeta
    currentSort: {
      field: SortField
      direction: 'asc' | 'desc'
    }
  }
  user: {
    id: number
    email: string
    fullName: string
  }
  flash?: {
    success?: string
    error?: string
  }
}

export default function Index() {
  const { bookmarks: bookmarksData, user } = usePage<PageProps>().props

  // Zustand store
  const {
    isFormVisible,
    viewType,
    searchQuery,
    sortConfig,
    deleteConfirm,
    isEditing,
    editingBookmarkId,
    filterFavorites,
    setIsFormVisible,
    setViewType,
    handleBookmarkEdit,
    handleBookmarkDelete,
    handlePageChange,
    handleSearch,
    handleToggleFavorite,
    handleSort,
    handleFilterFavorites,
    handleLogout,
    setDeleteConfirm,
    closeForm
  } = useAppStore()

  const toggleForm = () => {
    if (isFormVisible && (isEditing || editingBookmarkId)) {
      closeForm()
    } else {
      setIsFormVisible(!isFormVisible)
    }
  }

  return (
    <>
      <Head title="Bookmarks" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        {/* Header */}
        <div className="bg-[#2C2C2E] border-b border-[#3A3A3C] px-6 py-4">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </Link>
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
              <h1 className="text-2xl font-bold">Bookmarks</h1>
              <span className="text-sm text-[#98989D]">
                {bookmarksData.meta.total} bookmark{bookmarksData.meta.total !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#98989D]">Welcome, {user.fullName}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-[#FF453A] hover:text-[#FF6B6B] transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-[#2C2C2E] border-b border-[#3A3A3C]">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Left side controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Add Bookmark Button */}
              <button
                onClick={toggleForm}
                className="flex items-center gap-2 bg-[#0A84FF] hover:bg-[#0A74FF] text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <PlusIcon size={16} />
                {isFormVisible && (isEditing || editingBookmarkId) ? 'Cancel' : 'Add Bookmark'}
              </button>

              {/* View Toggle */}
              <div className="flex bg-[#3A3A3C] rounded-lg p-1">
                <button
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded transition-colors duration-200 ${viewType === 'grid' ? 'bg-[#0A84FF] text-white' : 'text-[#98989D] hover:text-white'
                    }`}
                >
                  <GridIcon size={16} />
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`p-2 rounded transition-colors duration-200 ${viewType === 'list' ? 'bg-[#0A84FF] text-white' : 'text-[#98989D] hover:text-white'
                    }`}
                >
                  <ListIcon size={16} />
                </button>
              </div>

              {/* Favorites Filter */}
              <button
                onClick={() => handleFilterFavorites(!filterFavorites)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${filterFavorites
                    ? 'bg-[#FF9F0A] text-white'
                    : 'bg-[#3A3A3C] text-[#98989D] hover:text-white'
                  }`}
              >
                <StarIcon size={16} />
                Favorites
              </button>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <SearchIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#98989D]" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="bg-[#3A3A3C] text-white placeholder-[#98989D] pl-10 pr-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-[#0A84FF] focus:outline-none w-64"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${sortConfig.field}-${sortConfig.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-') as [SortField, 'asc' | 'desc']
                    handleSort(field, bookmarksData.meta.current_page)
                  }}
                  className="bg-[#3A3A3C] text-white border-none rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-[#0A84FF] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="updated_at-desc">Recently Updated</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6 py-4"
          >
            <BookmarkForm
              isEditing={isEditing}
              editingBookmark={editingBookmarkId ? bookmarksData.data.find(b => b.id === editingBookmarkId) : undefined}
              onCancel={closeForm}
              onSuccess={closeForm}
            />
          </motion.div>
        )}

        {/* Content */}
        <div className="px-6 py-6">
          {/* Bookmarks Grid/List */}
          {bookmarksData.data.length > 0 && (
            <motion.div
              className={viewType === 'grid'
                ? 'grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {bookmarksData.data.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  viewType={viewType}
                  onEdit={() => handleBookmarkEdit(bookmark)}
                  onDelete={() => setDeleteConfirm(bookmark.id)}
                  onToggleFavorite={() => handleToggleFavorite(bookmark.id)}
                />
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {bookmarksData.meta.last_page > 1 && (
            <motion.div
              className="flex items-center justify-center gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(bookmarksData.meta.current_page - 1, bookmarksData)}
                disabled={bookmarksData.meta.current_page === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2C2C2E] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3A3A3C] transition-colors duration-200"
              >
                <ChevronLeftIcon size={16} />
                Previous
              </button>

              {/* Page Info */}
              <div className="px-4 py-2 bg-[#2C2C2E] rounded-lg text-sm">
                Page {bookmarksData.meta.current_page} of {bookmarksData.meta.last_page}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(bookmarksData.meta.current_page + 1, bookmarksData)}
                disabled={bookmarksData.meta.current_page === bookmarksData.meta.last_page}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2C2C2E] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3A3A3C] transition-colors duration-200"
              >
                Next
                <ChevronRightIcon size={16} />
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {bookmarksData.data.length === 0 && (
            <div className="text-center py-12">
              <div className="text-[#98989D] text-lg mb-4">
                {filterFavorites ? 'No favorite bookmarks found' : 'No bookmarks found'}
              </div>
              <button
                onClick={() => setIsFormVisible(true)}
                className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A74FF] transition-colors duration-200"
              >
                Create your first bookmark
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#2C2C2E] rounded-lg p-6 max-w-sm mx-4"
          >
            <h3 className="text-lg font-semibold mb-4 text-white">Delete Bookmark</h3>
            <p className="text-[#98989D] mb-6">
              Are you sure you want to delete this bookmark? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-[#98989D] hover:text-white transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBookmarkDelete(deleteConfirm)}
                className="px-4 py-2 bg-[#FF453A] hover:bg-[#FF6B6B] text-white rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
