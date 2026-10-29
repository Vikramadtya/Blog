"use client";

import React, { useState, useEffect } from "react";

export default function CommentsSection({ blogId }) {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("loading"); // loading, idle, submitting, error
  const [formData, setFormData] = useState({
    authorName: "",
    authorEmail: "",
    content: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        const { fetchComments } = await import("@/lib/client/api");
        const data = await fetchComments(blogId);
        setComments(data || []);
        setStatus("idle");
      } catch (err) {
        console.warn("Failed to load comments:", err);
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
    <div className="mt-16 border-t border-border pt-10">
      <h3 className="mb-8 text-2xl font-bold text-foreground">
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-12 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="authorName"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Name *
            </label>
            <input
              type="text"
              id="authorName"
              required
              value={formData.authorName}
              onChange={(e) =>
                setFormData({ ...formData, authorName: e.target.value })
              }
              className="w-full rounded-md border bg-background p-2 text-sm"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label
              htmlFor="authorEmail"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Email{" "}
              <span className="text-xs text-muted-foreground">
                (optional, for avatar)
              </span>
            </label>
            <input
              type="email"
              id="authorEmail"
              value={formData.authorEmail}
              onChange={(e) =>
                setFormData({ ...formData, authorEmail: e.target.value })
              }
              className="w-full rounded-md border bg-background p-2 text-sm"
              placeholder="john@example.com"
            />
          </div>
        </div>
        {/* Honeypot: hidden from people, bots fill it in */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          value={formData.website || ""}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
        />
        <div>
          <label
            htmlFor="content"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Comment *
          </label>
          <textarea
            id="content"
            required
            rows={4}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full resize-y rounded-md border bg-background p-2 text-sm"
            placeholder="What are your thoughts?"
          />
        </div>

        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
        >
          {status === "submitting" ? "Posting..." : "Post Comment"}
        </button>
      </form>

      <div className="space-y-8">
        {status === "loading" && (
          <p className="text-muted-foreground">Loading comments...</p>
        )}
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
              <div className="mb-1 flex items-baseline gap-2">
                <h4 className="font-semibold text-foreground">
                  {comment.authorName}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        {status === "idle" && comments.length === 0 && (
          <p className="rounded-lg bg-muted/30 py-8 text-center text-muted-foreground">
            Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
}
