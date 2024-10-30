const express = require('express');
const router = express.Router();
const leccionesController = require('../controllers/leccionesController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Agregar una Leccion
router.post('/lecciones/:idModulo', authMiddleware, leccionesController.agregarLeccion);

// Marcar como Completada ( No implementada )
router.post('/:id/leccion/completar', authMiddleware, leccionesController.marcarLeccionComoCompletada);
// Ruta para marcar una lección como completada
router.post('/lecciones/:id/completar', leccionesController.marcarLeccionComoCompletada);

module.exports = router;



