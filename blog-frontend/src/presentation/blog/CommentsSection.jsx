"use client";

import React, { useState, useEffect } from "react";

export default function CommentsSection({ blogId }) {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("loading"); // loading, idle, submitting, error
  const [formData, setFormData] = useState({ authorName: "", authorEmail: "", content: "" });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        const { fetchComments } = await import("@/lib/client/api");
        const data = await fetchComments(blogId);
        setComments(data || []);
        setStatus("idle");
      } catch (err) {
        console.error("Failed to load comments:", err);
        setStatus("idle");
      }
    };
    loadComments();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.authorName || !formData.content) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const { postComment } = await import("@/lib/client/api");
      const res = await postComment(blogId, formData);
      
      if (res.success) {
        // Optimistic update
        const newComment = {
          id: res.id,
          blogId,
          ...formData,
          createdAt: new Date().toISOString(),
        };
        setComments([newComment, ...comments]);
        setFormData({ authorName: "", authorEmail: "", content: "" });
        setStatus("idle");
      } else {
        throw new Error(res.error || "Failed to post comment");
      }
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-border">
      <h3 className="text-2xl font-bold text-foreground mb-8">
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-12 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-foreground mb-1">
              Name *
            </label>
            <input
              type="text"
              id="authorName"
              required
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              className="w-full rounded-md border p-2 text-sm bg-background"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="authorEmail" className="block text-sm font-medium text-foreground mb-1">
              Email <span className="text-muted-foreground text-xs">(optional, for avatar)</span>
            </label>
            <input
              type="email"
              id="authorEmail"
              value={formData.authorEmail}
              onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
              className="w-full rounded-md border p-2 text-sm bg-background"
              placeholder="john@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
            Comment *
          </label>
          <textarea
            id="content"
            required
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full rounded-md border p-2 text-sm bg-background resize-y"
            placeholder="What are your thoughts?"
          />
        </div>
        
        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors"
        >
          {status === "submitting" ? "Posting..." : "Post Comment"}
        </button>
      </form>

      <div className="space-y-8">
        {status === "loading" && <p className="text-muted-foreground">Loading comments...</p>}
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName)}&background=random`}
                alt={comment.authorName}
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <h4 className="font-semibold text-foreground">{comment.authorName}</h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString(undefined, { 
                    year: 'numeric', month: 'short', day: 'numeric' 
                  })}
                </span>
              </div>
              <p className="text-foreground text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}
        {status === "idle" && comments.length === 0 && (
          <p className="text-muted-foreground text-center py-8 bg-muted/30 rounded-lg">
            Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
}
