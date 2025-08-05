import { BaseSchema } from '@adonisjs/lucid/schema'
import { TodoStatus } from '../../app/enums/TodoStatus.js'
export default class extends BaseSchema {
  protected tableName = 'todos'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('status', Object.values(TodoStatus))
        .defaultTo(TodoStatus.PENDING)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })
  }
}
