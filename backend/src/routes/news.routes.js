const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Rutas públicas
router.get('/', newsController.getLatestNews);
router.get('/:id', newsController.getNewsById);

// Rutas protegidas (requieren autenticación)
router.get('/admin/all', authenticateToken, newsController.getAllNewsAdmin);
router.post('/', authenticateToken, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), newsController.createNews);
router.put('/:id', authenticateToken, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), newsController.updateNews);
router.delete('/:id', authenticateToken, newsController.deleteNews);

module.exports = router;
