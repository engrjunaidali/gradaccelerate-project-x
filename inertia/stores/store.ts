import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type {
  NotesSlice,
  TodosSlice,
  BookmarksSlice,
} from './storeTypes'
import { createNotesSlice } from './createNotesSlice'
import { createTodosSlice } from './createTodosSlice'
import { createBookmarksSlice } from './createBookmarksSlice'

const useAppStore = create<
  NotesSlice &
  TodosSlice &
  BookmarksSlice
>()(
  devtools(
    (...a) => ({
      ...createNotesSlice(...a),
      ...createTodosSlice(...a),
      ...createBookmarksSlice(...a),
    }),
    {
      name: 'appStore',
      trace: true,
    }
  )
)

export default useAppStore
