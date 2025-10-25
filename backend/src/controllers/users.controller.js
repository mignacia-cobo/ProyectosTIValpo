const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios (admin)
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Crear usuario
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    // Verificar si el email ya existe
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role, created_at, updated_at`,
      [name, email, hashedPassword, role || 'user']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    // Verificar si el usuario existe
    const existingUser = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el nuevo email ya existe (en otro usuario)
    if (email && email !== existingUser.rows[0].email) {
      const emailCheck = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }

    let query;
    let values;

    // Si se proporciona nueva contraseña, hashearla
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `UPDATE users 
               SET name = $1, email = $2, password = $3, role = $4, updated_at = NOW()
               WHERE id = $5 
               RETURNING id, name, email, role, created_at, updated_at`;
      values = [name, email, hashedPassword, role, id];
    } else {
      // No actualizar contraseña
      query = `UPDATE users 
               SET name = $1, email = $2, role = $3, updated_at = NOW()
               WHERE id = $4 
               RETURNING id, name, email, role, created_at, updated_at`;
      values = [name, email, role, id];
    }

    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir eliminar el propio usuario
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
    }

    // Verificar si el usuario existe
    const existingUser = await db.query('SELECT id FROM users WHERE id = $1', [id]);
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
