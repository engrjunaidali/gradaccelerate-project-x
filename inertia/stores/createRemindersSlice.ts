import { StateCreator } from 'zustand'
import { router } from '@inertiajs/react'
import type {
  RemindersSlice,
  Reminder,
  ReminderFormData,
  RemindersData,
  SortField,
  SortDirection
} from './storeTypes'



const initialReminderFormData: ReminderFormData = {
  title: '',
  description: '',
  reminderDateTime: '',
  isEmailNotification: false,
  isBrowserNotification: true
}

export const createRemindersSlice: StateCreator<
  RemindersSlice,
  [],
  [],
  RemindersSlice
> = (set, get) => ({
  // Initial state
  isFormVisible: false,
  viewType: 'grid',
  searchQuery: '',
  sortConfig: {
    field: 'reminder_datetime',
    direction: 'asc'
  },
  deleteConfirm: null,
  isEditing: false,
  editingReminderId: null,
  filterStatus: 'all',

  // Form initial state
  formData: initialReminderFormData,
  processing: false,
  errors: {},

  // Simple setters
  setIsFormVisible: (visible) => set({ isFormVisible: visible }),
  setViewType: (type) => set({ viewType: type }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortConfig: (config) => set({ sortConfig: config }),
  setDeleteConfirm: (id) => set({ deleteConfirm: id }),
  setIsEditing: (editing) => set({ isEditing: editing }),
  setEditingReminderId: (id) => set({ editingReminderId: id }),
  setFilterStatus: (status) => set({ filterStatus: status }),

  // Form setters
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setProcessing: (processing) => set({ processing }),
  setErrors: (errors) => set({ errors }),
  resetFormData: () => set({
    formData: initialReminderFormData,
    errors: {}
  }),

  // Complex actions
  handleReminderEdit: (reminder) => {
    console.log('handleReminderEdit called with reminder:', reminder);

    // Format the datetime for the input (datetime-local expects YYYY-MM-DDTHH:mm format)
    const formattedDateTime = reminder.reminderDateTime ?
      new Date(reminder.reminderDateTime).toISOString().slice(0, 16) : ''

    const formData: ReminderFormData = {
      title: reminder.title || '',
      description: reminder.description || '',
      reminderDateTime: formattedDateTime,
      isEmailNotification: Boolean(reminder.isEmailNotification),
      isBrowserNotification: Boolean(reminder.isBrowserNotification)
    };

    set({
      isEditing: true,
      editingReminderId: reminder.id,
      isFormVisible: true,
      formData,
      errors: {}
    });
  },

  handleReminderDelete: (id) => {
    router.delete(`/reminders/${id}`, {
      onSuccess: () => {
        set({ deleteConfirm: null });
      }
    });
  },

  handlePageChange: (page, remindersData) => {
    const { searchQuery, sortConfig, filterStatus } = get();
    const params = new URLSearchParams({
      page: page.toString(),
      sort: sortConfig.field,
      direction: sortConfig.direction,
      ...(searchQuery && { search: searchQuery }),
      ...(filterStatus !== 'all' && { status: filterStatus })
    });
    router.get(`/reminders?${params.toString()}`);
  },

  handleSearch: (value) => {
    set({ searchQuery: value });
    const { sortConfig, filterStatus } = get();
    const params = new URLSearchParams({
      page: '1',
      sort: sortConfig.field,
      direction: sortConfig.direction,
      ...(value && { search: value }),
      ...(filterStatus !== 'all' && { status: filterStatus })
    });
    router.get(`/reminders?${params.toString()}`);
  },

  handleMarkComplete: (id) => {
    router.patch(`/reminders/${id}/mark-complete`);
  },

  handleSort: (field, currentPage) => {
    const { sortConfig, searchQuery, filterStatus } = get();
    const newDirection = sortConfig.field === field && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    const newSortConfig = { field, direction: newDirection };

    set({ sortConfig: newSortConfig });

    const params = new URLSearchParams({
      page: currentPage.toString(),
      sort: field,
      direction: newDirection,
      ...(searchQuery && { search: searchQuery }),
      ...(filterStatus !== 'all' && { status: filterStatus })
    });
    router.get(`/reminders?${params.toString()}`);
  },

  handleFilterStatus: (status) => {
    set({ filterStatus: status });
    const { searchQuery, sortConfig } = get();
    const params = new URLSearchParams({
      page: '1',
      sort: sortConfig.field,
      direction: sortConfig.direction,
      ...(searchQuery && { search: searchQuery }),
      ...(status !== 'all' && { status })
    });
    router.get(`/reminders?${params.toString()}`);
  },

  handleLogout: () => {
    router.post('/auth/session/logout');
  },

  resetForm: () => {
    set({
      isFormVisible: false,
      isEditing: false,
      editingReminderId: null,
      formData: initialReminderFormData,
      errors: {},
      processing: false
    });
  },

  closeForm: () => {
    set({
      isFormVisible: false,
      isEditing: false,
      editingReminderId: null,
      formData: initialReminderFormData,
      errors: {}
    });
  },

  handleSubmit: (e, editingReminder, onSuccess) => {
    e.preventDefault();
    const { formData, isEditing, editingReminderId } = get();

    set({ processing: true, errors: {} });

    // Convert the datetime-local input to ISO string
    const submitData = {
      ...formData,
      reminderDateTime: new Date(formData.reminderDateTime).toISOString()
    };

    const url = isEditing && editingReminderId ? `/reminders/${editingReminderId}` : '/reminders';
    const method = isEditing ? 'patch' : 'post';

    router[method](url, submitData, {
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
