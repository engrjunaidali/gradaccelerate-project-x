import { create } from 'zustand'
import { router } from '@inertiajs/react'

interface Note {
  id: number;
  title: string;
  content: string;
  status: any; // Replace with your NoteStatus type
  pinned: boolean;
  createdAt: string;
  updatedAt: string | null;
  labels?: string[];
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface NotesData {
  data: Note[];
  meta: PaginationMeta;
}

type ViewType = 'grid' | 'list'
type SortField = 'created_at' | 'updated_at' | 'title'
type SortDirection = 'asc' | 'desc'

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface NotesState {
  // UI State
  isFormVisible: boolean;
  viewType: ViewType;
  selectedLabel: string | null;
  searchQuery: string;
  sortConfig: SortConfig;
  deleteConfirm: number | null;
  isEditing: boolean;
  editingNoteId: number | null;

  // Actions
  setIsFormVisible: (visible: boolean) => void;
  setViewType: (type: ViewType) => void;
  setSelectedLabel: (label: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setDeleteConfirm: (id: number | null) => void;
  setIsEditing: (editing: boolean) => void;
  setEditingNoteId: (id: number | null) => void;

  // Complex Actions
  handleEdit: (note: Note) => void;
  handleDelete: (id: number) => void;
  handlePageChange: (page: number, notesData: NotesData) => void;
  handleSearch: (value: string) => void;
  handleTogglePin: (id: number) => void;
  handleSort: (field: SortField, currentPage: number) => void;
  handleLogout: () => void;
  resetForm: () => void;
  closeForm: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  // Initial state
  isFormVisible: false,
  viewType: 'grid',
  selectedLabel: null,
  searchQuery: '',
  sortConfig: {
    field: 'created_at',
    direction: 'desc'
  },
  deleteConfirm: null,
  isEditing: false,
  editingNoteId: null,

  // Simple setters
  setIsFormVisible: (visible) => set({ isFormVisible: visible }),
  setViewType: (type) => set({ viewType: type }),
  setSelectedLabel: (label) => set({ selectedLabel: label }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortConfig: (config) => set({ sortConfig: config }),
  setDeleteConfirm: (id) => set({ deleteConfirm: id }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setEditingNoteId: (id) => set({ editingNoteId: id }),

  // Complex actions
  handleEdit: (note) => {
    set({
      isEditing: true,
      editingNoteId: note.id,
      isFormVisible: true
    });
  },

  handleDelete: (id) => {
    router.delete(`/notes/${id}`, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        set({ deleteConfirm: null });
      }
    });
  },

  handlePageChange: (page, notesData) => {
    const { sortConfig, searchQuery } = get();
    router.get('/notes', {
      page,
      sort: sortConfig.field,
      direction: sortConfig.direction,
      search: searchQuery
    }, {
      preserveState: true,
      preserveScroll: true
    });
  },

  handleSearch: (value) => {
    const { sortConfig } = get();
    set({ searchQuery: value });
    router.get('/notes', {
      page: 1,
      sort: sortConfig.field,
      direction: sortConfig.direction,
      search: value
    }, {
      preserveState: true,
      preserveScroll: true
    });
  },

  handleTogglePin: (id) => {
    router.patch(`/notes/${id}/toggle-pin`, {}, {
      preserveState: true,
      preserveScroll: true,
      only: ['notes']
    });
  },

  handleSort: (field, currentPage) => {
    const { sortConfig } = get();
    const newDirection: SortDirection = sortConfig.field === field && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    const newSortConfig = { field, direction: newDirection };

    set({ sortConfig: newSortConfig });

    router.get('/notes', {
      page: currentPage,
      sort: field,
      direction: newDirection
    }, {
      preserveState: true,
      preserveScroll: true
    });
  },

  handleLogout: () => {
    router.post('/auth/session/logout', {}, {
      onSuccess: () => {
        // Redirect will be handled by the controller
      }
    });
  },

  resetForm: () => {
    set({
      isEditing: false,
      editingNoteId: null,
      isFormVisible: false
    });
  },

  closeForm: () => {
    set({
      isEditing: false,
      editingNoteId: null,
      isFormVisible: false
    });
  }
}));
