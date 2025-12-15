"use client";
import React, { useState } from "react";
import {
  Pin,
  Clock,
  User,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share2,
  Check,
  RefreshCw,
  Megaphone,
  Sparkles,
  Bell
} from "lucide-react";
import { usePinnedPosts } from "@/lib/hooks/usePosts";
import { useVotePost } from "@/lib/hooks/usePosts";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AnnouncementsPage() {
  const [page, setPage] = useState(1);
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const { data: authData } = useAuth();
  const user = authData?.user || null;

  const { data: pinnedData, isLoading, error, refetch } = usePinnedPosts({
    page,
    limit: 10,
  });

  const { mutate: votePost } = useVotePost();

  const handleVote = (postId, voteType) => {
    votePost(
      { postId, voteType },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          console.error("Failed to vote:", error);
        },
      }
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleShare = async (postId) => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this announcement',
          url: postUrl
        });
      } else {
        await navigator.clipboard.writeText(postUrl);
        setCopiedPostId(postId);
        setTimeout(() => setCopiedPostId(null), 2000);
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(postUrl);
        setCopiedPostId(postId);
        setTimeout(() => setCopiedPostId(null), 2000);
      } catch (err) {
        console.error('Failed to share:', err);
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatVoteCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-[#020d17]">
      <div className="w-full max-w-[1200px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="sticky top-0 z-10 bg-[#020d17] pt-6 pb-4">
          <div className="flex items-center justify-between border-b border-[#343536] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[#1dddf2] to-[#7193ff] rounded-xl">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  Announcements
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Important updates and pinned posts
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-[#3a3a3c] transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        {!isLoading && !error && pinnedData?.pagination && (
          <div className="flex items-center gap-4 py-4 text-gray-400 text-sm border-b border-[#343536]">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-[#1dddf2]" />
              <span>{pinnedData.pagination.total} Pinned Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#7193ff]" />
              <span>Stay Updated</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1dddf2] mb-4"></div>
            <p className="text-gray-400">Loading announcements...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
              <Bell className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 text-lg">
              Failed to load announcements. Please try again.
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Posts List */}
        {!isLoading && !error && pinnedData?.data && (
          <div className="space-y-4 pb-12 sm:pb-16 md:pb-20 pt-6">
            {pinnedData.data.map((post, index) => (
              <div
                key={post.postId}
                className="bg-[#0d1d2c] border border-[#343536] rounded-lg hover:border-[#1dddf2] transition-all duration-300 overflow-hidden relative group"
              >
                {/* Pinned Badge */}
                <div className="absolute top-0 right-0 bg-gradient-to-br from-[#1dddf2] to-[#7193ff] text-white px-3 py-1 rounded-bl-lg text-xs font-semibold flex items-center gap-1 shadow-lg">
                  <Pin className="w-3 h-3" />
                  Pinned
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                  <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#1dddf2]/20 to-transparent" />
                </div>

                <div className="flex p-4">
                  <div className="flex-1 min-w-0">
                    {/* Post Number & User Info */}
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                      <span className="px-2 py-1 bg-[#1dddf2]/10 text-[#1dddf2] rounded font-semibold">
                        #{index + 1}
                      </span>
                      <span 
                        onClick={() => router.push(`/profile/${post.userId}`)}
                        className="hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <User className="w-3 h-3" />
                        u/{post.user?.name || "Unknown User"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 
                          onClick={() => router.push(`/post/${post.postId}`)}
                          className="text-white text-lg md:text-xl lg:text-2xl font-bold tracking-tight mb-2 cursor-pointer hover:text-[#1dddf2] transition-colors duration-300 line-clamp-2 break-words"
                        >
                          {post.title}
                        </h2>

                        <p className="text-gray-400 text-sm md:text-base mb-3 break-words line-clamp-3">
                          {post.content && post.content.length > 200
                            ? `${post.content.substring(0, 200)}...`
                            : post.content}
                        </p>
                      </div>

                      {/* Media */}
                      {post.media && post.media.length > 0 && (
                        <div 
                          className="w-full h-48 md:w-[40%] md:h-32 lg:h-36 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => router.push(`/post/${post.postId}`)}
                        >
                          <img
                            src={post.media[0]}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 mb-3">
                        {post.tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-[#1dddf2]/10 to-[#7193ff]/10 text-[#1dddf2] rounded-full text-xs font-medium border border-[#1dddf2]/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-4 flex-wrap">
                      <button
                        onClick={() => handleVote(post.postId, "upvote")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-300 active:scale-95 ${
                          post.vote === 1
                            ? "bg-[#1dddf2] text-white shadow-lg shadow-[#1dddf2]/30"
                            : "text-gray-400 hover:text-[#1dddf2] hover:bg-[#272729]"
                        }`}
                      >
                        <ArrowUp className="w-4 h-4" fill={post.vote === 1 ? "currentColor" : "none"} />
                        <span className="text-sm font-semibold">
                          {formatVoteCount(post.upvotes)}
                        </span>
                      </button>

                      <button
                        onClick={() => handleVote(post.postId, "downvote")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-300 active:scale-95 ${
                          post.vote === -1
                            ? "bg-[#7193ff] text-white shadow-lg shadow-[#7193ff]/30"
                            : "text-gray-400 hover:text-[#7193ff] hover:bg-[#272729]"
                        }`}
                      >
                        <ArrowDown className="w-4 h-4" fill={post.vote === -1 ? "currentColor" : "none"} />
                        <span className="text-sm font-semibold">
                          {formatVoteCount(post.downvotes)}
                        </span>
                      </button>

                      <button
                        onClick={() => router.push(`/post/${post.postId}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:bg-[#272729] hover:text-white rounded-md transition-all duration-300 active:scale-95"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          {post.commentCount || post.commentIds?.length || 0}
                        </span>
                      </button>

                      <button 
                        onClick={() => handleShare(post.postId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:bg-[#272729] hover:text-white rounded-md transition-all duration-300 active:scale-95"
                      >
                        {copiedPostId === post.postId ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-semibold text-green-400">
                              Copied!
                            </span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm font-semibold hidden sm:inline">
                              Share
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && pinnedData?.data?.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1dddf2]/10 rounded-full mb-4">
              <Pin className="w-10 h-10 text-[#1dddf2]" />
            </div>
            <h3 className="text-xl text-white font-semibold mb-2">
              No Announcements Yet
            </h3>
            <p className="text-gray-400">
              Check back later for important updates and pinned posts
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && pinnedData?.pagination && pinnedData.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pb-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#272729] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3c] transition-all"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-white">
              Page {page} of {pinnedData.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= pinnedData.pagination.totalPages}
              className="px-4 py-2 bg-[#272729] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3c] transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}