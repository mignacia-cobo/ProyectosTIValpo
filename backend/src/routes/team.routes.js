const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Rutas públicas
router.get('/', teamController.getAll);
router.get('/:id', teamController.getById);

// Rutas protegidas (admin)
router.get('/admin/all', authenticateToken, teamController.getAllAdmin);
router.post('/', authenticateToken, upload.single('image'), teamController.create);
router.put('/:id', authenticateToken, upload.single('image'), teamController.update);
router.delete('/:id', authenticateToken, teamController.deleteTeamMember);

module.exports = router;
