"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getBlogMetadataById, incrementBlogLikesOrViewsById } from "@/lib/client/api";
import { METADATA_TYPE } from "@/lib/constants";

// Storage Helpers with SSR safety
const safeStorage = {
  getItem: (key, type = "local") => {
    try {
      if (typeof window === "undefined") return null;
      const storage = type === "local" ? window.localStorage : window.sessionStorage;
      return storage.getItem(key);
    } catch (e) { return null; }
  },
  setItem: (key, value, type = "local") => {
    try {
      if (typeof window === "undefined") return;
      const storage = type === "local" ? window.localStorage : window.sessionStorage;
      storage.setItem(key, value);
    } catch (e) {}
  }
};

/**
 * Custom hook to manage blog likes and views with optimistic updates and local storage.
 * @param {string} id - The blog ID.
 * @param {number} initialLikes - The initial like count from static build.
 * @param {number} initialViews - The initial view count from static build.
 */
export function useBlogMetrics(id, initialLikes = 0, initialViews = 0, autoIncrementViews = true) {
  const [metrics, setMetrics] = useState({ likes: initialLikes, views: initialViews });
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const initialized = useRef(null);

  // Load metrics from server and check local "liked" state
  useEffect(() => {
    if (!id) return;

    // Reset if ID changes
    if (initialized.current !== id) {
      initialized.current = null;
    }

    // Check localStorage for like status
    const likedPosts = JSON.parse(safeStorage.getItem("liked_posts") || "[]");
    setHasLiked(likedPosts.includes(id));

    const fetchMetrics = async () => {
      try {
        const data = await getBlogMetadataById(id);
        if (data) {
          setMetrics({
            likes: data.likes ?? initialLikes,
            views: data.views ?? initialViews,
          });
        }

        // Increment views once per session
        if (autoIncrementViews && initialized.current !== id) {
          const sessionViews = JSON.parse(safeStorage.getItem("viewed_posts", "session") || "[]");
          if (!sessionViews.includes(id)) {
            const response = await incrementBlogLikesOrViewsById(id, METADATA_TYPE.views.type);
            if (response?.success) {
              setMetrics(prev => ({ ...prev, views: response.data.views }));
              sessionViews.push(id);
              safeStorage.setItem("viewed_posts", JSON.stringify(sessionViews), "session");
            }
          }
          initialized.current = id;
        }
      } catch (err) {
        console.error(`[useBlogMetrics] Failed for ${id}:`, err);
      }
    };

    fetchMetrics();
  }, [id, initialLikes, initialViews, autoIncrementViews]); // Added missing dependencies

  // Handle Like action
  const toggleLike = useCallback(async () => {
    if (!id || hasLiked || isLiking) return;

    setIsLiking(true);
    setMetrics(prev => ({ ...prev, likes: prev.likes + 1 }));
    setHasLiked(true);

    try {
      const response = await incrementBlogLikesOrViewsById(id, METADATA_TYPE.likes.type);
      
      if (response?.success) {
        setMetrics(prev => ({ ...prev, likes: response.data.likes }));
        const likedPosts = JSON.parse(safeStorage.getItem("liked_posts") || "[]");
        if (!likedPosts.includes(id)) {
          likedPosts.push(id);
          safeStorage.setItem("liked_posts", JSON.stringify(likedPosts));
        }
      } else {
        throw new Error("API returned failure");
      }
    } catch (err) {
      console.error("[useBlogMetrics] Like failed:", err);
      setMetrics(prev => ({ ...prev, likes: prev.likes - 1 }));
      setHasLiked(false);
    } finally {
      setIsLiking(false);
    }
  }, [id, hasLiked, isLiking]);

  return {
    likes: metrics.likes,
    views: metrics.views,
    hasLiked,
    isLiking,
    toggleLike,
  };
}
