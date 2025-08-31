// Import shared types
import type { ViewType, SortConfig, SortField, PaginationMeta } from './sharedTypes'

// Reminders Module Types
export interface Reminder {
  id: number;
  title: string;
  description: string | null;
  reminderDateTime: string; // ISO string from DateTime
  isEmailNotification: boolean;
  isBrowserNotification: boolean;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string | null;
  userId: number;
}

export interface ReminderFormData {
  title: string;
  description?: string | null;
  reminderDateTime: string; // ISO string
  isEmailNotification: boolean;
  isBrowserNotification: boolean;
}

export interface RemindersData {
  data: Reminder[];
  meta: PaginationMeta;
}

// Reminders Slice Type
export interface RemindersSlice {
  // UI State
  isFormVisible: boolean;
  viewType: ViewType;
  searchQuery: string;
  sortConfig: SortConfig;
  deleteConfirm: number | null;
  isEditing: boolean;
  editingReminderId: number | null;
  filterStatus: 'all' | 'pending' | 'completed' | 'cancelled';

  // Form State
  formData: ReminderFormData;
  processing: boolean;
  errors: Record<string, string>;

  // Simple setters
  setIsFormVisible: (visible: boolean) => void;
  setViewType: (type: ViewType) => void;
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setDeleteConfirm: (id: number | null) => void;
  setIsEditing: (editing: boolean) => void;
  setEditingReminderId: (id: number | null) => void;
  setFilterStatus: (status: 'all' | 'pending' | 'completed' | 'cancelled') => void;

  // Form setters
  setFormData: (data: Partial<ReminderFormData>) => void;
  setProcessing: (processing: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetFormData: () => void;

  // Complex actions
  handleReminderEdit: (reminder: Reminder) => void;
  handleReminderDelete: (id: number) => void;
  handlePageChange: (page: number, remindersData: RemindersData) => void;
  handleSearch: (value: string) => void;
  handleMarkComplete: (id: number) => void;
  handleSort: (field: SortField, currentPage: number) => void;
  handleFilterStatus: (status: 'all' | 'pending' | 'completed' | 'cancelled') => void;
  handleLogout: () => void;
  resetForm: () => void;
  closeForm: () => void;

  // Form actions
  handleSubmit: (e: React.FormEvent, editingReminder: Reminder | null, onSuccess?: () => void) => void;
}
