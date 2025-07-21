import { BaseSchema } from '@adonisjs/lucid/schema'
import { NoteStatus } from '../../app/enums/NoteStatus.js'
export default class extends BaseSchema {
  protected tableName = 'notes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('status', Object.values(NoteStatus))
        .defaultTo(NoteStatus.PENDING)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })
  }
}