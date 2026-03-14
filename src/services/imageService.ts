import { api } from './api';

export const imageService = {
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data;
  },

  async uploadSingleImage(file: File) {
    return this.uploadImage(file);
  },

  async uploadMultipleImages(files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  }
};
