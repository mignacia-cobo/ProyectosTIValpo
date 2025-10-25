const db = require('../config/database');
const path = require('path');
const fs = require('fs');

// Obtener todos los miembros del equipo (público)
const getAll = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM team_members WHERE active = true ORDER BY order_index ASC, id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener miembros del equipo:', error);
    res.status(500).json({ error: 'Error al obtener miembros del equipo' });
  }
};

// Obtener todos los miembros del equipo (admin)
const getAllAdmin = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM team_members ORDER BY order_index ASC, id ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener miembros del equipo:', error);
    res.status(500).json({ error: 'Error al obtener miembros del equipo' });
  }
};

// Obtener un miembro del equipo por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM team_members WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Miembro del equipo no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener miembro del equipo:', error);
    res.status(500).json({ error: 'Error al obtener miembro del equipo' });
  }
};

// Crear miembro del equipo
const create = async (req, res) => {
  try {
    const { name, role, bio, email, linkedin_url, github_url, order_index, active } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ error: 'Nombre y rol son requeridos' });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await db.query(
      `INSERT INTO team_members (name, role, bio, image_url, email, linkedin_url, github_url, order_index, active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, role, bio, image_url, email, linkedin_url, github_url, order_index || 0, active !== undefined ? active : true]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear miembro del equipo:', error);
    res.status(500).json({ error: 'Error al crear miembro del equipo' });
  }
};

// Actualizar miembro del equipo
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio, email, linkedin_url, github_url, order_index, active } = req.body;

    // Verificar si el miembro existe
    const existingMember = await db.query('SELECT * FROM team_members WHERE id = $1', [id]);
    if (existingMember.rows.length === 0) {
      return res.status(404).json({ error: 'Miembro del equipo no encontrado' });
    }

    let image_url = existingMember.rows[0].image_url;

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
      `UPDATE team_members 
       SET name = $1, role = $2, bio = $3, image_url = $4, email = $5, 
           linkedin_url = $6, github_url = $7, order_index = $8, active = $9, updated_at = NOW()
       WHERE id = $10 RETURNING *`,
      [name, role, bio, image_url, email, linkedin_url, github_url, order_index, active, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar miembro del equipo:', error);
    res.status(500).json({ error: 'Error al actualizar miembro del equipo' });
  }
};

// Eliminar miembro del equipo
const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el miembro existe
    const existingMember = await db.query('SELECT * FROM team_members WHERE id = $1', [id]);
    if (existingMember.rows.length === 0) {
      return res.status(404).json({ error: 'Miembro del equipo no encontrado' });
    }

    // Eliminar imagen si existe
    if (existingMember.rows[0].image_url) {
      const imagePath = path.join(__dirname, '../../', existingMember.rows[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.query('DELETE FROM team_members WHERE id = $1', [id]);
    res.json({ message: 'Miembro del equipo eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar miembro del equipo:', error);
    res.status(500).json({ error: 'Error al eliminar miembro del equipo' });
  }
};

module.exports = {
  getAll,
  getAllAdmin,
  getById,
  create,
  update,
  deleteTeamMember
};
