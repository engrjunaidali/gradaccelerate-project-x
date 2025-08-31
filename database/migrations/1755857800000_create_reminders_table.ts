import { BaseSchema } from '@adonisjs/lucid/schema'
import { ReminderStatus } from '../../app/enums/ReminderStatus.js'

export default class extends BaseSchema {
  protected tableName = 'reminders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('description').nullable()

      table.timestamp('reminder_datetime').notNullable()

      table.boolean('is_email_notification').defaultTo(false)

      table.boolean('is_browser_notification').defaultTo(false)

      table.enum('status', Object.values(ReminderStatus))
        .defaultTo(ReminderStatus.PENDING)

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
