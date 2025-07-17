import { Head, Link, router } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from 'lucide-react'
import { DateTime } from 'luxon'
import { useState } from 'react'

interface Todo {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export default function Show({ todo }: { todo: Todo }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat('MMM dd, yyyy \'at\' h:mm a')
  }

  return (
    <>
      <Head title={todo.title} />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-3">
              <Link
                href="/todos"
                className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-2xl font-bold">Todo Details</h1>
            </div>
            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#2C2C2E] rounded-lg p-8 shadow-lg border border-[#3A3A3C]"
          >
            <h2 className="text-3xl font-bold text-white mb-6 break-words">
              {todo.title}
            </h2>
            
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {todo.content}
              </p>
            </div>
            
            <div className="border-t border-[#3A3A3C] pt-6">
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>
                    Created: {formatDate(todo.createdAt)}
                  </span>
                </div>
                
                {todo.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>
                      Updated: {formatDate(todo.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}