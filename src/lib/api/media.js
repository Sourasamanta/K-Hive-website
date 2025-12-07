// src/lib/api/media.js
import apiClient from './client';

export const mediaApi = {
  getUploadLink: async () => {
    const { data } = await apiClient.get('/media/uploadlink');
    return data;
  },
};
