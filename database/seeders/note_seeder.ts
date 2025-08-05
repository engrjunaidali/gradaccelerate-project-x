import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Note from '#models/note'

import { NoteStatus } from '../../app/enums/NoteStatus.js'
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Create sample notes
    const statuses = Object.values(NoteStatus) as string[]
    
    const notes = Array.from({ length: 50 }, () => ({
      title: faker.lorem.words({ min: 2, max: 5 }),
      content: faker.lorem.paragraphs({ min: 1, max: 3 }),
      status: faker.helpers.arrayElement(statuses) as NoteStatus,
      pinned: faker.datatype.boolean(0.2), // 20% chance of being pinned
      createdAt: DateTime.fromJSDate(faker.date.recent({ days: 30 })), // Random date in last 30 days
      updatedAt: DateTime.fromJSDate(faker.date.recent({ days: 15 })), // Random date in last 15 days
    }))

    await Note.createMany(notes)

    console.log('✅ Notes seeded successfully!')
  }
}
