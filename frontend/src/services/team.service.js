import api from './api';

const teamService = {
  // Obtener todos los miembros del equipo (público)
  getAll: async () => {
    const response = await api.get('/team');
    return response.data;
  },

  // Obtener todos los miembros del equipo (admin)
  getAllAdmin: async () => {
    const response = await api.get('/team/admin/all');
    return response.data;
  },

  // Obtener un miembro del equipo por ID
  getById: async (id) => {
    const response = await api.get(`/team/${id}`);
    return response.data;
  },

  // Crear miembro del equipo
  create: async (teamMemberData) => {
    const response = await api.post('/team', teamMemberData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Actualizar miembro del equipo
  update: async (id, teamMemberData) => {
    const response = await api.put(`/team/${id}`, teamMemberData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Eliminar miembro del equipo
  delete: async (id) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  }
};

export default teamService;
