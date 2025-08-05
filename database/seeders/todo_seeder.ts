import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Todo from '#models/todo'

export default class extends BaseSeeder {
  async run() {
    // Create sample todos
    await Todo.createMany([
      {
      title: 'Work Tasks',
      content: 'Tasks to complete:\n\n- Prepare presentation\n- Submit report\n- Attend team meeting\n- Review project milestones',
      },
      {
      title: 'Personal Goals',
      content: 'Focus on:\n- Reading 20 pages daily\n- Exercising for 30 minutes\n- Learning a new skill\n- Meditating for 10 minutes',
      },
      {
      title: 'Shopping List',
      content: 'Items to buy:\n- Coffee\n- Snacks\n- Stationery\n- Cleaning supplies',
      },
      {
      title: 'Weekend Plans',
      content: 'Activities:\n- Visit the park\n- Watch a movie\n- Try a new recipe\n- Call friends',
      },
      {
      title: 'Learning Topics',
      content: 'Topics to explore:\n\n- JavaScript ES6 features\n- TypeScript basics\n- Database optimization\n- API design principles',
      },
      {
      title: 'Fitness Routine',
      content: 'Weekly schedule:\n\nMonday: Cardio\nTuesday: Strength training\nWednesday: Yoga\nThursday: HIIT\nFriday: Rest\nSaturday: Outdoor run\nSunday: Stretching',
      },
      {
      title: 'Books to Read',
      content: 'Recommended books:\n\n- Clean Code\n- The Pragmatic Programmer\n- You Don\'t Know JS\n- Designing Data-Intensive Applications',
      },
      {
      title: 'Travel Checklist',
      content: 'Essentials:\n- Passport\n- Tickets\n- Travel insurance\n- Packing list\n- Emergency contacts',
      },
      {
      title: 'Meeting Notes',
      content: 'Discussion points:\n\n1. Project updates\n2. Budget review\n3. Team feedback\n4. Next steps',
      },
    ])

    console.log('✅ Todos seeded successfully!')
  }
}