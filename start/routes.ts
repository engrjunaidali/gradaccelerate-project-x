/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const NotesController = () => import('#controllers/notes_controller')
import router from '@adonisjs/core/services/router'

router.get('/', ({ inertia }) => inertia.render('home'))
router.get('/todos', ({ inertia }) => inertia.render('todos/empty'))

router.get('/notes', [NotesController, 'index'])
router.post('/notes', [NotesController, 'store'])
router.put('/notes/:id', [NotesController, 'update'])
router.patch('/notes/:id/toggle-pin', [NotesController, 'togglePin'])
router.delete('/notes/:id', [NotesController, 'destroy'])
