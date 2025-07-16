import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'

interface Note {
  id: number;
  title: string;
  content: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string | null;
}

interface NoteCardProps {
  note: Note
  viewType: 'grid' | 'list'
  onDelete: (id: number) => void
  onEdit: (note: Note) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-gray-500/20 text-gray-300'
    case 'in-progress': return 'bg-blue-500/20 text-blue-300'
    case 'completed': return 'bg-green-500/20 text-green-300'
    default: return 'bg-gray-500/20 text-gray-300'
  }
}


export default function NoteCard({ note, viewType, onDelete, onEdit }: NoteCardProps) {
  const timeAgo = formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })

  return (
    <motion.div
      className={`relative overflow-hidden backdrop-blur-sm bg-[#2C2C2E]/80 border border-[#3A3A3C] ${viewType === 'grid' ? 'rounded-xl' : 'rounded-lg'
        }`}
      style={{
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`p-5 ${viewType === 'list' ? 'flex items-center gap-4' : ''}`}>
        <div className={viewType === 'list' ? 'flex-1' : ''}>

          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-medium text-white">{note.title}</h2>
            {/* <span className="text-xs text-[#98989D]">{timeAgo}</span> */}
          </div>

          <p className={`text-[#98989D] text-sm mb-2 ${viewType === 'grid' ? 'line-clamp-3' : 'line-clamp-1'}`}>
            {note.content}
          </p>

          <div className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(note.status ?? '')}`}>
            {note.status}
          </div>

        </div>


      </div>

      <div className="absolute top-2 right-2 flex gap-1 opacity-1 group-hover:opacity-100 transition-opacity duration-200">



        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(note);
          }}
          className="p-1.5 rounded-full bg-[#3A3A3C] text-[#98989D] hover:bg-[#4A4A4C] hover:text-white transition-colors"
          title="Edit note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="p-1.5 rounded-full bg-[#3A3A3C] text-[#98989D] hover:bg-red-500 hover:text-white transition-colors"
          title="Delete note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {viewType === 'grid' && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#2C2C2E] to-transparent" />
      )}
    </motion.div>
  )
} 