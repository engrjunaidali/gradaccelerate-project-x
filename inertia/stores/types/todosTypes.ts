// Todos Module Types
export interface Todo {
  id: number;
  title: string;
  content: string;
  status: any;
  labels: string[] | null;
  imageUrl: string | null;
  priority: any;
  createdAt: string;
  updatedAt: string | null;
}

export interface TodoFormData {
  title: string;
  content: string;
  status: any;
  labels: string[];
  imageUrl: string;
  priority: any;
}

// Todos Slice Type
export interface TodosSlice {
  // State
  todos: Todo[];
  isFormVisible: boolean;
  editingTodo: Todo | null;
  viewType: 'grid' | 'list';
  errors: { [key: string]: string };
  processing: boolean;
  data: TodoFormData;

  selectedTodo: Todo | null;
  isViewModalOpen: boolean;

  // Actions
  setTodos: (todos: Todo[]) => void;
  setIsFormVisible: (visible: boolean) => void;
  setEditingTodo: (todo: Todo | null) => void;
  setViewType: (type: 'grid' | 'list') => void;
  setErrors: (errors: { [key: string]: string }) => void;
  setProcessing: (processing: boolean) => void;
  setData: (data: TodoFormData) => void;
  updateData: (field: keyof TodoFormData, value: any) => void;

  setSelectedTodo: (todo: Todo | null) => void;
  setIsViewModalOpen: (open: boolean) => void;

  // API Actions
  loadTodos: () => Promise<void>;
  createTodo: (todoData: TodoFormData) => Promise<void>;
  updateTodo: (id: number, todoData: TodoFormData) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;

  // Form Actions
  resetForm: () => void;
  handleTodoEdit: (todo: Todo) => void;
  handleCancel: () => void;
  submit: (e: React.FormEvent) => Promise<void>;

  handleView: (todo: Todo) => void;
  handleTodoDelete: (id: number) => void;
}