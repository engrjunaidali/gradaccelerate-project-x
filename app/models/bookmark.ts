import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Bookmark extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare url: string

  @column()
  declare isFavorite: boolean

  @column()
  declare description: string | null

  @column()
  declare imageUrl: string | null

  @column()
  declare siteName: string | null

  @column()
  declare ogType: string | null

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => value ? JSON.parse(value) : []
  })
  declare labels: string[]

  @column()
  declare summary: string | null

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}