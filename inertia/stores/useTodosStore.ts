import { create } from 'zustand'
import { api } from '../lib/TodoAuth'
import { TodoStatus } from '../../app/enums/TodoStatus'
import { TodoPriority } from '../../app/enums/TodoPriority'

interface Todo {
  id: number;
  title: string;
  content: string;
  status: typeof TodoStatus;
  labels: string[] | null;
  imageUrl: string | null;
  priority: typeof TodoPriority;
  createdAt: string;
  updatedAt: string | null;
}

interface TodoFormData {
  title: string;
  content: string;
  status: typeof TodoStatus;
  labels: string[];
  imageUrl: string;
  priority: typeof TodoPriority;
}

interface TodoStore {
  // State
  todos: Todo[]
  isFormVisible: boolean
  editingTodo: Todo | null
  viewType: 'grid' | 'list'
  errors: { [key: string]: string }
  processing: boolean
  data: TodoFormData

  // Actions
  setTodos: (todos: Todo[]) => void
  setIsFormVisible: (visible: boolean) => void
  setEditingTodo: (todo: Todo | null) => void
  setViewType: (type: 'grid' | 'list') => void
  setErrors: (errors: { [key: string]: string }) => void
  setProcessing: (processing: boolean) => void
  setData: (data: TodoFormData) => void
  updateData: (field: keyof TodoFormData, value: any) => void

  // API Actions
  loadTodos: () => Promise<void>
  createTodo: (todoData: TodoFormData) => Promise<void>
  updateTodo: (id: number, todoData: TodoFormData) => Promise<void>
  deleteTodo: (id: number) => Promise<void>

  // Form Actions
  resetForm: () => void
  handleEdit: (todo: Todo) => void
  handleCancel: () => void
  submit: (e: React.FormEvent) => Promise<void>
}

const initialFormData: TodoFormData = {
  title: '',
  content: '',
  status: TodoStatus.PENDING,
  labels: [],
  imageUrl: '',
  priority: TodoPriority.MEDIUM
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  // Initial State
  todos: [],
  isFormVisible: false,
  editingTodo: null,
  viewType: 'grid',
  errors: {},
  processing: false,
  data: initialFormData,

  // Basic Setters
  setTodos: (todos) => set({ todos }),
  setIsFormVisible: (isFormVisible) => set({ isFormVisible }),
  setEditingTodo: (editingTodo) => set({ editingTodo }),
  setViewType: (viewType) => set({ viewType }),
  setErrors: (errors) => set({ errors }),
  setProcessing: (processing) => set({ processing }),
  setData: (data) => set({ data }),

  updateData: (field, value) => set((state) => ({
    data: {
      ...state.data,
      [field]: value
    }
  })),

  // API Actions
  loadTodos: async () => {
    try {
      const response = await api.get('/api/todos')
      set({ todos: response.data.todos || [] })
    } catch (error) {
      console.error('Failed to load todos:', error)
      if (error.response?.status === 401) {
        window.location.href = '/auth/jwt/login'
      }
    }
  },

  createTodo: async (todoData) => {
    try {
      const response = await api.post('/api/todos', todoData)
      const newTodo = response.data.todo
      const { todos } = get()
      set({ todos: [newTodo, ...todos] })
    } catch (error) {
      console.error('Create todo error:', error)
      throw error
    }
  },

  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/api/todos/${id}`, todoData)
      const updatedTodo = response.data.todo
      const { todos } = get()
      set({
        todos: todos.map(todo => todo.id === id ? updatedTodo : todo)
      })
    } catch (error) {
      console.error('Update todo error:', error)
      throw error
    }
  },

  deleteTodo: async (id) => {
    try {
      await api.delete(`/api/todos/${id}`)
      const { todos } = get()
      set({ todos: todos.filter(todo => todo.id !== id) })
    } catch (error) {
      console.error('Delete error:', error)
    }
  },

  // Form Actions
  resetForm: () => set({
    data: initialFormData,
    errors: {}
  }),

  handleEdit: (todo) => {
    set({
      data: {
        title: todo.title,
        content: todo.content,
        status: todo?.status || TodoStatus.PENDING,
        labels: todo.labels || [],
        imageUrl: todo.imageUrl || '',
        priority: todo?.priority || TodoPriority.MEDIUM
      },
      editingTodo: todo,
      isFormVisible: true
    })
  },

  handleCancel: () => {
    set({
      isFormVisible: false,
      editingTodo: null,
      data: initialFormData,
      errors: {}
    })
  },

  submit: async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, editingTodo, createTodo, updateTodo, resetForm } = get()

    set({ processing: true, errors: {} })

    try {
      // You'll need to import and use your TodoSchema here
      // const validatedData = TodoSchema.parse(data)

      if (editingTodo) {
        await updateTodo(editingTodo.id, data)
      } else {
        await createTodo(data)
      }

      resetForm()
      set({
        isFormVisible: false,
        editingTodo: null
      })
    } catch (error) {
      // Handle validation errors (you'll need to import z from 'zod')
      if (error.name === 'ZodError') {
        const fieldErrors: { [key: string]: string } = {}
        error.issues.forEach((err: any) => {
          if (err.path[0]) {
            const key = err.path[0] as string
            fieldErrors[key] = err.message
          }
        })
        set({ errors: fieldErrors })
      } else {
        console.error('Submit error:', error)
        set({ errors: { general: 'An error occurred. Please try again.' } })
      }
    } finally {
      set({ processing: false })
    }
  }
}))
