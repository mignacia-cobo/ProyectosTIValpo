import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================
// ENDPOINTS PÚBLICOS
// ============================================

// Obtener todos los posts aprobados
export const getApprovedPosts = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}/forum/posts`, {
    params: { page, limit }
  });
  return response.data;
};

// Obtener un post específico con sus comentarios
export const getPostById = async (id) => {
  const response = await axios.get(`${API_URL}/forum/posts/${id}`);
  return response.data;
};

// Crear una nueva publicación
export const createPost = async (postData) => {
  const response = await axios.post(`${API_URL}/forum/posts`, postData);
  return response.data;
};

// Crear un comentario
export const createComment = async (commentData) => {
  const response = await axios.post(`${API_URL}/forum/comments`, commentData);
  return response.data;
};

// ============================================
// ENDPOINTS ADMIN
// ============================================

// Obtener todos los posts (incluyendo pendientes)
export const getAllPosts = async (status = null, page = 1, limit = 20) => {
  const token = localStorage.getItem('token');
  const params = { page, limit };
  if (status) params.status = status;
  
  const response = await axios.get(`${API_URL}/forum/admin/posts`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Moderar un post (aprobar o rechazar)
export const moderatePost = async (id, status, admin_notes = '') => {
  const token = localStorage.getItem('token');
  const response = await axios.patch(
    `${API_URL}/forum/admin/posts/${id}/moderate`,
    { status, admin_notes },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Eliminar un post
export const deletePost = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/forum/admin/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Obtener todos los comentarios
export const getAllComments = async (status = null, post_id = null) => {
  const token = localStorage.getItem('token');
  const params = {};
  if (status) params.status = status;
  if (post_id) params.post_id = post_id;
  
  const response = await axios.get(`${API_URL}/forum/admin/comments`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Moderar un comentario
export const moderateComment = async (id, status) => {
  const token = localStorage.getItem('token');
  const response = await axios.patch(
    `${API_URL}/forum/admin/comments/${id}/moderate`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Responder como administrador
export const createAdminReply = async (post_id, content) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/forum/admin/reply`,
    { post_id, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Eliminar un comentario
export const deleteComment = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/forum/admin/comments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
