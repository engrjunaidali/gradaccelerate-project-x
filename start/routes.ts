/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// const NotesController = () => import('#controllers/notes_controller')
import NotesController from '#controllers/notes_controller'

import router from '@adonisjs/core/services/router'


router.get('/', ({ inertia }) => inertia.render('home'))
router.get('/todos', ({ inertia }) => inertia.render('todos/empty'))


router.group(() => {
    router.get('/', [NotesController, 'index'])
    router.get('/:id', [NotesController, 'show'])
    router.post('', [NotesController, 'store'])
    router.put('/:id', [NotesController, 'update'])
    router.patch('/:id/toggle-pin', [NotesController, 'togglePin'])
    router.delete('/:id', [NotesController, 'destroy'])
}).prefix('/notes')