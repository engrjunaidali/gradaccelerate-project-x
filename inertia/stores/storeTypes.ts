// Store Types
export interface Note {
  id: number;
  title: string;
  content: string;
  status: any;
  pinned: boolean;
  createdAt: string;
  updatedAt: string | null;
  labels?: string[];
}

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

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  isFavorite: boolean;
  description?: string | null;
  imageUrl?: string | null;
  siteName?: string | null;
  ogType?: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface GiphyGif {
  id: string
  title: string
  url: string
  images: {
    original: {
      url: string
      width: string
      height: string
    }
    fixed_height: {
      url: string
      width: string
      height: string
    }
    fixed_width: {
      url: string
      width: string
      height: string
    }
    preview_gif: {
      url: string
      width: string
      height: string
    }
  }
}

export interface NoteFormData {
  title: string;
  content: string;
  status: any;
  pinned: boolean;
  labels: string[];
}

export interface TodoFormData {
  title: string;
  content: string;
  status: any;
  labels: string[];
  imageUrl: string;
  priority: any;
}

export interface BookmarkFormData {
  title: string;
  url: string;
  isFavorite: boolean;
  description?: string | null;
  imageUrl?: string | null;
  siteName?: string | null;
  ogType?: string | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface NotesData {
  data: Note[];
  meta: PaginationMeta;
}

export interface BookmarksData {
  data: Bookmark[];
  meta: PaginationMeta;
}

export type ViewType = 'grid' | 'list'
export type SortField = 'created_at' | 'updated_at' | 'title'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// Notes Slice Type
export interface NotesSlice {
  // UI State
  isFormVisible: boolean;
  viewType: ViewType;
  selectedLabel: string | null;
  searchQuery: string;
  sortConfig: SortConfig;
  deleteConfirm: number | null;
  isEditing: boolean;
  editingNoteId: number | null;

  // Form State
  showPreview: boolean;
  shareableLink: string | null;
  showGiphyPicker: boolean;
  giphySearchQuery: string;
  formData: NoteFormData;
  processing: boolean;
  errors: Record<string, string>;

  // Note Card Utilities
  getStatusColor: (status: string) => string;

  // Actions
  setIsFormVisible: (visible: boolean) => void;
  setViewType: (type: ViewType) => void;
  setSelectedLabel: (label: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setDeleteConfirm: (id: number | null) => void;
  setIsEditing: (editing: boolean) => void;
  setEditingNoteId: (id: number | null) => void;

  // Form Actions
  setShowPreview: (show: boolean) => void;
  setShareableLink: (link: string | null) => void;
  setShowGiphyPicker: (show: boolean) => void;
  setGiphySearchQuery: (query: string) => void;
  setFormData: (data: Partial<NoteFormData>) => void;
  setProcessing: (processing: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetFormData: () => void;

  // Complex Actions
  handleNoteEdit: (note: Note) => void;
  handleNoteDelete: (id: number) => void;
  handlePageChange: (page: number, notesData: NotesData) => void;
  handleSearch: (value: string) => void;
  handleTogglePin: (id: number) => void;
  handleSort: (field: SortField, currentPage: number) => void;
  handleLogout: () => void;
  resetForm: () => void;
  closeForm: () => void;

  // Form Complex Actions
  handleShare: (editingNote: Note | null) => Promise<void>;
  handleSubmit: (e: React.FormEvent, editingNote: Note | null, onSuccess?: () => void) => void;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleGifSelect: (gif: GiphyGif, textareaRef: React.RefObject<HTMLTextAreaElement>) => void;
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

// Bookmarks Slice Type
export interface BookmarksSlice {
  // UI State
  isFormVisible: boolean;
  viewType: ViewType;
  searchQuery: string;
  sortConfig: SortConfig;
  deleteConfirm: number | null;
  isEditing: boolean;
  editingBookmarkId: number | null;
  filterFavorites: boolean;

  // Form State
  formData: BookmarkFormData;
  processing: boolean;
  errors: Record<string, string>;

  // Simple setters
  setIsFormVisible: (visible: boolean) => void;
  setViewType: (type: ViewType) => void;
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setDeleteConfirm: (id: number | null) => void;
  setIsEditing: (editing: boolean) => void;
  setEditingBookmarkId: (id: number | null) => void;
  setFilterFavorites: (filter: boolean) => void;

  // Form setters
  setFormData: (data: Partial<BookmarkFormData>) => void;
  setProcessing: (processing: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetFormData: () => void;

  // Complex actions
  handleBookmarkEdit: (bookmark: Bookmark) => void;
  handleBookmarkDelete: (id: number) => void;
  handlePageChange: (page: number, bookmarksData: BookmarksData) => void;
  handleSearch: (value: string) => void;
  handleToggleFavorite: (id: number) => void;
  handleSort: (field: SortField, currentPage: number) => void;
  handleFilterFavorites: (filter: boolean) => void;
  handleLogout: () => void;
  resetForm: () => void;
  closeForm: () => void;

  // Form actions
  handleSubmit: (e: React.FormEvent, editingBookmark: Bookmark | null, onSuccess?: () => void) => void;
}
