const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// Obtener últimas noticias (públicas)
const getLatestNews = async (req, res) => {
  try {
    const limit = req.query.limit || 3;
    const result = await db.query(
      `SELECT * FROM news 
       WHERE active = true 
       ORDER BY published_date DESC 
       LIMIT $1`,
      [limit]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
};

// Obtener todas las noticias (admin)
const getAllNewsAdmin = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM news ORDER BY published_date DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
};

// Obtener noticia por ID con galería de imágenes
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener la noticia
    const newsResult = await db.query('SELECT * FROM news WHERE id = $1', [id]);
    
    if (newsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }
    
    const news = newsResult.rows[0];
    
    // Obtener las imágenes de la galería
    const imagesResult = await db.query(
      'SELECT * FROM news_images WHERE news_id = $1 ORDER BY order_index ASC',
      [id]
    );
    
    // Agregar las imágenes a la noticia
    news.gallery = imagesResult.rows;
    
    res.json(news);
  } catch (error) {
    console.error('Error al obtener noticia:', error);
    res.status(500).json({ error: 'Error al obtener noticia' });
  }
};

// Crear noticia
const createNews = async (req, res) => {
  try {
    const { title, content, summary, published_date, active } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Título y contenido son requeridos' });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await db.query(
      `INSERT INTO news (title, content, summary, image_url, published_date, active) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        title, 
        content, 
        summary || null, 
        image_url, 
        published_date || new Date(), 
        active !== undefined ? active : true
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear noticia:', error);
    res.status(500).json({ error: 'Error al crear noticia' });
  }
};

// Actualizar noticia
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, summary, published_date, active } = req.body;

    // Verificar si la noticia existe
    const existingNews = await db.query('SELECT * FROM news WHERE id = $1', [id]);
    if (existingNews.rows.length === 0) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    let image_url = existingNews.rows[0].image_url;

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
      `UPDATE news 
       SET title = $1, content = $2, summary = $3, image_url = $4, 
           published_date = $5, active = $6, updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [title, content, summary, image_url, published_date, active, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    res.status(500).json({ error: 'Error al actualizar noticia' });
  }
};

// Eliminar noticia
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener noticia para eliminar la imagen
    const news = await db.query('SELECT image_url FROM news WHERE id = $1', [id]);
    if (news.rows.length === 0) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    // Eliminar imagen si existe
    if (news.rows[0].image_url) {
      const imagePath = path.join(__dirname, '../../', news.rows[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Eliminar noticia
    await db.query('DELETE FROM news WHERE id = $1', [id]);
    
    res.json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
};

module.exports = {
  getLatestNews,
  getAllNewsAdmin,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};
