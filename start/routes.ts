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
const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'


router.get('/', ({ inertia }) => inertia.render('home'))

// Session-based authentication pages
router.get('/auth/session/signup', ({ inertia }) => inertia.render('auth/signup'))
router.get('/auth/session/login', ({ inertia }) => inertia.render('auth/login'))

// Authentication routes for Notes App (Session-based)
router.group(() => {
  router.post('/signup', [AuthController, 'sessionSignup'])
  router.post('/login', [AuthController, 'sessionLogin'])
  router.post('/logout', [AuthController, 'sessionLogout'])
}).prefix('/auth/session')

// Notes routes with session authentication
router.group(() => {
  router.get('/', [NotesController, 'index'])        // GET /notes
  router.post('/', [NotesController, 'store'])       // POST /notes
  router.put('/:id', [NotesController, 'update'])    // PUT /notes/:id
  router.patch('/:id/toggle-pin', [NotesController, 'togglePin'])
  router.delete('/:id', [NotesController, 'destroy']) // DELETE /notes/:id
}).prefix('/notes').middleware([middleware.auth()])

router.group(() => {
  router.get('/', [TodosController, 'index'])        // GET /todos
  router.post('/', [TodosController, 'store'])       // POST /todos
  router.get('/:id', [TodosController, 'show'])      // GET /todos/:id
  router.put('/:id', [TodosController, 'update'])    // PUT /todos/:id
  router.delete('/:id', [TodosController, 'destroy']) // DELETE /todos/:id
  router.post('/upload', [TodosController, 'uploadImage'])
}).prefix('/todos')

