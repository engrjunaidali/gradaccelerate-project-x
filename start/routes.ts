/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const NotesController = () => import('#controllers/notes_controller')
const TodosController = () => import('#controllers/todos_controller')
import router from '@adonisjs/core/services/router'

router.get('/', ({ inertia }) => inertia.render('home'))
// router.get('/todos', ({ inertia }) => inertia.render('todos/empty'))

router.get('/todos', [TodosController, 'index'])  // Fetch all todos
router.post('/todos', [TodosController, 'store'])  // Create a new todo
router.get('/todos/:id', [TodosController, 'show'])  // Get a single todo
router.put('/todos/:id', [TodosController, 'update'])  // Update a todo
router.delete('/todos/:id', [TodosController, 'destroy'])  // Delete a todo

// image upload route
router.post('/todos/upload', [TodosController, 'uploadImage'])
    
router.get('/notes', [NotesController, 'index'])
router.post('/notes', [NotesController, 'store'])
router.put('/notes/:id', [NotesController, 'update'])
router.delete('/notes/:id', [NotesController, 'destroy'])
