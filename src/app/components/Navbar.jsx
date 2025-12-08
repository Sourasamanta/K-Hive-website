"use client";
import React, { useState } from "react";
import {
  Search,
  Plus,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import SignUpModal from "./sign-up";
import { useAuth, useLogout } from "@/lib/hooks/useAuth";
import { authApi } from "@/lib/api/auth";
const { useRouter } = require("next/navigation");
import CreatePostModal from "./CreateModal";
import { useCreatePost } from "@/lib/hooks/usePosts";
import { mediaApi } from "@/lib/api/media";
import { useToast } from "@/components/Toast";

export default function RedditNavbar() {
  const [searchFocus, setSearchFocus] = useState(false);
  const [activeFilter, setActiveFilter] = useState("hot");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();
  const createPostMutation = useCreatePost();
  const { data, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: logout } = useLogout();
  const { showToast } = useToast();

  // Safely access user data
  const user = data?.user || null;

  const handleGoogleLogin = () => {
    authApi.loginWithGoogle();
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleCreatePost = async (postData) => {
    setIsSubmitting(true);
    try {
      let mediaUrls = [];

      if (postData.imageFile) {
        const credsResult = await mediaApi.getUploadLink();
        const { token, expire, signature, publicKey, uploadUrl, folder } =
          credsResult.data;

        const timeLeft = expire - Math.floor(Date.now() / 1000);
        if (timeLeft < 10) {
          throw new Error("Upload token expired. Please try again.");
        }

        const uploadFormData = new FormData();
        uploadFormData.append("file", postData.imageFile);
        uploadFormData.append(
          "fileName",
          `${Date.now()}-${postData.imageFile.name}`
        );
        uploadFormData.append("publicKey", publicKey);
        uploadFormData.append("signature", signature);
        uploadFormData.append("expire", expire);
        uploadFormData.append("token", token);
        uploadFormData.append("folder", folder);

        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || "Failed to upload image");
        }

        mediaUrls.push(uploadResult.url);
      }

      const finalPostData = {
        title: postData.title.trim(),
        content: postData.content.trim(),
        tags: postData.tags,
      };

      if (mediaUrls.length > 0) {
        finalPostData.media = mediaUrls;
      }

      await createPostMutation.mutateAsync(finalPostData);
      setIsCreateModalOpen(false);

      // Show success toast
      showToast("Post created successfully! 🎉", "success");
    } catch (err) {
      console.error("Error creating post:", err);

      // Show error toast
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create post";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .slide-down {
                    animation: slideDown 0.3s ease-out;
                }
                    @keyframes neonPulse {
  0%, 100% { box-shadow: 0 0 5px rgba(29,221,242,0.5); }
  50% { box-shadow: 0 0 20px rgba(29,221,242,0.8); }
}
.neon-border {
  animation: neonPulse 2s infinite;
}
            `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020d1776] border-b border-[#1dddf2]/20 backdrop-blur-md">
        {/* Main Navbar */}
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-[1400px] mx-auto">
            {/* Logo Section */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="bg-[#37ff0074] rounded-full w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center">
                <span className="text-white font-bold text-xl sm:text-2xl lg:text-3xl">
                  K
                </span>
              </div>
              <span className="text-white font-semibold text-lg sm:text-xl lg:text-2xl hidden sm:block whitespace-nowrap">
                K-Hive
              </span>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-3xl mx-4 lg:mx-6">
              <div
                className={`flex items-center bg-[#0d1d2c] border border-[#343536] hover:border-[#1dddf2]/50 rounded-full px-4 lg:px-5 py-2 lg:py-3 transition-all w-full ${
                  activeFilter === "search"
                    ? "ring-2 ring-[#1dddf2] bg-[#0d1d2c]"
                    : ""
                }`}
              >
                <Search className="text-gray-400 w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search K-Hive"
                  className="bg-transparent text-gray-300 placeholder-gray-500 outline-none flex-1 text-sm lg:text-base"
                  onFocus={() => setActiveFilter("search")}
                  onBlur={() => setActiveFilter("hot")}
                />
              </div>
            </div>

            {/* Mobile Search Button */}
            <button
              className="md:hidden p-2 text-gray-200 hover:bg-[#323234] rounded-full transition-all"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Right Section - Desktop */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
              {/* Create Post Button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 xl:px-6 py-2 xl:py-3 text-gray-100 border border-[#1dddf2] neon-border hover:border-[#1dddf2]/30 hover:shadow-[0_0_10px_rgba(29,221,242,0.3)] rounded-full transition-all"
              >
                <Plus className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
                <span className="text-base xl:text-lg font-semibold tracking-wide whitespace-nowrap">
                  Create
                </span>
              </button>

              {/* User Section - Conditional Rendering */}
              {isLoading ? (
                <div className="w-10 h-10 bg-[#323234] rounded-full animate-pulse"></div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 xl:gap-3 px-3 xl:px-4 py-2 xl:py-3 text-gray-200 hover:border-[#1dddf2]/30 hover:shadow-[0_0_10px_rgba(29,221,242,0.3)] rounded-full transition-all"
                  >
                    <span className="text-sm xl:text-base font-medium whitespace-nowrap">
                      Hi, {user.name}
                    </span>
                    {user.avatarLink ? (
                      <img
                        src={user.avatarLink}
                        alt={user.name}
                        className="w-8 h-8 xl:w-9 xl:h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-full bg-[#00ff1187] flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#0d1d2c] border border-[#1dddf2]/30 shadow-[0_0_20px_rgba(29,221,242,0.2)] rounded-lg shadow-lg slide-down">
                      <div className="py-2">
                        <button
                          onClick={() => router.push("/profile")}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-[#323234] transition-all"
                        >
                          <User className="w-5 h-5" />
                          <span className="text-sm">Profile</span>
                        </button>

                        <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-[#323234] transition-all">
                          <Settings className="w-5 h-5" />
                          <span className="text-sm">Settings</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-[#323234] transition-all"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Log In Button */}
                  <button
                    onClick={handleGoogleLogin}
                    className="flex items-center gap-2 xl:gap-3 px-3 xl:px-4 py-2 xl:py-3 text-gray-200 hover:bg-[#323234] rounded-full transition-all"
                  >
                    <User className="w-5 h-5 xl:w-6 xl:h-6" />
                    <span className="text-sm xl:text-base font-medium whitespace-nowrap">
                      Log In
                    </span>
                  </button>

                  {/* Sign Up Button */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="relative bg-gradient-to-r from-[#1dddf2] to-[#00ff11] hover:shadow-[0_0_20px_rgba(29,221,242,0.6)] text-white px-5 xl:px-8 py-2 xl:py-3 rounded-full font-semibold text-sm xl:text-base transition-colors overflow-hidden"
                  >
                    <span className="relative z-10 whitespace-nowrap">
                      Sign Up
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-shimmer"></span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Actions - Tablet & Mobile */}
            <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
              {/* User Avatar or Sign Up - Mobile */}
              {isLoading ? (
                <div className="w-8 h-8 bg-[#323234] rounded-full animate-pulse"></div>
              ) : user ? (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center gap-2"
                >
                  {user.avatarLink ? (
                    <img
                      src={user.avatarLink}
                      alt={user.name}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#00ff1187] flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="relative bg-[#00ff1187] hover:bg-[#ff5722] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-colors overflow-hidden"
                >
                  <span className="relative z-10 whitespace-nowrap">
                    Sign Up
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] animate-shimmer"></span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="p-2 text-gray-200 bg-[#0d1d2c] border-t border-[#1dddf2]/20 rounded-full transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-3 sm:px-4 pb-3 slide-down">
            <div
              className={`flex items-center bg-[#272729] rounded-full px-4 py-2.5 transition-all ${
                searchFocus ? "ring-2 ring-white bg-[#1a1a1b]" : ""
              }`}
            >
              <Search className="text-gray-400 w-5 h-5 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search K-Hive"
                className="bg-transparent text-gray-300 placeholder-gray-500 outline-none flex-1 text-sm"
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1a1a1b] border-t border-[#343536] slide-down">
            <div className="px-3 sm:px-4 py-3 space-y-2">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-[#343536]">
                    <p className="text-white font-semibold">Hi, {user.name}</p>
                    <p className="text-gray-400 text-sm">{user.gmailId}</p>
                  </div>

                  {/* Create Post */}
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-100 hover:bg-[#3a3a3c] rounded-xl transition-all"
                  >
                    <Plus className="w-5 h-5 text-white" />
                    <span className="text-base font-semibold">Create Post</span>
                  </button>

                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-[#323234] transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm">Profile</span>
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-200 hover:bg-[#323234] transition-all">
                    <Settings className="w-5 h-5" />
                    <span className="text-sm">Settings</span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-[#343536] my-2"></div>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-[#323234] rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-base font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Log In */}
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-[#323234] rounded-xl transition-all"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-base font-medium">Log In</span>
                  </button>

                  {/* Divider */}
                  <div className="border-t border-[#343536] my-2"></div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <SignUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        isSubmitting={isSubmitting}
      />

      <div className="h-[68px] sm:h-[80px]"></div>
    </>
  );
}
