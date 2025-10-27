const pool = require('../config/database');

// Obtener configuración por sección
const getConfig = async (req, res) => {
  try {
    const { section } = req.params;

    const result = await pool.query(
      'SELECT section, config, updated_at FROM site_config WHERE section = $1',
      [section]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Configuración no encontrada' 
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la configuración',
      error: error.message 
    });
  }
};

// Obtener toda la configuración
const getAllConfig = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT section, config, updated_at FROM site_config ORDER BY section'
    );

    const configBySection = result.rows.reduce((acc, row) => {
      acc[row.section] = row.config;
      return acc;
    }, {});

    res.json({
      success: true,
      data: configBySection
    });
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las configuraciones',
      error: error.message 
    });
  }
};

// Actualizar configuración
const updateConfig = async (req, res) => {
  try {
    const { section } = req.params;
    const { config } = req.body;
    const userId = req.user?.id;

    if (!config) {
      return res.status(400).json({ 
        success: false, 
        message: 'El campo config es requerido' 
      });
    }

    // Verificar que la sección existe
    const checkResult = await pool.query(
      'SELECT id FROM site_config WHERE section = $1',
      [section]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sección no encontrada' 
      });
    }

    // Actualizar configuración
    const result = await pool.query(
      `UPDATE site_config 
       SET config = $1, updated_by = $2, updated_at = CURRENT_TIMESTAMP
       WHERE section = $3
       RETURNING section, config, updated_at`,
      [JSON.stringify(config), userId, section]
    );

    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar la configuración',
      error: error.message 
    });
  }
};

module.exports = {
  getConfig,
  getAllConfig,
  updateConfig
};
