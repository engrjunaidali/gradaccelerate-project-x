type NoteData = {
  id: number,
  title: string,
  content: string,
  createdAt: Date,
  updatedAt: Date
}

class MockDatabase {
  private notes: NoteData[] = []
  private idCounter = 1

  async create(note: { title: string; content: string }): Promise<NoteData> {
    const newNote = {
      id: this.idCounter++,
      title: note.title,
      content: note.content,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.notes.push(newNote)
    return newNote
  }

  async find(id: number): Promise<NoteData | null> {
    return this.notes.find(note => note.id === id) || null
  }

  async update(id: number, data: Partial<{ title: string; content: string }>): Promise<NoteData | null> {
    const note = this.notes.find(note => note.id === id)
    if (!note) return null
    if (data.title !== undefined) note.title = data.title
    if (data.content !== undefined) note.content = data.content
    note.updatedAt = new Date()
    return note
  }

  async delete(id: number): Promise<boolean> {
    const index = this.notes.findIndex(note => note.id === id)
    if (index === -1) return false
    this.notes.splice(index, 1)
    return true
  }
}

export const mockDb = new MockDatabase()
