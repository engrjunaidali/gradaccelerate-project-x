import { motion } from 'framer-motion'
import { Save, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios';

import { Button } from "../../../inertia/components/ui.js/button"
import { Input } from "../../../inertia/components/ui.js/input"
import { Textarea } from "../../../inertia/components/ui.js/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../inertia/components/ui.js/select"

import { TodoPriority } from '../../../app/enums/TodoPriority'
import { priorityColors } from "../../constants/priorityColors"


interface TodoFormProps {
  data: {
    title: string
    content: string
    labels: string[]
    imageUrl: string
    priority: typeof TodoPriority
  }
  setData: (field: string, value: any) => void
  submit: (e: React.FormEvent) => void
  processing: boolean
  handleKeyDown: (e: React.KeyboardEvent) => void
  isEditing?: boolean
  onCancel: () => void
  errors: Record<string, string>
}

export default function TodoForm({
  data,
  setData,
  submit,
  processing,
  handleKeyDown,
  isEditing = false,
  onCancel,
  errors
}: TodoFormProps) {

  const [isUploading, setIsUploading] = useState(false);


  const [labelsInput, setLabelsInput] = useState('')

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(data.imageUrl ?? null);



  useEffect(() => {
    setLabelsInput(data.labels.join(', '));
  }, [data.labels]);

  useEffect(() => {
    setImagePreview(data.imageUrl ?? null);
  }, [data.imageUrl]);

  // When file input changes
  const handleImageChange = async (e) => {

    setIsUploading(true);
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('image', file);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    try {
      const token = localStorage.getItem('todo_app_token');
      const res = await axios.post('/api/todos/upload', formData, {
        headers: {
          'X-CSRF-TOKEN': csrfToken || '',
          'Authorization': token ? `Bearer ${token}` : '',
          // 'Content-Type': let axios/browser set this!
        },
        withCredentials: true, // sends cookies
      });
      if (res.data.url) {
        setData('imageUrl', res.data.url);      // this line is correct
        console.log('imageUrl', res.data.url);  // this is better than .imageUrl
        setIsUploading(false);

      }

    } catch (err) {
      setImageFile(null);
      setIsUploading(false);
      alert('Image upload failed.');
      console.error('Image upload error:', err);
    }


  };


  return (
    <motion.div
      className="bg-[#2C2C2E] rounded-lg p-6 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={submit} className="space-y-4">
        {errors?.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        <div>
          <Input
            type="text"
            placeholder="Todo title..."
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
            autoFocus
          />
        </div>

        <div>
          <Textarea
            placeholder="Todo content..."
            value={data.content}
            onChange={(e) => setData('content', e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className="w-full mb-3"
          />

          <div className="mb-4">
            <Select
              value={data.priority}
              onValueChange={(value) => setData('priority', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TodoPriority.HIGH} className={priorityColors['high']}>High Priority</SelectItem>
                <SelectItem value={TodoPriority.MEDIUM} className={priorityColors['medium']}>Medium Priority</SelectItem>
                <SelectItem value={TodoPriority.LOW} className={priorityColors['low']}>Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-200 mb-1">Attach Image (optional)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block text-sm text-white"
              disabled={processing}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-lg w-32 h-32 object-cover border border-white-700"
                  style={{ maxWidth: 128, maxHeight: 128 }}
                />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); setData('imageUrl', null); }}
                  className="ml-2 text-xs text-pink-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <Input
            type="text"
            placeholder="Comma separated labels (e.g. work, personal), no space allowed"
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
          <Button
            type="button"
            onClick={onCancel}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#3A3A3C] text-white rounded-lg hover:bg-[#48484A] transition-colors duration-200 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={processing || isUploading || !data.title.trim()}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-white rounded-lg hover:bg-[#0A74FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            <Save size={16} />
            {processing ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          </Button>
        </div>

      </form>
    </motion.div>
  )
}
