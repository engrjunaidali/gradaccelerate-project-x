import { Link } from '@inertiajs/react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function Empty() {
  return (
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
          </div>
        </motion.div>
        <p>Gracias.</p>
      </div>
    </div>
  )
} 