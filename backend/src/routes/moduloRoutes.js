const express = require('express');
const router = express.Router();
const modulosController = require('../controllers/modulosController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Para crear un nuevo módulo asociado a un curso.
router.post('/modulos/:cursoId', authMiddleware, modulosController.agregarModulo);

module.exports = router;



