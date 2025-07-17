import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Todo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column({
    serialize: (value: string | null) => {
      if (!value) return null
      try {
        return JSON.parse(value)
      } catch {
        return []
      }
    },
    prepare: (value: string[] | null) => {
      if (!value || !Array.isArray(value)) return null
      return JSON.stringify(value)
    }
  })
  declare labels: string[] | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}