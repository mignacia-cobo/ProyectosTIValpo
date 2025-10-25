const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// GET /api/auth/verify - Verificar token (requiere autenticación)
router.get('/verify', authenticateToken, authController.verifyToken);

// POST /api/auth/change-password - Cambiar contraseña (requiere autenticación)
router.post('/change-password', authenticateToken, authController.changePassword);

module.exports = router;
