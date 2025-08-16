import { motion } from 'framer-motion'
import { Edit, Trash2, Calendar, Eye } from 'lucide-react'
import { DateTime } from 'luxon'
import { router } from '@inertiajs/react'
import { formatDate } from '../../../utils/date-utils'
import { Button } from "../../../inertia/components/ui.js/button"
import { Badge } from "../../../inertia/components/ui.js/badge"
import { priorityColors } from "../../constants/priorityColors"
import { TodoPriority } from "../../../app/enums/TodoPriority"
import { TodoStatus } from "../../../app/enums/TodoStatus"
import { TodoStatusColors } from "../../constants/TodoStatusColors"
import useAppStore from '../../stores/store'

interface Todo {
  id: number
  title: string
  content: string
  status: typeof TodoStatus
  labels: string[] | null
  imageUrl: string | null
  priority: typeof TodoPriority
  createdAt: string
  updatedAt: string | null
}

interface TodoCardProps {
  todo: Todo
  viewType: 'grid' | 'list'
  onEdit?: (todo: Todo) => void
  onDelete?: (id: number) => void
}

export default function TodoCard({ todo, viewType, onEdit, onDelete }: TodoCardProps) {
  const { handleView, handleEdit, handleTodoDelete } = useAppStore()

  const onViewClick = () => {
    handleView(todo)
    // Fallback to router if store action not available
    if (!handleView) router.visit(`/todos/${todo.id}`)
  }

  const onEditClick = () => {
    if (onEdit) {
      onEdit(todo)
    } else if (handleEdit) {
      handleEdit(todo)
    }
  }

  const onDeleteClick = () => {
    if (onDelete) {
      onDelete(todo.id)
    } else if (handleTodoDelete) {
      handleTodoDelete(todo.id)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-[#2C2C2E] rounded-lg p-4 shadow-lg border border-[#3A3A3C] hover:border-white transition-all duration-200 ${viewType === 'list' ? 'flex items-center justify-between' : ''
        }`}
    >
      <div className={viewType === 'list' ? 'flex-1' : ''}>
        <Badge variant="outline" className={priorityColors[todo.priority.toLowerCase()]} >
          {todo.priority}
        </Badge>
        <h3 className="text-lg font-semibold text-white mb-2 mt-3 line-clamp-1">
          {todo.title}
        </h3>

        <p className={`text-gray-300 mb-2 ${viewType === 'list' ? 'line-clamp-1' : 'line-clamp-3'}`}>
          {todo.content}
        </p>

        <div className={`inline-block px-2 py-1 mb-2  rounded-full text-xs ${TodoStatusColors[todo.status]}`}>
          {todo.status}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={12} />
          <span>
            {formatDate(todo.createdAt)}
            {todo.updatedAt && ` • Updated ${formatDate(todo.updatedAt)}`}
          </span>
        </div>


        {todo.imageUrl && todo.imageUrl !== '' && (
          <img
            src={todo.imageUrl}
            alt="Preview"
            className="rounded-lg w-32 h-32 object-cover border border-gray-700"
            style={{ maxWidth: 128, maxHeight: 128 }}
          />
        )}


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

        <Button
          whileTap={{ scale: 0.9 }}
          onClick={onViewClick}
          className="p-2 bg-[#34C759] text-white hover:bg-[#30B855] transition-colors duration-200 rounded-full"
          title="View todo"
        >
          <Eye size={16} />
        </Button>

        <Button
          whileTap={{ scale: 0.9 }}
          onClick={onEditClick}
          className="p-2 bg-[#0A84FF] text-white hover:bg-[#0A74FF] transition-colors duration-200 rounded-full"
          title="Edit todo"
        >
          <Edit size={16} />
        </Button>

        <Button
          whileTap={{ scale: 0.9 }}
          onClick={onDeleteClick}
          className="p-2 bg-[#FF3B30] text-white hover:bg-[#FF2D20] transition-colors duration-200  rounded-full"
          title="Delete todo"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </motion.div>
  )
}
