const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// Obtener todos los proyectos (públicos)
const getAllProjects = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM projects WHERE active = true ORDER BY order_index ASC, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};

// Obtener todos los proyectos (admin)
const getAllProjectsAdmin = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM projects ORDER BY order_index ASC, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};

// Obtener proyecto por ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    res.status(500).json({ error: 'Error al obtener proyecto' });
  }
};

// Crear proyecto
const createProject = async (req, res) => {
  try {
    const { name, title, description, url, order_index, active } = req.body;
    
    if (!name || !title || !description || !url) {
      return res.status(400).json({ error: 'Nombre, título, descripción y URL son requeridos' });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await db.query(
      `INSERT INTO projects (name, title, description, url, image_url, order_index, active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, title, description, url, image_url, order_index || 0, active !== undefined ? active : true]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
};

// Actualizar proyecto
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, description, url, order_index, active } = req.body;

    // Verificar si el proyecto existe
    const existingProject = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (existingProject.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    let image_url = existingProject.rows[0].image_url;

    // Si hay nueva imagen, eliminar la anterior
    if (req.file) {
      if (image_url) {
        const oldImagePath = path.join(__dirname, '../../', image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await db.query(
      `UPDATE projects 
       SET name = $1, title = $2, description = $3, url = $4, image_url = $5, 
           order_index = $6, active = $7, updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [name, title, description, url, image_url, order_index, active, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
};

// Eliminar proyecto
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener proyecto para eliminar la imagen
    const project = await db.query('SELECT image_url FROM projects WHERE id = $1', [id]);
    if (project.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // Eliminar imagen si existe
    if (project.rows[0].image_url) {
      const imagePath = path.join(__dirname, '../../', project.rows[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Eliminar proyecto
    await db.query('DELETE FROM projects WHERE id = $1', [id]);
    
    res.json({ message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
};

module.exports = {
  getAllProjects,
  getAllProjectsAdmin,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
