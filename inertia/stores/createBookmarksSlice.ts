import { StateCreator } from 'zustand'
import { router } from '@inertiajs/react'
import type {
  BookmarksSlice,
  NotesSlice,
  TodosSlice,
  Bookmark,
  BookmarkFormData,
  BookmarksData,
  SortField,
  SortDirection
} from './storeTypes'

const initialBookmarkFormData: BookmarkFormData = {
  title: '',
  url: '',
  isFavorite: false
}

export const createBookmarksSlice: StateCreator<
  BookmarksSlice & NotesSlice & TodosSlice,
  [],
  [],
  BookmarksSlice
> = (set, get) => ({
  // Initial state
  isFormVisible: false,
  viewType: 'grid',
  searchQuery: '',
  sortConfig: {
    field: 'created_at',
    direction: 'desc'
  },
  deleteConfirm: null,
  isEditing: false,
  editingBookmarkId: null,
  filterFavorites: false,

  // Form initial state
  formData: initialBookmarkFormData,
  processing: false,
  errors: {},

  // Simple setters
  setIsFormVisible: (visible) => set({ isFormVisible: visible }),
  setViewType: (type) => set({ viewType: type }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortConfig: (config) => set({ sortConfig: config }),
  setDeleteConfirm: (id) => set({ deleteConfirm: id }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setEditingBookmarkId: (id) => set({ editingBookmarkId: id }),
  setFilterFavorites: (filter) => set({ filterFavorites: filter }),

  // Form setters
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setProcessing: (processing) => set({ processing }),
  setErrors: (errors) => set({ errors }),
  resetFormData: () => set({
    formData: initialBookmarkFormData,
    errors: {}
  }),

  // Complex actions
  handleBookmarkEdit: (bookmark) => {
    console.log('handleBookmarkEdit called with bookmark:', bookmark);

    const formData: BookmarkFormData = {
      title: bookmark.title || '',
      url: bookmark.url || '',
      isFavorite: Boolean(bookmark.isFavorite)
    };

    set({
      isEditing: true,
      editingBookmarkId: bookmark.id,
      isFormVisible: true,
      formData,
      errors: {}
    });
  },

  handleBookmarkDelete: (id) => {
    router.delete(`/bookmarks/${id}`, {
      onSuccess: () => {
        set({ deleteConfirm: null });
      }
    });
  },

  handlePageChange: (page, bookmarksData) => {
    const { searchQuery, sortConfig, filterFavorites } = get();
    const params = new URLSearchParams({
      page: page.toString(),
      sort: sortConfig.field,
      direction: sortConfig.direction,
      ...(searchQuery && { search: searchQuery }),
      ...(filterFavorites && { favorites: 'true' })
    });
    router.get(`/bookmarks?${params.toString()}`);
  },

  handleSearch: (value) => {
    set({ searchQuery: value });
    const { sortConfig, filterFavorites } = get();
    const params = new URLSearchParams({
      page: '1',
      sort: sortConfig.field,
      direction: sortConfig.direction,
      ...(value && { search: value }),
      ...(filterFavorites && { favorites: 'true' })
    });
    router.get(`/bookmarks?${params.toString()}`);
  },

  handleToggleFavorite: (id) => {
    router.patch(`/bookmarks/${id}/toggle-favorite`);
  },

  handleSort: (field, currentPage) => {
    const { sortConfig, searchQuery, filterFavorites } = get();
    const newDirection = sortConfig.field === field && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    const newSortConfig = { field, direction: newDirection };
    
    set({ sortConfig: newSortConfig });
    
    const params = new URLSearchParams({
      page: currentPage.toString(),
      sort: field,
      direction: newDirection,
      ...(searchQuery && { search: searchQuery }),
      ...(filterFavorites && { favorites: 'true' })
    });
    router.get(`/bookmarks?${params.toString()}`);
  },

  handleFilterFavorites: (filter) => {
    set({ filterFavorites: filter });
    const { searchQuery, sortConfig } = get();
    const params = new URLSearchParams({
      page: '1',
      sort: sortConfig.field,
      direction: sortConfig.direction,
      ...(searchQuery && { search: searchQuery }),
      ...(filter && { favorites: 'true' })
    });
    router.get(`/bookmarks?${params.toString()}`);
  },

  handleLogout: () => {
    router.post('/auth/session/logout');
  },

  resetForm: () => {
    set({
      isFormVisible: false,
      isEditing: false,
      editingBookmarkId: null,
      formData: initialBookmarkFormData,
      errors: {},
      processing: false
    });
  },

  closeForm: () => {
    set({
      isFormVisible: false,
      isEditing: false,
      editingBookmarkId: null,
      formData: initialBookmarkFormData,
      errors: {}
    });
  },

  handleSubmit: (e, editingBookmark, onSuccess) => {
    e.preventDefault();
    const { formData, isEditing, editingBookmarkId } = get();
    
    set({ processing: true, errors: {} });
    
    const url = isEditing && editingBookmarkId ? `/bookmarks/${editingBookmarkId}` : '/bookmarks';
    const method = isEditing ? 'patch' : 'post';
    
    router[method](url, formData, {
      onSuccess: () => {
        set({ processing: false });
        get().resetForm();
        if (onSuccess) onSuccess();
      },
      onError: (errors) => {
        set({ processing: false, errors });
      }
    });
  }
})