const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas de autenticación
router.post('/login', authController.loginUsuario);
router.post('/register', authController.registroUsuario);

// Ruta protegida solo para administradores
router.get('/admin', authMiddleware, authController.accesoAdmin); // Verifica el token antes de acceder

// Ruta protegida solo para usuarios
router.get('/student', authMiddleware, authController.accesoUser); // Verifica el token antes de acceder

router.post('logout', authMiddleware, authController.logout);

module.exports = router;





