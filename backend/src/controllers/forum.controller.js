const pool = require('../config/database');

// ============================================
// POSTS - Endpoints públicos
// ============================================

// Obtener todos los posts aprobados (público)
const getApprovedPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT 
        p.id, p.title, p.content, p.author_name, 
        p.created_at, p.updated_at,
        COUNT(c.id) FILTER (WHERE c.status = 'approved') as comments_count
       FROM forum_posts p
       LEFT JOIN forum_comments c ON p.id = c.post_id
       WHERE p.status = 'approved'
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Contar total de posts aprobados
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM forum_posts WHERE status = $1',
      ['approved']
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener posts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las publicaciones',
      error: error.message 
    });
  }
};

// Obtener un post específico con sus comentarios aprobados (público)
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el post
    const postResult = await pool.query(
      `SELECT id, title, content, author_name, created_at, updated_at
       FROM forum_posts
       WHERE id = $1 AND status = 'approved'`,
      [id]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Publicación no encontrada' 
      });
    }

    // Obtener comentarios aprobados
    const commentsResult = await pool.query(
      `SELECT id, content, author_name, is_admin_reply, created_at
       FROM forum_comments
       WHERE post_id = $1 AND status = 'approved'
       ORDER BY created_at ASC`,
      [id]
    );

    res.json({
      success: true,
      data: {
        post: postResult.rows[0],
        comments: commentsResult.rows
      }
    });
  } catch (error) {
    console.error('Error al obtener post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la publicación',
      error: error.message 
    });
  }
};

// Crear un nuevo post (público - requiere moderación)
const createPost = async (req, res) => {
  try {
    const { title, content, author_name, author_email } = req.body;

    if (!title || !content || !author_name || !author_email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      });
    }

    const result = await pool.query(
      `INSERT INTO forum_posts (title, content, author_name, author_email, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id, title, author_name, created_at, status`,
      [title, content, author_name, author_email]
    );

    res.status(201).json({
      success: true,
      message: 'Publicación enviada. Estará visible una vez sea aprobada por el administrador.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear la publicación',
      error: error.message 
    });
  }
};

// Crear un comentario en un post (público - requiere moderación)
const createComment = async (req, res) => {
  try {
    const { post_id, content, author_name, author_email } = req.body;

    if (!post_id || !content || !author_name || !author_email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      });
    }

    // Verificar que el post existe y está aprobado
    const postCheck = await pool.query(
      'SELECT id FROM forum_posts WHERE id = $1 AND status = $2',
      [post_id, 'approved']
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Publicación no encontrada' 
      });
    }

    const result = await pool.query(
      `INSERT INTO forum_comments (post_id, content, author_name, author_email, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id, post_id, author_name, created_at, status`,
      [post_id, content, author_name, author_email]
    );

    res.status(201).json({
      success: true,
      message: 'Comentario enviado. Estará visible una vez sea aprobado por el administrador.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear el comentario',
      error: error.message 
    });
  }
};

// ============================================
// ADMIN - Moderación de posts
// ============================================

// Obtener todos los posts (admin)
const getAllPosts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.id, p.title, p.content, p.author_name, p.author_email,
        p.status, p.admin_notes, p.created_at, p.updated_at,
        p.approved_at, u.name as approved_by_name,
        COUNT(c.id) as total_comments,
        COUNT(c.id) FILTER (WHERE c.status = 'pending') as pending_comments
      FROM forum_posts p
      LEFT JOIN users u ON p.approved_by = u.id
      LEFT JOIN forum_comments c ON p.id = c.post_id
    `;

    const params = [];
    if (status) {
      query += ' WHERE p.status = $1';
      params.push(status);
    }

    query += ' GROUP BY p.id, u.name ORDER BY p.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) FROM forum_posts';
    const countParams = [];
    if (status) {
      countQuery += ' WHERE status = $1';
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener posts (admin):', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las publicaciones',
      error: error.message 
    });
  }
};

// Aprobar o rechazar un post (admin)
const moderatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    const adminId = req.user.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Estado inválido. Debe ser "approved" o "rejected"' 
      });
    }

    const result = await pool.query(
      `UPDATE forum_posts
       SET status = $1, admin_notes = $2, approved_by = $3, approved_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, title, status, approved_at`,
      [status, admin_notes, adminId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Publicación no encontrada' 
      });
    }

    res.json({
      success: true,
      message: `Publicación ${status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al moderar post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al moderar la publicación',
      error: error.message 
    });
  }
};

// Eliminar un post (admin)
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM forum_posts WHERE id = $1 RETURNING id, title',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Publicación no encontrada' 
      });
    }

    res.json({
      success: true,
      message: 'Publicación eliminada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar la publicación',
      error: error.message 
    });
  }
};

// ============================================
// ADMIN - Moderación de comentarios
// ============================================

// Obtener todos los comentarios (admin)
const getAllComments = async (req, res) => {
  try {
    const { status, post_id, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        c.id, c.post_id, c.content, c.author_name, c.author_email,
        c.is_admin_reply, c.status, c.created_at, c.approved_at,
        p.title as post_title,
        u.name as approved_by_name
      FROM forum_comments c
      LEFT JOIN forum_posts p ON c.post_id = p.id
      LEFT JOIN users u ON c.approved_by = u.id
    `;

    const params = [];
    const conditions = [];

    if (status) {
      conditions.push(`c.status = $${params.length + 1}`);
      params.push(status);
    }

    if (post_id) {
      conditions.push(`c.post_id = $${params.length + 1}`);
      params.push(post_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener comentarios (admin):', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los comentarios',
      error: error.message 
    });
  }
};

// Aprobar o rechazar un comentario (admin)
const moderateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Estado inválido. Debe ser "approved" o "rejected"' 
      });
    }

    const result = await pool.query(
      `UPDATE forum_comments
       SET status = $1, approved_by = $2, approved_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, content, status, approved_at`,
      [status, adminId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Comentario no encontrado' 
      });
    }

    res.json({
      success: true,
      message: `Comentario ${status === 'approved' ? 'aprobado' : 'rechazado'} exitosamente`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al moderar comentario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al moderar el comentario',
      error: error.message 
    });
  }
};

// Responder a un post o comentario como admin
const createAdminReply = async (req, res) => {
  try {
    const { post_id, content } = req.body;
    const adminId = req.user.id;
    const adminName = req.user.name;

    if (!post_id || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'El post_id y contenido son requeridos' 
      });
    }

    // Verificar que el post existe
    const postCheck = await pool.query(
      'SELECT id FROM forum_posts WHERE id = $1',
      [post_id]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Publicación no encontrada' 
      });
    }

    const result = await pool.query(
      `INSERT INTO forum_comments 
       (post_id, content, author_name, author_email, is_admin_reply, admin_id, status, approved_by, approved_at)
       VALUES ($1, $2, $3, 'admin', true, $4, 'approved', $4, CURRENT_TIMESTAMP)
       RETURNING id, post_id, content, created_at`,
      [post_id, content, adminName, adminId]
    );

    res.status(201).json({
      success: true,
      message: 'Respuesta publicada exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear respuesta admin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear la respuesta',
      error: error.message 
    });
  }
};

// Eliminar un comentario (admin)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM forum_comments WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Comentario no encontrado' 
      });
    }

    res.json({
      success: true,
      message: 'Comentario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar el comentario',
      error: error.message 
    });
  }
};

module.exports = {
  // Públicos
  getApprovedPosts,
  getPostById,
  createPost,
  createComment,
  
  // Admin
  getAllPosts,
  moderatePost,
  deletePost,
  getAllComments,
  moderateComment,
  createAdminReply,
  deleteComment
};
