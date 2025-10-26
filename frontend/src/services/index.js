import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export const projectService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get('/projects/admin/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

export const newsService = {
  getLatest: async (limit = 3) => {
    const response = await api.get(`/news?limit=${limit}`);
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get('/news/admin/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  deleteGalleryImage: async (imageId) => {
    const response = await api.delete(`/news/gallery/${imageId}`);
    return response.data;
  },
};

export const contactService = {
  send: async (name, email, message) => {
    const response = await api.post('/contact', { name, email, message });
    return response.data;
  },

  getAllMessages: async () => {
    const response = await api.get('/contact/messages');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/contact/messages/${id}/read`);
    return response.data;
  },

  replyToMessage: async (id, replyMessage) => {
    const response = await api.post(`/contact/messages/${id}/reply`, { replyMessage });
    return response.data;
  },

  updateNotes: async (id, notes) => {
    const response = await api.patch(`/contact/messages/${id}/notes`, { notes });
    return response.data;
  },

  markAsChecked: async (id) => {
    const response = await api.patch(`/contact/messages/${id}/check`);
    return response.data;
  },

  deleteMessage: async (id) => {
    const response = await api.delete(`/contact/messages/${id}`);
    return response.data;
  },
};

export const usersService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export const teamService = {
  getAll: async () => {
    const response = await api.get('/team');
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get('/team/admin/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/team/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/team', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/team/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  },
};

export const settingsService = {
  get: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  update: async (settingsData) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  },
};
