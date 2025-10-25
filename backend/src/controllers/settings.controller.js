const db = require('../config/database');

// Obtener configuración del sitio
const getSettings = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM site_settings LIMIT 1');
    
    if (result.rows.length === 0) {
      // Si no existe configuración, crear una por defecto
      const defaultSettings = await db.query(
        `INSERT INTO site_settings (site_name, site_description, email, phone, address)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          'Proyectos TI Valpo',
          'Desarrollamos y mantenemos soluciones tecnológicas innovadoras para optimizar procesos y mejorar la experiencia digital.',
          'info@proyectostivalpo.com',
          '+56 9 1234 5678',
          'Valparaíso, Chile'
        ]
      );
      return res.json(defaultSettings.rows[0]);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
};

// Actualizar configuración del sitio
const updateSettings = async (req, res) => {
  try {
    const {
      site_name,
      site_description,
      email,
      phone,
      address,
      github_url,
      linkedin_url,
      facebook_url,
      twitter_url,
      instagram_url
    } = req.body;

    // Verificar si existe configuración
    const existing = await db.query('SELECT id FROM site_settings LIMIT 1');
    
    let result;
    if (existing.rows.length === 0) {
      // Crear nueva configuración
      result = await db.query(
        `INSERT INTO site_settings 
         (site_name, site_description, email, phone, address, github_url, linkedin_url, facebook_url, twitter_url, instagram_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [site_name, site_description, email, phone, address, github_url, linkedin_url, facebook_url, twitter_url, instagram_url]
      );
    } else {
      // Actualizar configuración existente
      result = await db.query(
        `UPDATE site_settings 
         SET site_name = $1, site_description = $2, email = $3, phone = $4, 
             address = $5, github_url = $6, linkedin_url = $7, facebook_url = $8,
             twitter_url = $9, instagram_url = $10, updated_at = NOW()
         WHERE id = $11 RETURNING *`,
        [site_name, site_description, email, phone, address, github_url, linkedin_url, facebook_url, twitter_url, instagram_url, existing.rows[0].id]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
