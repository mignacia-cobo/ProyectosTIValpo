const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const rateLimit = require('express-rate-limit');

// Limitar intentos de envío de formulario
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 mensajes por IP
  message: { error: 'Demasiados mensajes enviados. Por favor, intenta más tarde.' }
});

// Ruta pública
router.post('/', contactLimiter, contactController.sendContactMessage);

// Rutas protegidas (requieren autenticación)
router.get('/messages', authenticateToken, contactController.getAllMessages);
router.patch('/messages/:id/read', authenticateToken, contactController.markAsRead);
router.post('/messages/:id/reply', authenticateToken, contactController.replyToMessage);
router.patch('/messages/:id/notes', authenticateToken, contactController.updateNotes);
router.patch('/messages/:id/check', authenticateToken, contactController.markAsChecked);
router.delete('/messages/:id', authenticateToken, contactController.deleteMessage);

module.exports = router;
