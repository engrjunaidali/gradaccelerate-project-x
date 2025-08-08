import { motion } from 'framer-motion'
import { Save, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios';

import { Button } from "../../../inertia/components/ui.js/button"
import { Input } from "../../../inertia/components/ui.js/input"
import { Textarea } from "../../../inertia/components/ui.js/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../inertia/components/ui.js/select"

import { TodoPriority } from '../../../app/enums/TodoPriority'
import { TodoStatus } from '../../../app/enums/TodoStatus'
import { todoSchema, TodoFormData } from '../../schemas/todoSchema';

import { priorityColors } from "../../constants/priorityColors"
import { TodoStatusColors } from "../../constants/TodoStatusColors"


import { useTodosStore } from '../../stores/useTodosStore';

export default function TodoForm() {
  const {
    processing,
    editingTodo,
    handleCancel,
    createTodo,
    updateTodo
  } = useTodosStore();

  const isEditing = !!editingTodo;

  const [isUploading, setIsUploading] = useState(false);
  const [labelsInput, setLabelsInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize form with Zod validation
  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: editingTodo?.title || '',
      content: editingTodo?.content || '',
      status: editingTodo?.status || TodoStatus.PENDING,
      priority: editingTodo?.priority || TodoPriority.MEDIUM,
      labels: editingTodo?.labels || [],
      imageUrl: editingTodo?.imageUrl || ''
    }
  });

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = form;
  const watchedLabels = watch('labels');
  const watchedImageUrl = watch('imageUrl');
  const watchedTitle = watch('title');



  useEffect(() => {
    if (editingTodo) {
      reset({
        title: editingTodo.title,
        content: editingTodo.content,
        status: editingTodo.status,
        priority: editingTodo.priority,
        labels: editingTodo.labels || [],
        imageUrl: editingTodo.imageUrl || ''
      });
      setLabelsInput((editingTodo.labels || []).join(', '));
      setImagePreview(editingTodo.imageUrl);
    } else {
      reset({
        title: '',
        content: '',
        status: TodoStatus.PENDING,
        priority: TodoPriority.MEDIUM,
        labels: [],
        imageUrl: ''
      });
      setLabelsInput('');
      setImagePreview(null);
    }
  }, [editingTodo, reset]);

  useEffect(() => {
    setLabelsInput((watchedLabels || []).join(', '));
  }, [watchedLabels]);

  useEffect(() => {
    setImagePreview(watchedImageUrl || null);
  }, [watchedImageUrl]);

  // Form submission handler
  const onSubmit = async (data: TodoFormData) => {
    try {
      if (isEditing && editingTodo) {
        await updateTodo(editingTodo.id, data);
      } else {
        await createTodo(data);
      }

      // Clear form after successful submission
      reset({
        title: '',
        content: '',
        status: TodoStatus.PENDING,
        priority: TodoPriority.MEDIUM,
        labels: [],
        imageUrl: ''
      });

      // Clear additional UI state
      setLabelsInput('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // When file input changes
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        },
        withCredentials: true,
      });
      if (res.data.url) {
        setValue('imageUrl', res.data.url);
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Todo title..."
            {...register('title')}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                handleSubmit(onSubmit)();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            className="w-full"
            autoFocus
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Textarea
            placeholder="Todo content..."
            {...register('content')}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                handleSubmit(onSubmit)();
              } else if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            rows={4}
            className="w-full mb-3"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}

          <div className="mb-4">
            <Select
              {...register('status')}
              onValueChange={(value) => setValue('status', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TodoStatus.PENDING} className={TodoStatusColors[TodoStatus.PENDING]}>Pending</SelectItem>
                <SelectItem value={TodoStatus.IN_PROGRESS} className={TodoStatusColors[TodoStatus.IN_PROGRESS]}>In Progress</SelectItem>
                <SelectItem value={TodoStatus.COMPLETED} className={TodoStatusColors[TodoStatus.COMPLETED]}>Completed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
          </div>


          <div className="mb-4">
            <Select
              {...register('priority')}
              onValueChange={(value) => setValue('priority', value)}
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
            {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
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
                  onClick={() => { setImageFile(null); setImagePreview(null); setValue('imageUrl', ''); }}
                  className="ml-2 text-xs text-pink-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <Input
            type="text"
            placeholder="Labels (comma-separated)..."
            value={labelsInput}
            onChange={(e) => {
              setLabelsInput(e.target.value);
              const labels = e.target.value
                    .split(',')
                    .map(l => l.trim())
                    .filter(Boolean);
              setValue('labels', labels);
            }}
            className="w-full"
          />
          {errors.labels && <p className="text-red-500 text-sm mt-1">{errors.labels.message}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={handleCancel}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-[#3A3A3C] text-white rounded-lg hover:bg-[#48484A] transition-colors duration-200 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={processing || isUploading || !watchedTitle?.trim()}
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
