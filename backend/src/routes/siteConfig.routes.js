const express = require('express');
const router = express.Router();
const siteConfigController = require('../controllers/siteConfig.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/all', siteConfigController.getAllConfig);
router.get('/:section', siteConfigController.getConfig);

// Rutas protegidas (solo admin)
router.patch('/:section', authenticateToken, siteConfigController.updateConfig);

module.exports = router;
