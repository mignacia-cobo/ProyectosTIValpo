const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================

// Obtener todos los posts aprobados
router.get('/posts', forumController.getApprovedPosts);

// Obtener un post específico con sus comentarios
router.get('/posts/:id', forumController.getPostById);

// Crear un nuevo post (público, pero requiere moderación)
router.post('/posts', forumController.createPost);

// Crear un comentario en un post (público, pero requiere moderación)
router.post('/comments', forumController.createComment);

// ============================================
// RUTAS ADMIN (requieren autenticación)
// ============================================

// Obtener todos los posts (incluyendo pendientes y rechazados)
router.get('/admin/posts', authenticateToken, requireAdmin, forumController.getAllPosts);

// Aprobar o rechazar un post
router.patch('/admin/posts/:id/moderate', authenticateToken, requireAdmin, forumController.moderatePost);

// Eliminar un post
router.delete('/admin/posts/:id', authenticateToken, requireAdmin, forumController.deletePost);

// Obtener todos los comentarios
router.get('/admin/comments', authenticateToken, requireAdmin, forumController.getAllComments);

// Aprobar o rechazar un comentario
router.patch('/admin/comments/:id/moderate', authenticateToken, requireAdmin, forumController.moderateComment);

// Responder como admin
router.post('/admin/reply', authenticateToken, requireAdmin, forumController.createAdminReply);

// Eliminar un comentario
router.delete('/admin/comments/:id', authenticateToken, requireAdmin, forumController.deleteComment);

module.exports = router;
