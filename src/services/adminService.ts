import { api } from './api';
import { categoryIcons } from './categoryService';

const assignIconsToCategories = (categories: any[]) => {
  return categories.map((category) => ({
    ...category,
    icon: categoryIcons[category.name] || 'cube'
  }));
};

export const adminService = {
  async getDashboardStats() {
    const response = await api.get('/admin/stats/dashboard');
    return response.data;
  },

  // Productos
  async getProducts(params: any = {}) {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  async deleteProduct(productId: number) {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  },

  async warnProduct(productId: number, reason: string, days: number = 3) {
    const response = await api.patch(`/admin/products/${productId}/warn`, { reason, days });
    return response.data;
  },

  async activateProduct(productId: number) {
    const response = await api.patch(`/admin/products/${productId}/activate`, {});
    return response.data;
  },

  // Usuarios
  async getUsers(params: any = {}) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  async toggleUserStatus(userId: number, isActive: boolean, reason?: string) {
    const response = await api.patch(`/admin/users/${userId}/status`, { isActive, reason });
    return response.data;
  },

  // Categorías
  async getCategories(params: any = {}) {
    const response = await api.get('/admin/categories', { params });
    return assignIconsToCategories(response.data);
  },

  async getCategoryStats() {
    const response = await api.get('/admin/categories/stats');
    return response.data;
  },

  async createCategory(categoryData: any) {
    const response = await api.post('/admin/categories', categoryData);
    const categoryWithIcon = {
      ...response.data.category,
      icon: categoryIcons[categoryData.name] || 'cube'
    };
    return { ...response.data, category: categoryWithIcon };
  },

  async updateCategory(categoryId: number, categoryData: any) {
    const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
    const categoryWithIcon = {
      ...response.data.category,
      icon: categoryIcons[categoryData.name] || 'cube'
    };
    return { ...response.data, category: categoryWithIcon };
  },

  async deleteCategory(categoryId: number) {
    const response = await api.delete(`/admin/categories/${categoryId}`);
    return response.data;
  },

  // Pedidos
  async getOrders(params: any = {}) {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  async updateOrderStatus(orderId: number, status: string) {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Comentarios
  async getComments(filters: any = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    const response = await api.get(`/admin/comments?${params.toString()}`);
    return response.data;
  },

  async deleteComment(commentId: number) {
    const response = await api.delete(`/admin/comments/${commentId}`);
    return response.data;
  },

  async toggleCommentApproval(commentId: number, isApproved: boolean) {
    const response = await api.patch(`/admin/comments/${commentId}/approval`, { is_approved: isApproved });
    return response.data;
  },

  async getCommentStats() {
    const response = await api.get('/admin/stats/comments');
    return response.data;
  },

  async getCommentReports(commentId: number) {
    const response = await api.get(`/admin/comments/reports?commentId=${commentId}`);
    return response.data;
  },

  async clearCommentReports(commentId: number) {
    const response = await api.delete(`/admin/comments/${commentId}/reports`);
    return response.data;
  },

  // Bitácora
  async getActivityLogs(params: any = {}) {
    const response = await api.get('/admin/activity-logs', { params });
    return response.data;
  }
};
