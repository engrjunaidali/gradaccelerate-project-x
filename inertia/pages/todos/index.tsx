import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function Todos() {
  return (
    <>
      <Head title="Todos" />
      <div className="min-h-screen bg-[#1C1C1E] text-white">
        <div className="max-w-4xl mx-auto p-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Link 
              href="/" 
              className="p-2 hover:bg-[#2C2C2E] rounded-full transition-colors duration-200"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold">Todos</h1>
          </motion.div>

          <div className="flex items-center justify-center h-[60vh]">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-[#98989D] font-medium"
            >
              Project Submission
            </motion.p>
          </div>
        </div>
      </div>
    </>
  )
} 