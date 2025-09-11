// Notes Module Types
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

export interface NoteFormData {
  title: string;
  content: string;
  status: any;
  pinned: boolean;
  labels: string[];
}

export interface NotesData {
  data: Note[];
  meta: PaginationMeta;
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

// Import shared types
import type { ViewType, SortConfig, PaginationMeta } from './sharedTypes'

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
  handleSort: (field: import('./sharedTypes').SortField, currentPage: number) => void;
  handleLogout: () => void;
  resetForm: () => void;
  closeForm: () => void;

  // Form Complex Actions
  handleShare: (editingNote: Note | null) => Promise<void>;
  handleSubmit: (e: React.FormEvent, editingNote: Note | null, onSuccess?: () => void) => void;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleGifSelect: (gif: GiphyGif, textareaRef: React.RefObject<HTMLTextAreaElement>) => void;
}
