const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Ruta Para Crear Foro
router.post('/foros', authMiddleware, forumController.crearForo);
 
// Ruta para obtener todos los foros
router.get('/foros', forumController.obtenerForos);

// Ruta para Agregar Publicacion
router.post('/foros/:id_foro/publicaciones', authMiddleware, forumController.agregarPublicacion);

// Ruta para obtener Publicaciones
router.get('/foros/:id/publicaciones', forumController.obtenerPublicaciones);

// Ruta para obtener un foro por ID
router.get('/foros/:id', forumController.obtenerForoPorId); 

module.exports = router;



