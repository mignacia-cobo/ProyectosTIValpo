const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Rutas públicas
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

// Rutas protegidas (requieren autenticación)
router.get('/admin/all', authenticateToken, projectController.getAllProjectsAdmin);
router.post('/', authenticateToken, upload.single('image'), projectController.createProject);
router.put('/:id', authenticateToken, upload.single('image'), projectController.updateProject);
router.delete('/:id', authenticateToken, projectController.deleteProject);

module.exports = router;
