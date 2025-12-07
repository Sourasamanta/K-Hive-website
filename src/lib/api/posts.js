// src/lib/api/posts.js
import apiClient from './client';

export const postsApi = {
  // Get all posts
  getAllPosts: async (params = {}) => {
    const { data } = await apiClient.get('/post', { params });
    return data;
  },

  // Get single post
  getPostById: async (postId) => {
    const { data } = await apiClient.get(`/post/${postId}`);
    return data;
  },

  // Get user's posts
  getPostsByUserId: async (userId) => {
    const { data } = await apiClient.get(`/post/user/${userId}`);
    return data;
  },

  // Search posts
  searchPosts: async (query, params = {}) => {
    const { data } = await apiClient.get('/post/search', {
      params: { q: query, ...params },
    });
    return data;
  },

  // Create post
  createPost: async (postData) => {
    const { data } = await apiClient.post('/post', postData);
    return data;
  },

  // Update post
  updatePost: async ({ postId, postData }) => {
    const { data } = await apiClient.put(`/post/${postId}`, postData);
    return data;
  },

  // Delete post
  deletePost: async (postId) => {
    const { data } = await apiClient.delete(`/post/${postId}`);
    return data;
  },

  // Upvote post
  upvotePost: async (postId) => {
    const { data } = await apiClient.post(`/post/${postId}/upvote`);
    return data;
  },

  // Downvote post
  downvotePost: async (postId) => {
    const { data } = await apiClient.post(`/post/${postId}/downvote`);
    return data;
  },
};