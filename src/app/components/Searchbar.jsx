"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchPosts } from "@/lib/hooks/usePosts";

export default function SearchBar({ 
  isMobile = false, 
  onClose = () => {},
  className = "" 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches:", e);
      }
    }
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch search suggestions (top 5 results)
  const { data: suggestions, isLoading } = useSearchPosts(
    debouncedSearch,
    { 
      page: 1, 
      sortBy: "relevance", 
      limit: 5 
    }
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) return;

    // Add to recent searches
    saveRecentSearch(trimmedQuery);

    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    
    // Clear input and close
    setSearchTerm("");
    setIsFocused(false);
    onClose();
  };

  // Save search to recent searches
  const saveRecentSearch = (query) => {
    const updated = [
      query,
      ...recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase())
    ].slice(0, 10); // Keep only 10 most recent
    
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Clear a single recent search
  const removeRecentSearch = (searchToRemove) => {
    const updated = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchTerm);
    }
  };

  const showDropdown = isFocused && (
    debouncedSearch.length >= 2 || 
    (searchTerm.length === 0 && recentSearches.length > 0)
  );

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div
        className={`flex items-center bg-[#0d1d2c] border transition-all rounded-full px-4 ${
          isMobile ? 'py-2.5' : 'py-2 lg:py-3'
        } ${
          isFocused
            ? "border-[#1dddf2] ring-2 ring-[#1dddf2]/30"
            : "border-[#343536] hover:border-[#1dddf2]/50"
        }`}
      >
        <Search className={`text-gray-400 flex-shrink-0 mr-2 lg:mr-3 ${
          isMobile ? 'w-5 h-5' : 'w-5 h-5 lg:w-6 lg:h-6'
        }`} />
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search K-Hive"
          className="bg-transparent text-gray-300 placeholder-gray-500 outline-none flex-1 text-sm lg:text-base"
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="ml-2 p-1 hover:bg-[#323234] rounded-full transition-all"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown - Suggestions or Recent Searches */}
      {showDropdown && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-[#0d1d2c] border border-[#1dddf2]/30 rounded-lg shadow-[0_0_20px_rgba(29,221,242,0.2)] overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {/* Loading State */}
          {isLoading && debouncedSearch.length >= 2 && (
            <div className="px-4 py-3 text-gray-400 text-sm">
              Searching...
            </div>
          )}

          {/* Search Suggestions */}
          {debouncedSearch.length >= 2 && suggestions?.data && suggestions.data.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide border-b border-[#343536]">
                Suggestions
              </div>
              {suggestions.data.map((post) => (
                <button
                  key={post.postId}
                  onClick={() => handleSearch(post.title)}
                  className="w-full px-4 py-3 text-left hover:bg-[#323234] transition-all border-b border-[#343536]/50 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <Search className="w-4 h-4 text-[#1dddf2] mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-sm font-medium truncate">
                        {post.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                        {post.content}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {debouncedSearch.length >= 2 && suggestions?.data && suggestions.data.length === 0 && !isLoading && (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-400 text-sm">No results found</p>
              <p className="text-gray-500 text-xs mt-1">
                Try different keywords
              </p>
            </div>
          )}

          {/* Recent Searches */}
          {searchTerm.length === 0 && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 flex items-center justify-between border-b border-[#343536]">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-[#1dddf2] hover:text-[#1dddf2]/70 transition-colors"
                >
                  Clear All
                </button>
              </div>
              {recentSearches.slice(0, 5).map((search, index) => (
                <div
                  key={index}
                  className="flex items-center hover:bg-[#323234] transition-all border-b border-[#343536]/50 last:border-b-0"
                >
                  <button
                    onClick={() => handleSearch(search)}
                    className="flex-1 px-4 py-3 text-left flex items-center gap-3"
                  >
                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-200 text-sm">{search}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(search);
                    }}
                    className="px-3 py-3 hover:bg-[#323234]/50"
                  >
                    <X className="w-4 h-4 text-gray-500 hover:text-gray-300" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}