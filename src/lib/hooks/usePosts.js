// src/lib/hooks/usePosts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/posts';

// Query hooks
export const usePosts = ({ page = 1, sort = 'new', limit = 10 } = {}) => {
  return useQuery({
    queryKey: ['posts', page, sort, limit],
    queryFn: () => postsApi.getAllPosts({ page, sort, limit }),
  });
};

export const usePost = (postId) => {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: () => postsApi.getPostById(postId),
    enabled: !!postId,
  });
};

export const useUserPosts = (userId) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => postsApi.getPostsByUserId(userId),
    enabled: !!userId,
  });
};

export const useSearchPosts = (query, { page = 1 } = {}) => {
  return useQuery({
    queryKey: ['posts', 'search', query, page],
    queryFn: () => postsApi.searchPosts(query, { page }),
    enabled: !!query,
  });
};

// Mutation hooks
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.updatePost,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', variables.postId] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.removeQueries({ queryKey: ['posts', postId] });
    },
  });
};

export const useVotePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, voteType }) => {
      if (voteType === 'upvote') {
        return postsApi.upvotePost(postId);
      } else {
        return postsApi.downvotePost(postId);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', variables.postId] });
    },
  });
};