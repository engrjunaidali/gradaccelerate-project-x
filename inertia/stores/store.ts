import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type {
  NotesSlice,
  TodosSlice,
  BookmarksSlice,
  RemindersSlice,
} from './storeTypes'
import { createNotesSlice } from './createNotesSlice'
import { createTodosSlice } from './createTodosSlice'
import { createBookmarksSlice } from './createBookmarksSlice'
import { createRemindersSlice } from './createRemindersSlice'

const useAppStore = create<
  NotesSlice &
  TodosSlice &
  BookmarksSlice &
  RemindersSlice
>()(
  devtools(
    (...a) => ({
      ...createNotesSlice(...a),
      ...createTodosSlice(...a),
      ...createBookmarksSlice(...a),
      ...createRemindersSlice(...a),
    }),
    {
      name: 'appStore',
      trace: true,
    }
  )
)

export default useAppStore
