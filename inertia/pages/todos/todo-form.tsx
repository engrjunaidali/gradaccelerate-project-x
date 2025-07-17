import { motion } from 'framer-motion'
import { Save, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TodoFormProps {
  data: { title: string; content: string; labels: string[] }
  setData: (field: string, value: any) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing?: boolean
  onCancel: () => void
}

export default function TodoForm({
  data,
  setData,
  submit,
  processing,
  handleKeyDown,
  isEditing = false,
  onCancel
}: TodoFormProps) {

  const [labelsInput, setLabelsInput] = useState('')
  useEffect(() => {
    setLabelsInput(data.labels.join(', '));
  }, [data.labels]);

  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-lg p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Todo title..."
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#3A3A3C] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200"
            autoFocus
          />
        </div>

        <div>
          <textarea
            placeholder="Todo content..."
            value={data.content}
            onChange={(e) => setData('content', e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className="w-full bg-[#3A3A3C] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200 resize-none"
          />

          <input
            type="text"
            placeholder="Comma separated labels (e.g. work, personal)"
            value={labelsInput}
            onChange={(e) => setLabelsInput(e.target.value)}
            onBlur={() => {
              const labels = labelsInput
                .split(',')
                .map(l => l.trim())
                .filter(Boolean);
              setData('labels', labels);
            }}
            className="w-full bg-[#3A3A3C] text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0A84FF] transition-all duration-200"
          />
        </div>

        <div className="flex justify-end gap-3">
          <motion.button
            type="button"
            onClick={onCancel}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#3A3A3C] text-white rounded-lg hover:bg-[#48484A] transition-colors duration-200 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            disabled={processing || !data.title.trim()}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A74FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            <Save size={16} />
            {processing ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          </motion.button>
        </div>

      </form>
    </motion.div>
  )
}