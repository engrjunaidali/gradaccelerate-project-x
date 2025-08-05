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


router.group(() => {
    router.get('/', [TodosController, 'index'])        // GET /todos
    router.post('/', [TodosController, 'store'])       // POST /todos
    router.get('/:id', [TodosController, 'show'])      // GET /todos/:id
    router.put('/:id', [TodosController, 'update'])    // PUT /todos/:id
    router.delete('/:id', [TodosController, 'destroy']) // DELETE /todos/:id
    router.post('/upload', [TodosController, 'uploadImage'])
}).prefix('/todos')

// image upload route

router.group(() => {
  router.get('/', [NotesController, 'index'])
    router.get('/:id', [NotesController, 'show'])
    router.post('', [NotesController, 'store'])
    router.put('/:id', [NotesController, 'update'])
    router.patch('/:id/toggle-pin', [NotesController, 'togglePin'])
    router.delete('/:id', [NotesController, 'destroy'])
}).prefix('/notes')
