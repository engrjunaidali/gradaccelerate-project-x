import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Note from '#models/note'

export default class extends BaseSeeder {
  async run() {
    // Create sample notes
    await Note.createMany([
      {
        title: 'Welcome to Notes',
        content: 'This is your first note! You can create, edit, and delete notes using this application.',
        status: 'pending',
      },
      {
        title: 'Project Ideas',
        content: 'Here are some project ideas:\n\n- Build a task management app\n- Create a blog platform\n- Develop a weather dashboard\n- Design a recipe organizer',
        status: 'in-progress',
      },
      {
        title: 'Daily Reminders',
        content: 'Don\'t forget to:\n- Review your goals\n- Take breaks while working\n- Stay hydrated\n- Connect with friends and family',
        status: 'completed',
      },
      {
        title: 'Learning Resources',
        content: 'Great resources for learning:\n\n- Official documentation\n- Online tutorials\n- Community forums\n- Practice projects\n- Code reviews',
        status: 'completed',
      },
      {
        title: 'Meeting Notes - Team Sync',
        content: 'Meeting Date: Today\n\nAgenda:\n1. Project status update\n2. Upcoming deadlines\n3. Resource allocation\n4. Next steps\n\nAction items:\n- Complete feature implementation\n- Review code changes\n- Update documentation',
        status: 'in-progress',
      },
      {
        title: 'Shopping List',
        content: 'Grocery items needed:\n- Milk\n- Eggs\n- Bread\n- Fruits (apples, bananas)\n- Vegetables (carrots, spinach)\n- Chicken\n- Rice\n- Pasta',
        status: 'pending',
      },
      {
        title: 'Book Recommendations',
        content: 'Books to read:\n\n📚 Fiction:\n- The Great Gatsby\n- To Kill a Mockingbird\n- 1984\n\n📖 Non-Fiction:\n- Atomic Habits\n- The Psychology of Money\n- Sapiens',
        status: 'completed',
      },
      {
        title: 'Workout Plan',
        content: 'Weekly Exercise Schedule:\n\nMonday: Upper body strength\nTuesday: Cardio (30 min)\nWednesday: Core and flexibility\nThursday: Lower body strength\nFriday: Full body circuit\nSaturday: Outdoor activity\nSunday: Rest day',
        status: 'in-progress',
      },
      {
        title: 'Code Snippets',
        content: 'Useful code snippets:\n\n```javascript\n// Array methods\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst filtered = numbers.filter(n => n > 3);\n```\n\n```typescript\n// Type definitions\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n```',
        status: 'completed',
      },
      {
        title: 'Travel Plans',
        content: 'Upcoming trip planning:\n\n🏖️ Destination: Beach Resort\n📅 Dates: Next month\n✈️ Flight: Booked\n🏨 Hotel: Confirmed\n\nTo-do:\n- Pack sunscreen\n- Book activities\n- Check weather forecast\n- Prepare travel documents',
        status: 'pending',
      },
    ])

    console.log('✅ Notes seeded successfully!')
  }
}
