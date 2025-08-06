import { create } from 'zustand';
import { Todo } from '../../app/models/todo';

export interface TodoCardStore {
  // State
  selectedTodo: Todo | null;
  isViewModalOpen: boolean;

  // Actions
  setSelectedTodo: (todo: Todo | null) => void;
  setIsViewModalOpen: (open: boolean) => void;
  handleView: (todo: Todo) => void;
  handleEdit: (todo: Todo) => void;
  handleDelete: (id: number) => void;
}

export const useTodoCardStore = create<TodoCardStore>((set) => ({
  // Initial state
  selectedTodo: null,
  isViewModalOpen: false,

  // Actions
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  setIsViewModalOpen: (open) => set({ isViewModalOpen: open }),

  handleView: (todo) => {
    set({ selectedTodo: todo, isViewModalOpen: true });
  },

  handleEdit: (todo) => {
    // This will be connected to the existing useTodosStore's handleEdit
    set({ selectedTodo: null });
  },

  handleDelete: (id) => {
    // This will be connected to the existing useTodosStore's deleteTodo
    set({ selectedTodo: null });
  }
}));