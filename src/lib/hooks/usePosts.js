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

export const useUserPosts = (userId, { page = 1, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ['posts', 'user', userId, page, limit],
    queryFn: () => postsApi.getPostsByUserId(userId, { page, limit }),
    enabled: !!userId,
  });
};

export const useSearchPosts = (query, { page = 1, sortBy = 'relevance', limit = 10 } = {}) => {
  // Trim the query to match backend behavior
  const trimmedQuery = query?.trim() || '';
  
  return useQuery({
    queryKey: ['posts', 'search', trimmedQuery, page, sortBy, limit],
    queryFn: () => postsApi.searchPosts(trimmedQuery, { page, sortBy, limit }),
    enabled: trimmedQuery.length >= 2,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
    retry: false,
    refetchOnWindowFocus: true,
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
      // Invalidate all post lists
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // Remove the specific post from cache
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
    // Optimistic update for better UX
    onMutate: async ({ postId, voteType }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', postId] });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData(['posts', postId]);

      // Optimistically update to the new value
      if (previousPost?.data) {
        queryClient.setQueryData(['posts', postId], (old) => ({
          ...old,
          data: {
            ...old.data,
            upvotes: voteType === 'upvote' ? old.data.upvotes + 1 : old.data.upvotes,
            downvotes: voteType === 'downvote' ? old.data.downvotes + 1 : old.data.downvotes,
          },
        }));
      }

      return { previousPost };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['posts', variables.postId], context.previousPost);
      }
    },
    // Always refetch after error or success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};