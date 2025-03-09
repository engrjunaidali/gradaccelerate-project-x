/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', ({ inertia }) => inertia.render('home'))
router.get('/todos', ({ inertia }) => inertia.render('todos/empty'))

router.get('/notes', '#controllers/notes_controller.index')
router.post('/notes', '#controllers/notes_controller.store')
router.put('/notes/:id', '#controllers/notes_controller.update')
router.delete('/notes/:id', '#controllers/notes_controller.destroy')
