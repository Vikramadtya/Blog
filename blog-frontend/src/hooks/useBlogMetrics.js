"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getBlogMetadataById, incrementBlogLikesOrViewsById } from "@/lib/client/api";
import { METADATA_TYPE } from "@/lib/constants";

/**
 * Custom hook to manage blog likes and views with optimistic updates and local storage.
 * @param {string} id - The blog ID.
 * @param {number} initialLikes - The initial like count from static build.
 * @param {number} initialViews - The initial view count from static build.
 */
export function useBlogMetrics(id, initialLikes = 0, initialViews = 0) {
  const [metrics, setMetrics] = useState({ likes: initialLikes, views: initialViews });
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const initialized = useRef(false);

  // Load metrics from server and check local "liked" state
  useEffect(() => {
    if (!id) return;

    // Check localStorage for like status
    const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
    setHasLiked(likedPosts.includes(id));

    // Fetch latest metrics from server
    const fetchMetrics = async () => {
      try {
        const data = await getBlogMetadataById(id);
        setMetrics({
          likes: data.likes ?? initialLikes,
          views: data.views ?? initialViews,
        });

        // Increment views automatically once per session (simple check)
        if (!initialized.current) {
          initialized.current = true;
          const sessionViews = JSON.parse(sessionStorage.getItem("viewed_posts") || "[]");
          if (!sessionViews.includes(id)) {
            const response = await incrementBlogLikesOrViewsById(id, METADATA_TYPE.views);
            if (response?.success) {
              setMetrics(prev => ({ ...prev, views: response.data.views }));
              sessionViews.push(id);
              sessionStorage.setItem("viewed_posts", JSON.stringify(sessionViews));
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch blog metrics:", err);
      }
    };

    fetchMetrics();
  }, [id, initialLikes, initialViews]);

  // Handle Like action
  const toggleLike = useCallback(async () => {
    if (!id || hasLiked || isLiking) return;

    setIsLiking(true);
    
    // Optimistic Update
    setMetrics(prev => ({ ...prev, likes: prev.likes + 1 }));
    setHasLiked(true);

    try {
      const response = await incrementBlogLikesOrViewsById(id, METADATA_TYPE.likes);
      
      if (response?.success) {
        setMetrics(prev => ({ ...prev, likes: response.data.likes }));
        
        // Persist like status locally
        const likedPosts = JSON.parse(localStorage.getItem("liked_posts") || "[]");
        likedPosts.push(id);
        localStorage.setItem("liked_posts", JSON.stringify(likedPosts));
      } else {
        throw new Error("Failed to update like");
      }
    } catch (err) {
      console.error("Like failed:", err);
      // Revert Optimistic Update
      setMetrics(prev => ({ ...prev, likes: prev.likes - 1 }));
      setHasLiked(false);
    } finally {
      setIsLiking(false);
    }
  }, [id, hasLiked, isLiking]);

  return {
    ...metrics,
    hasLiked,
    isLiking,
    toggleLike,
  };
}
