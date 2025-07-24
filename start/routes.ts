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
const GoogleAuthController = () => import('#controllers/google_auth_controller')
const WeatherController = () => import('#controllers/weather_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'


router.get('/', ({ inertia }) => inertia.render('home'))

// ---------------- Notes routes with session authentication

router.get('/auth/session/signup', ({ inertia }) => inertia.render('auth/signup'))
router.get('/auth/session/login', ({ inertia }) => inertia.render('auth/login'))

// Authentication routes for Notes App (Session-based)
router.group(() => {
  router.post('/signup', [AuthController, 'sessionSignup'])
  router.post('/login', [AuthController, 'sessionLogin'])
  router.post('/logout', [AuthController, 'sessionLogout'])
}).prefix('/auth/session')

router.group(() => {
  router.get('/', [NotesController, 'index'])        // GET /notes
  router.post('/', [NotesController, 'store'])       // POST /notes
  router.put('/:id', [NotesController, 'update'])    // PUT /notes/:id
  router.patch('/:id/toggle-pin', [NotesController, 'togglePin'])
  router.delete('/:id', [NotesController, 'destroy']) // DELETE /notes/:id
  router.post('/:id/share', [NotesController, 'share'])
})
  .prefix('/notes').middleware([middleware.auth()])

router.get('/notes/shared/:token', [NotesController, 'showShared'])



// ---------------- Authentication routes for Todo App (JWT-based)


// JWT-based authentication pages
router.get('/auth/jwt/signup', ({ inertia }) => inertia.render('auth/todo-signup'))
router.get('/auth/jwt/login', ({ inertia }) => inertia.render('auth/todo-login'))

router.group(() => {
  router.post('/signup', [AuthController, 'jwtSignup'])
  router.post('/login', [AuthController, 'jwtLogin'])
  router.post('/logout', [AuthController, 'jwtLogout']).use(middleware.auth({ guards: ['api'] }))
}).prefix('/api/auth/jwt')

router.group(() => {
  router.get('/', [TodosController, 'index'])               // GET /api/todos
  router.post('/', [TodosController, 'store'])              // POST /api/todos
  router.get('/:id', [TodosController, 'show'])             // GET /api/todos/:id
  router.put('/:id', [TodosController, 'update'])           // PUT /api/todos/:id
  router.delete('/:id', [TodosController, 'destroy'])       // DELETE /api/todos/:id
  router.post('/upload', [TodosController, 'uploadImage'])
})
  .prefix('/api/todos')
  .use(middleware.auth({ guards: ['api'] }))

router.get('/todos', ({ inertia }) => { return inertia.render('todos/index') })


// ---------------- Google Authentication routes

router.get('/auth/google/notes', [GoogleAuthController, 'redirectForNotes'])
router.get('/auth/google/todos', [GoogleAuthController, 'redirectForTodos'])
router.get('/auth/google/callback', [GoogleAuthController, 'callback'])
router.get('/auth/google/token', [GoogleAuthController, 'handleToken'])

router.group(() => {
  router.get('/', [WeatherController, 'index'])        // GET /weather - Dashboard
  router.post('/coordinates', [WeatherController, 'getWeatherByCoordinates'])  // POST /weather/coordinates
  router.post('/city', [WeatherController, 'getWeatherByCity'])                // POST /weather/city
  router.get('/location', [WeatherController, 'getLocationByIP'])              // GET /weather/location
})
  .prefix('/weather')
