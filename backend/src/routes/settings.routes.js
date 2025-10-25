const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Ruta pública para obtener configuración
router.get('/', settingsController.getSettings);

// Ruta protegida para actualizar configuración
router.put('/', authenticateToken, settingsController.updateSettings);

module.exports = router;
