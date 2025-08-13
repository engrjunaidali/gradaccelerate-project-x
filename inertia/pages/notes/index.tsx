import { Head, Link, usePage } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, XIcon, ArrowLeft, ChevronLeftIcon, ChevronRightIcon, ArrowUpDown, ArrowUp, ArrowDown, LogOut } from 'lucide-react'
import 'highlight.js/styles/github-dark.css'
import NoteCard from './note-card'
import NoteForm from './note-form'
import ViewSwitcher from './view-switcher'
import { PageProps as InertiaPageProps } from '@inertiajs/core'
import { NoteStatus } from '../../../app/enums/NoteStatus.js'
import useAppStore from '../../stores/store';

import { Button } from "../../../inertia/components/ui.js/button"
import { Input } from "../../../inertia/components/ui.js/input"

interface Note {
  id: number;
  title: string;
  content: string;
  status: typeof NoteStatus;
  pinned: boolean;
  createdAt: string;
  updatedAt: string | null;
  labels?: string[];
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface NotesData {
  data: Note[];
  meta: PaginationMeta;
}

type SortField = 'created_at' | 'updated_at' | 'title'
type SortDirection = 'asc' | 'desc'

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface PageProps extends InertiaPageProps {
  notes: NotesData;
  currentSort: SortConfig;
  user?: {
    id: number;
    fullName: string | null;
    email: string;
  };
}

export default function Index() {
  const { notes: notesData, currentSort, user } = usePage<PageProps>().props

  // Zustand store
  const {
    isFormVisible,
    viewType,
    selectedLabel,
    searchQuery,
    sortConfig,
    deleteConfirm,
    isEditing,
    editingNoteId,
    setIsFormVisible,
    setViewType,
    setSelectedLabel,
    handleEdit,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleTogglePin,
    handleSort,
    handleLogout,
    setDeleteConfirm,
    closeForm
  } = useAppStore()

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown size={14} className="text-[#98989D]" />
    }
    return sortConfig.direction === 'asc'
      ? <ArrowUp size={14} className="text-white" />
      : <ArrowDown size={14} className="text-white" />
  }

  const formatSortLabel = (field: SortField) => {
    switch (field) {
      case 'created_at': return 'Created'
      case 'updated_at': return 'Updated'
      case 'title': return 'Title'
      default: return field
    }
  }

  const toggleForm = () => {
    if (isFormVisible && (isEditing || editingNoteId)) {
      closeForm()
    } else {
      setIsFormVisible(!isFormVisible)
    }
  }

  const filteredNotes = notesData.data.filter(note =>
    !selectedLabel || (note.labels && note.labels.includes(selectedLabel))
  )

  return (
    <>
      <Head title="Notes" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-3">
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
              <h1 className="text-3xl font-bold">Notes</h1>
              {user && (
                <p className="text-gray-400 text-sm">
                  Welcome back, {user.fullName || user.email}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <ViewSwitcher currentView={viewType} onChange={setViewType} />
              <Button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="text-white border-white border rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200"
                title="Logout"
              >
                <LogOut size={20} />
              </Button>
              <Button
                whileTap={{ scale: 0.95 }}
                onClick={toggleForm}
                className="text-white border-white border rounded-full shadow-lg hover:bg-[#0A74FF] transition-colors duration-200"
              >
                {isFormVisible ? <XIcon size={20} /> : <PlusIcon size={20} />}
              </Button>
            </div>
          </motion.div>

          {/* Sorting Controls */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-[#3A3A3C] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedLabel(null)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${!selectedLabel
                      ? 'bg-[#0A84FF] text-white'
                      : 'bg-[#3A3A3C] text-[#98989D] hover:bg-[#4A4A4C]'}`}
                  >
                    All
                  </motion.button>
                  {['Work', 'Personal', 'Important', 'Ideas', 'Tasks'].map((label) => (
                    <motion.button
                      key={label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedLabel(label)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedLabel === label
                        ? 'bg-[#0A84FF] text-white'
                        : 'bg-[#3A3A3C] text-[#98989D] hover:bg-[#4A4A4C]'}`}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
              {/* sort */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#98989D]">Sort by:</span>
                <div className="flex gap-1">
                  {(['created_at', 'updated_at', 'title'] as SortField[]).map((field) => (
                    <Button
                      key={field}
                      onClick={() => handleSort(field, notesData.meta.current_page)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors duration-200 ${sortConfig.field === field
                        ? 'border border-white text-white'
                        : 'text-[#98989D] hover:bg-[#3A3A3C] hover:text-white'
                        }`}
                    >
                      {formatSortLabel(field)}
                      {getSortIcon(field)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isFormVisible && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: 'auto'
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  height: 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <NoteForm
                  isEditing={isEditing}
                  editingNote={editingNoteId ? notesData.data.find(n => n.id === editingNoteId) : undefined}
                  onCancel={closeForm}
                  onSuccess={closeForm}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={viewType === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 gap-4"
              : "flex flex-col gap-3"
            }
          >
            <AnimatePresence>
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={viewType === 'list' ? 'w-full' : ''}
                >
                  <NoteCard
                    note={note}
                    viewType={viewType}
                    onDelete={() => setDeleteConfirm(note.id)}
                    onEdit={() => handleEdit(note)}
                    onTogglePin={() => handleTogglePin(note.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Simple Pagination */}
          {notesData.meta.last_page > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-2 mt-4"
            >
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(notesData.meta.current_page - 1, notesData)}
                disabled={notesData.meta.current_page === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2C2C2E] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3A3A3C] transition-colors duration-200"
              >
                <ChevronLeftIcon size={16} />
                Previous
              </button>

              {/* Page Info */}
              <div className="px-4 py-2 bg-[#2C2C2E] rounded-lg text-sm">
                Page {notesData.meta.current_page} of {notesData.meta.last_page}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(notesData.meta.current_page + 1, notesData)}
                disabled={notesData.meta.current_page === notesData.meta.last_page}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2C2C2E] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3A3A3C] transition-colors duration-200"
              >
                Next
                <ChevronRightIcon size={16} />
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {notesData.data.length === 0 && (
            <div className="text-center py-12">
              <div className="text-[#98989D] text-lg mb-4">No notes found</div>
              <button
                onClick={() => setIsFormVisible(true)}
                className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A74FF] transition-colors duration-200"
              >
                Create your first note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="bg-[#2C2C2E] p-6 rounded-xl max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2">Delete Note</h3>
            <p className="text-[#98989D] mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-[#3A3A3C] text-white px-4 py-2 rounded-lg hover:bg-[#4A4A4C]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
