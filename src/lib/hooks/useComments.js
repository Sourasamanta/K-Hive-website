// src/lib/hooks/useComments.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/lib/api/comments';

// Query hooks
export const useComments = (postId, { page = 1, limit = 20 } = {}) => {
  return useQuery({
    queryKey: ['comments', postId, page, limit],
    queryFn: () => commentsApi.getCommentsByPostId(postId, { page, limit }),
    enabled: !!postId,
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};

export const useReplies = (commentId, { page = 1, limit = 10 } = {}) => {
  return useQuery({
    queryKey: ['replies', commentId, page, limit],
    queryFn: () => commentsApi.getRepliesByCommentId(commentId, { page, limit }),
    enabled: !!commentId,
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Mutation hooks with optimized invalidation
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.createComment,
    onSuccess: (newComment, variables) => {
      const { postId, parentCommentId } = variables;

      if (parentCommentId) {
        // For replies: Only refetch the specific reply thread that needs the new reply
        queryClient.invalidateQueries({
          queryKey: ['replies', parentCommentId, 1], // Only first page
          exact: false,
        });
      } else {
        // For top-level comments: Only refetch first page of comments
        queryClient.invalidateQueries({
          queryKey: ['comments', postId, 1],
          exact: false,
        });
      }
      
      // Don't invalidate posts - comment count can be updated separately if needed
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.updateComment,
    // Optimistic update
    onMutate: async ({ commentId, content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments'] });
      await queryClient.cancelQueries({ queryKey: ['replies'] });

      // Snapshot previous values
      const previousComments = queryClient.getQueriesData({ queryKey: ['comments'] });
      const previousReplies = queryClient.getQueriesData({ queryKey: ['replies'] });

      // Optimistically update comment in cache
      queryClient.setQueriesData({ queryKey: ['comments'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((comment) =>
            comment.commentId === commentId
              ? { ...comment, content, isEdited: true }
              : comment
          ),
        };
      });

      queryClient.setQueriesData({ queryKey: ['replies'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((reply) =>
            reply.commentId === commentId
              ? { ...reply, content, isEdited: true }
              : reply
          ),
        };
      });

      return { previousComments, previousReplies };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        context.previousComments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousReplies) {
        context.previousReplies.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Just mark as stale, don't refetch
      queryClient.invalidateQueries({ 
        queryKey: ['comments'],
        refetchType: 'none'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['replies'],
        refetchType: 'none'
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentsApi.deleteComment,
    // Optimistic update
    onMutate: async (commentId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments'] });
      await queryClient.cancelQueries({ queryKey: ['replies'] });

      // Snapshot previous values
      const previousComments = queryClient.getQueriesData({ queryKey: ['comments'] });
      const previousReplies = queryClient.getQueriesData({ queryKey: ['replies'] });

      // Optimistically remove comment from cache
      queryClient.setQueriesData({ queryKey: ['comments'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((comment) => comment.commentId !== commentId),
          pagination: old.pagination ? { ...old.pagination, total: old.pagination.total - 1 } : undefined,
        };
      });

      queryClient.setQueriesData({ queryKey: ['replies'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((reply) => reply.commentId !== commentId),
          pagination: old.pagination ? { ...old.pagination, total: old.pagination.total - 1 } : undefined,
        };
      });

      return { previousComments, previousReplies };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        context.previousComments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousReplies) {
        context.previousReplies.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      // Don't invalidate anything! Optimistic update is enough.
      // The cache already has the correct data from onMutate.
      // Only mark as stale without refetching
      queryClient.invalidateQueries({ 
        queryKey: ['comments'],
        refetchType: 'none' // Just mark stale, don't refetch
      });
      queryClient.invalidateQueries({ 
        queryKey: ['replies'],
        refetchType: 'none'
      });
    },
  });
};

export const useUserComments = (
  userId,
  { page = 1, limit = 20 } = {}
) => {
  return useQuery({
    queryKey: ['comments', 'user', userId, page, limit],
    queryFn: () =>
      commentsApi.getCommentsByUserId(userId, { page, limit }),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useVoteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, voteType }) => {
      if (voteType === 'upvote') {
        return commentsApi.upvoteComment(commentId);
      } else if (voteType === 'downvote') {
        return commentsApi.downvoteComment(commentId);
      }
    },
    // Optimistic update for voting
    onMutate: async ({ commentId, voteType }) => {
      await queryClient.cancelQueries({ queryKey: ['comments'] });
      await queryClient.cancelQueries({ queryKey: ['replies'] });

      const previousComments = queryClient.getQueriesData({ queryKey: ['comments'] });
      const previousReplies = queryClient.getQueriesData({ queryKey: ['replies'] });

      // Optimistically update vote count
      const updateVotes = (comment) => {
        if (comment.commentId !== commentId) return comment;
        
        const upvoteChange = voteType === 'upvote' ? 1 : 0;
        const downvoteChange = voteType === 'downvote' ? 1 : 0;
        
        return {
          ...comment,
          upvotes: (comment.upvotes || 0) + upvoteChange,
          downvotes: (comment.downvotes || 0) + downvoteChange,
        };
      };

      queryClient.setQueriesData({ queryKey: ['comments'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(updateVotes),
        };
      });

      queryClient.setQueriesData({ queryKey: ['replies'] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(updateVotes),
        };
      });

      return { previousComments, previousReplies };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousComments) {
        context.previousComments.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousReplies) {
        context.previousReplies.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (data, variables) => {
      // Optional: refetch only the specific comment's data if backend returns updated counts
      // This ensures accuracy but creates a request
      // You can remove this if optimistic update is sufficient
      queryClient.invalidateQueries({
        queryKey: ['comments'],
        refetchType: 'none', // Don't refetch, just mark as stale
      });
      queryClient.invalidateQueries({
        queryKey: ['replies'],
        refetchType: 'none',
      });
    },
  });
};