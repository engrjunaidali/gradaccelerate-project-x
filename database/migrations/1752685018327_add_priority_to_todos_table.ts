import { BaseSchema } from '@adonisjs/lucid/schema'
import { TodoPriority } from '../../app/enums/TodoPriority.js'

export default class extends BaseSchema {
  protected tableName = 'todos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('priority', [TodoPriority.HIGH, TodoPriority.MEDIUM, TodoPriority.LOW]).defaultTo(TodoPriority.MEDIUM)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('priority')
    })
  }
}
