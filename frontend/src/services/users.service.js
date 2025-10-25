import api from './api';

export const usersService = {
  // Obtener todos los usuarios
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Obtener usuario por ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Crear usuario
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Actualizar usuario
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Eliminar usuario
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
