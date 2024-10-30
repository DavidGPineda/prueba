const express = require('express');
const router = express.Router();
const evaluacionesController = require('../controllers/evaluacionesController');

// Crear Evaluacion
router.post('/evaluaciones', evaluacionesController.crearEvaluacion);
// Enviar Preguntas 
router.post('/preguntas', evaluacionesController.enviarPreguntas);
// Enviar Opciones
router.post('/opciones', evaluacionesController.enviarOpciones);
// Crear Opcion
router.post('/opciones', evaluacionesController.crearOpcion);
// Obtener las Evaluaciones
router.get('/evaluaciones', evaluacionesController.getEvaluaciones);


module.exports = router;


