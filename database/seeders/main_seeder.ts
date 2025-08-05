import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  private async runSeeder(seederClass: string) {
    const { default: seeder } = await import(`./${seederClass}`)
    await new seeder(this.client).run()
  }

  async run() {
    // Run seeders in order
    await this.runSeeder('todo_seeder')
    await this.runSeeder('note_seeder')

  }
}
