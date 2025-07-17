import { motion } from 'framer-motion'
import { Edit, Trash2, Calendar, Eye } from 'lucide-react'
import { DateTime } from 'luxon'
import { router } from '@inertiajs/react'

interface Todo {
  id: number
  title: string
  content: string
  labels: string[] | null
  createdAt: string
  updatedAt: string | null
}

interface TodoCardProps {
  todo: Todo
  viewType: 'grid' | 'list'
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
}

export default function TodoCard({ todo, viewType, onEdit, onDelete }: TodoCardProps) {
  const formatDate = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat('MMM dd, yyyy')
  }

  const handleView = () => {
    router.visit(`/todos/${todo.id}`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-[#2C2C2E] rounded-lg p-4 shadow-lg border border-[#3A3A3C] hover:border-[#0A84FF] transition-all duration-200 ${viewType === 'list' ? 'flex items-center justify-between' : ''
        }`}
    >
      <div className={viewType === 'list' ? 'flex-1' : ''}>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {todo.title}
        </h3>



        <p className={`text-gray-300 mb-3 ${viewType === 'list' ? 'line-clamp-1' : 'line-clamp-3'}`}>
          {todo.content}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={12} />
          <span>
            {formatDate(todo.createdAt)}
            {todo.updatedAt && ` • Updated ${formatDate(todo.updatedAt)}`}
          </span>
        </div>

        {/* Show labels if present */}
        {Array.isArray(todo.labels) && todo.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 my-3">
            {todo.labels.map((label, i) => (
              <span
                key={i}
                className="bg-[#48484A] text-gray-200 text-xs px-2 py-0.5 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={`flex gap-2 ${viewType === 'list' ? 'ml-4' : 'mt-4'}`}>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleView}
          className="p-2 bg-[#34C759] text-white rounded-lg hover:bg-[#30B855] transition-colors duration-200"
          title="View todo"
        >
          <Eye size={16} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onEdit(todo)}
          className="p-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A74FF] transition-colors duration-200"
          title="Edit todo"
        >
          <Edit size={16} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(todo.id)}
          className="p-2 bg-[#FF3B30] text-white rounded-lg hover:bg-[#FF2D20] transition-colors duration-200"
          title="Delete todo"
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
    </motion.div>
  )
}