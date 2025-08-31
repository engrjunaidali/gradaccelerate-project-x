// Bookmarks Module Types
export interface Bookmark {
  id: number;
  title: string;
  url: string;
  isFavorite: boolean;
  description?: string | null;
  imageUrl?: string | null;
  siteName?: string | null;
  ogType?: string | null;
  labels?: string[];
  summary?: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface BookmarkFormData {
  title: string;
  url: string;
  isFavorite: boolean;
  description?: string | null;
  imageUrl?: string | null;
  siteName?: string | null;
  ogType?: string | null;
  labels?: string[];
  summary?: string | null;
}

export interface BookmarksData {
  data: Bookmark[];
  meta: PaginationMeta;
}

// Import shared types
import type { ViewType, SortConfig, SortField, PaginationMeta } from './sharedTypes'

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
