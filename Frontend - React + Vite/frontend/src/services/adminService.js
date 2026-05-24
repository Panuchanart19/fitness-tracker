import api from './api'

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getActivities: (params) => api.get('/admin/activities', { params }),
  deleteActivity: (id) => api.delete(`/admin/activities/${id}`),
}