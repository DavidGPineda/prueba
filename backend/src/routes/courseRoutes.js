const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Obtener lista de cursos
router.get('/cursos', courseController.getCourses);  

// Crear un curso
router.post('/cursos', authMiddleware, courseController.crearCurso);   

//  Obtener los detalles de un curso basado en su ID.
router.get('/cursos/:id', courseController.getCourseById);

//  Inscipcion de usuarios a cursos
router.post('/cursos/:id_curso/inscribir', authMiddleware, courseController.inscribirUsuario);

//  Obtener los detalles de un curso basado en su ID.
router.get('/cursos/:id_curso/verificar-inscripcion', authMiddleware, courseController.verificarInscripcion);

//  Obtener los detalles de un curso basado en su ID.
router.get('/cursos/:id', authMiddleware, courseController.obtenerCurso);

//  Obtener lecciones por modulo.
router.get('/lecciones/:idModulo', courseController.obtenerLeccionesPorModulo);

module.exports = router;



   