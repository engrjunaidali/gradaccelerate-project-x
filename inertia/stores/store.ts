import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import type {
  NotesSlice,
  TodosSlice,
} from './storeTypes'
import { createNotesSlice } from './createNotesSlice'
import { createTodosSlice } from './createTodosSlice'

const useAppStore = create<
  NotesSlice &
  TodosSlice
>()(
  devtools(
    (...a) => ({
      ...createNotesSlice(...a),
      ...createTodosSlice(...a),
    }),
    {
      name: 'appStore',
      trace: true,
    }
  )
)

export default useAppStore
