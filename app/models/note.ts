import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { NoteStatus } from '../enums/NoteStatus.js'
import User from './user.js'

export default class Note extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare status: typeof NoteStatus

  @column()
  declare pinned: boolean

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => value ? JSON.parse(value) : []
  })
  declare labels: string[]

  @column()
  declare userId: number

  @column()
  declare shared_token: string | null

  @column.dateTime()
  declare shared_token_expires_at: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
