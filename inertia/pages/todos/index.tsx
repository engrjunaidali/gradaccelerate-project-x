import { Head, Link } from '@inertiajs/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { PlusIcon, XIcon, ArrowLeft, LogOut } from 'lucide-react'
import TodoCard from './todo-card'
import TodoForm from './todo-form'
import ViewSwitcher from './view-switcher'
import { z } from 'zod'
import { TodoAuth, api } from '../../lib/TodoAuth'
import useAppStore from '../../stores/store'
import { useTodoCardStore } from '../../stores/useTodoCardStore'

import { Button } from "../../../inertia/components/ui.js/button"
import { TodoPriority } from '../../../app/enums/TodoPriority'
import { TodoStatus } from '../../../app/enums/TodoStatus'

  const TodoSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    content: z.string(),
    status: z.enum([TodoStatus.PENDING, TodoStatus.IN_PROGRESS, TodoStatus.COMPLETED]),
    labels: z.array(z.string().trim().min(1)).optional().default([]),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
    priority: z.enum([TodoPriority.HIGH, TodoPriority.MEDIUM, TodoPriority.LOW]),
    user_id: z.number().optional()
  })

export default function Index() {
  // Get state and actions from Zustand store
  const {
    todos,
    isFormVisible,
    editingTodo,
    viewType,
    errors,
    processing,
    data,
    setIsFormVisible,
    setViewType,
    loadTodos,
    handleEdit,
    deleteTodo,
    handleCancel,
    submit,
    updateData
  } = useAppStore()

  // Load todos on component mount
  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  const { handleEdit: cardHandleEdit, handleDelete: cardHandleDelete } = useTodoCardStore();

  // Connect store actions
  useEffect(() => {
    cardHandleEdit(handleEdit);
    cardHandleDelete(deleteTodo);
  }, [handleEdit, deleteTodo]);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/jwt/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      TodoAuth.removeToken()
      window.location.href = '/auth/jwt/login'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      submit(e as any)
    }
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const toggleForm = () => {
    if (isFormVisible) {
      handleCancel()
    } else {
      setIsFormVisible(true)
    }
  }

  return (
    <>
      <Head title="Todos" />
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
              <h1 className="text-3xl font-bold">Todos</h1>
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
                <TodoForm
                  data={data}
                  setData={updateData}
                  submit={submit}
                  processing={processing}
                  handleKeyDown={handleKeyDown}
                  isEditing={!!editingTodo}
                  onCancel={handleCancel}
                  errors={errors}
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
              {todos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={viewType === 'list' ? 'w-full' : ''}
                >
                  <TodoCard
                    todo={todo}
                    viewType={viewType}
                    onEdit={handleEdit}
                    onDelete={deleteTodo}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  )
}
