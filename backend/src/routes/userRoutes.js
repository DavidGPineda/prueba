const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware'); 

// Ruta para que el administrador obtenga todos los usuarios
router.get('/usuarios', authMiddleware, userController.obtenerTodosLosUsuarios);
// Ruta para obtener los cursos inscritos del usuario
router.get('/usuario/cursos-inscritos', authMiddleware, userController.obtenerCursosInscritos);
// Ruta para que el usuario autenticado obtenga su propia información
router.get('/usuario', authMiddleware, userController.obtenerUsuarioActual);
// Obtener usuario por Id
router.get('/usuarios/:id', authMiddleware, userController.obtenerUsuarioPorId);
// Actualizar Usuario (No implementado)
router.put('/usuarios/:id', authMiddleware, userController.actualizarUsuario);
// Ruta para eliminar un usuario
router.delete("/usuarios/:id", authMiddleware, userController.eliminarUsuario);

module.exports = router;