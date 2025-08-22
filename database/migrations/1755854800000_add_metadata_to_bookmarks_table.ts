import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookmarks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('description').nullable()
      table.string('image_url').nullable()
      table.string('site_name').nullable()
      table.string('og_type').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('description')
      table.dropColumn('image_url')
      table.dropColumn('site_name')
      table.dropColumn('og_type')
    })
  }
}