import { StateCreator } from 'zustand'
import { router } from '@inertiajs/react'
import axios from 'axios'
import { NoteStatus } from '../../app/enums/NoteStatus.js'
import type {
  NotesSlice,
  TodosSlice,
  Note,
  NoteFormData,
  NotesData,
  SortField,
  SortDirection,
  GiphyGif
} from './storeTypes'

const initialNoteFormData: NoteFormData = {
  title: '',
  content: '',
  status: NoteStatus.PENDING,
  pinned: false,
  labels: []
}

export const createNotesSlice: StateCreator<
  NotesSlice & TodosSlice,
  [],
  [],
  NotesSlice
> = (set, get) => ({
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

  // Form initial state
  showPreview: false,
  shareableLink: null,
  showGiphyPicker: false,
  giphySearchQuery: '',
  formData: initialNoteFormData,
  processing: false,
  errors: {},

  // Note Card Utilities
  getStatusColor: (status: string) => {
    switch (status) {
      case NoteStatus.PENDING: return 'bg-gray-500/20 text-gray-300'
      case NoteStatus.IN_PROGRESS: return 'bg-blue-500/20 text-blue-300'
      case NoteStatus.COMPLETED: return 'bg-green-500/20 text-green-300'
      default: return 'bg-gray-500/20 text-gray-300'
    }
  },

  // Simple setters
  setIsFormVisible: (visible) => set({ isFormVisible: visible }),
  setViewType: (type) => set({ viewType: type }),
  setSelectedLabel: (label) => set({ selectedLabel: label }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortConfig: (config) => set({ sortConfig: config }),
  setDeleteConfirm: (id) => set({ deleteConfirm: id }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setEditingNoteId: (id) => set({ editingNoteId: id }),

  // Form setters
  setShowPreview: (show) => set({ showPreview: show }),
  setShareableLink: (link) => set({ shareableLink: link }),
  setShowGiphyPicker: (show) => set({ showGiphyPicker: show }),
  setGiphySearchQuery: (query) => set({ giphySearchQuery: query }),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setProcessing: (processing) => set({ processing }),
  setErrors: (errors) => set({ errors }),
  resetFormData: () => set({
    formData: initialNoteFormData,
    errors: {},
    showPreview: false,
    shareableLink: null,
    showGiphyPicker: false,
    giphySearchQuery: ''
  }),

  // Complex actions
  handleNoteEdit: (note) => {
    console.log('handleNoteEdit called with note:', note);

    // Ensure proper type conversion and fallbacks
    const formData: NoteFormData = {
      title: note.title || '',
      content: note.content || '',
      status: note.status || NoteStatus.PENDING,
      pinned: Boolean(note.pinned),
      labels: Array.isArray(note.labels) ? note.labels : []
    };

    console.log('Setting form data to:', formData);

    // Use functional update to ensure state is set properly
    set((state) => {
      console.log('Previous state:', state.formData);
      const newState = {
        isEditing: true,
        editingNoteId: note.id,
        isFormVisible: true,
        formData,
        // Reset other form-related state
        errors: {},
        showPreview: false,
        shareableLink: null,
        showGiphyPicker: false,
        giphySearchQuery: ''
      };
      console.log('New state will be:', newState);
      return newState;
    });
  },

  handleNoteDelete: (id) => {
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
      isFormVisible: false,
      formData: initialNoteFormData,
      errors: {},
      showPreview: false,
      shareableLink: null,
      showGiphyPicker: false,
      giphySearchQuery: ''
    });
  },

  closeForm: () => {
    set({
      isEditing: false,
      editingNoteId: null,
      isFormVisible: false,
      formData: initialNoteFormData,
      errors: {},
      showPreview: false,
      shareableLink: null,
      showGiphyPicker: false,
      giphySearchQuery: ''
    });
  },

  // Form complex actions
  handleShare: async (editingNote) => {
    if (!editingNote) return;
    try {
      const response = await axios.post(`/notes/${editingNote.id}/share`);
      set({ shareableLink: response.data.shareableLink });
    } catch (error) {
      console.error("Failed to share note:", error);
    }
  },

  handleSubmit: (e, editingNote, onSuccess) => {
    e.preventDefault();
    const { formData } = get();
    set({ processing: true, errors: {} });

    // Convert formData to a plain object to fix the type issue
    const formDataObject = { ...formData } as Record<string, any>;

    if (editingNote) {
      router.put(`/notes/${editingNote.id}`, formDataObject, {
        onSuccess: () => {
          set({ processing: false });
          onSuccess?.();
          get().resetFormData();
        },
        onError: (errors) => {
          set({ processing: false, errors });
        }
      });
    } else {
      router.post('/notes', formDataObject, {
        onSuccess: () => {
          set({ processing: false });
          onSuccess?.();
          get().resetFormData();
        },
        onError: (errors) => {
          set({ processing: false, errors });
        }
      });
    }
  },

  handleContentChange: (e) => {
    const newContent = e.target.value;
    get().setFormData({ content: newContent });

    // Check for slash commands
    const lines = newContent.split('\n');
    const currentLineIndex = e.target.selectionStart ?
      newContent.substring(0, e.target.selectionStart).split('\n').length - 1 :
      lines.length - 1;
    const currentLine = lines[currentLineIndex] || '';

    // Detect /giphy command
    const giphyMatch = currentLine.match(/\/giphy\s+(.+)$/);
    if (giphyMatch) {
      const searchQuery = giphyMatch[1].trim();
      if (searchQuery) {
        set({ giphySearchQuery: searchQuery, showGiphyPicker: true });
      }
    }
  },

  handleGifSelect: (gif, textareaRef) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const { formData } = get();
    const content = formData.content;
    const lines = content.split('\n');

    // Find the line with /giphy command
    const lineStartPosition = content.lastIndexOf('\n', cursorPosition - 1) + 1;
    const lineEndPosition = content.indexOf('\n', cursorPosition);
    const currentLine = content.substring(
      lineStartPosition,
      lineEndPosition === -1 ? content.length : lineEndPosition
    );

    // Replace /giphy command with GIF markdown
    const giphyMatch = currentLine.match(/\/giphy\s+(.+)$/);
    if (giphyMatch) {
      const gifMarkdown = `![${gif.title}](${gif.images.original.url})`;
      const newContent =
        content.substring(0, lineStartPosition) +
        currentLine.replace(/\/giphy\s+(.+)$/, gifMarkdown) +
        content.substring(lineEndPosition === -1 ? content.length : lineEndPosition);

      get().setFormData({ content: newContent });
    }

    set({ showGiphyPicker: false, giphySearchQuery: '' });
  }
})
