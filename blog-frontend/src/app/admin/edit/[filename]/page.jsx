"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MarkdownPreview from "@/presentation/admin/MarkdownPreview";
import { uploadImage } from "@/lib/client/adminApi";
import FormattingToolbar from "@/presentation/admin/FormattingToolbar";
import SubPagesPanel from "@/presentation/admin/SubPagesPanel";

export default function EditPostPage({ params }) {
  const filename = decodeURIComponent(params.filename).replace(/^(\.\.\/|\.\.\\|\/|\\)+/, "");
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    series: "",
    seriesOrder: "",
    summary: "",
    tags: "",
    type: "blog",
    previewImageSrc: "",
    publishAt: ""
  });
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [hasUnsavedDraft, setHasUnsavedDraft] = useState(false);
  const [savedDraftContent, setSavedDraftContent] = useState("");
  const [subPages, setSubPages] = useState([]);
  const [currentSlug, setCurrentSlug] = useState("");

  const contentRef = useRef(null);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/single?filename=${filename}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            title: data.metadata.title || "",
            series: data.metadata.series || "",
            seriesOrder: data.metadata.seriesOrder || "",
            summary: data.metadata.summary || "",
            tags: data.metadata.tags || "",
            type: data.metadata.type || "blog",
            previewImageSrc: data.metadata.previewImageSrc || "",
            publishAt: data.metadata.publishAt || ""
          });
          setContent(data.content || "");
          setStatus("idle");
          const slug = data.metadata.slug || filename.replace(".md", "");
          setCurrentSlug(slug);

          // Fetch all posts to find sub-pages of this post
          try {
            const allRes = await fetch("/api/admin/posts");
            const allData = await allRes.json();
            if (allData.posts) {
              const children = allData.posts
                .filter(p => p.series === slug)
                .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
              setSubPages(children);
            }
          } catch (e) {
            console.warn("Failed to fetch sub-pages", e);
          }
          
          // Check for local storage draft
          if (typeof window !== "undefined") {
            const draft = localStorage.getItem(`draft_${filename}`);
            if (draft && draft !== data.content) {
              setHasUnsavedDraft(true);
              setSavedDraftContent(draft);
            }
          }
        } else {
          setStatus("error");
          setMessage(data.error);
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.message);
      }
    };
    fetchPost();
  }, [filename, isDev]);

  // Autosave to localStorage
  useEffect(() => {
    if (status !== "loading" && isDev && content !== "") {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`draft_${filename}`, content);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [content, filename, isDev, status]);

  const restoreDraft = () => {
    if (savedDraftContent) {
      setContent(savedDraftContent);
      setHasUnsavedDraft(false);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(`draft_${filename}`);
    setHasUnsavedDraft(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const res = await fetch("/api/admin/posts/single", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          metadata: formData,
          content
        }),
      });

      if (res.ok) {
        setStatus("idle");
        setMessage("Post saved successfully!");
        localStorage.removeItem(`draft_${filename}`);
        setHasUnsavedDraft(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.error || "Failed to save post");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  const insertAtCursor = (text) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const before = content.substring(0, start);
    const after = content.substring(end);
    
    setContent(before + text + after);
    
    // Reset cursor
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const formatText = (prefix, suffix = "") => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const before = content.substring(0, start);
    const selected = content.substring(start, end);
    const after = content.substring(end);
    
    setContent(before + prefix + selected + suffix + after);
    
    setTimeout(() => {
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = end + prefix.length;
      textarea.focus();
    }, 0);
  };

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    setIsUploading(true);
    const placeholder = `![Uploading ${file.name}...]()\n`;
    insertAtCursor(placeholder);

    try {
      const url = await uploadImage(file);
      setContent((prev) => prev.replace(placeholder, `![${file.name}](${url})\n`));
    } catch (err) {
      alert("Upload failed: " + err.message);
      setContent((prev) => prev.replace(placeholder, ""));
    }
    setIsUploading(false);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setIsUploadingCover(true);
    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, previewImageSrc: url }));
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
    setIsUploadingCover(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      handleImageUpload(e.clipboardData.files[0]);
    }
  };

  if (status === "loading") {
    return <div className="p-20 text-center">Loading editor...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Edit Post
            {!isDev && (
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                Read-Only Mode
              </span>
            )}
          </h1>
          <p className="mt-2 text-muted-foreground font-mono text-sm">
            {filename}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin")}
            className="rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={handleSave}
            disabled={status === "saving" || !isDev}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors ${
              !isDev ? "bg-gray-400 cursor-not-allowed opacity-50" : "bg-[#f05a28] hover:bg-[#d94a1b]"
            }`}
          >
            {status === "saving" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 rounded-md p-4 text-sm font-medium ${
          status === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Column */}
        <div className="lg:col-span-2 space-y-4">
          
          {hasUnsavedDraft && (
            <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-amber-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                    You have an unsaved draft in your browser.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={restoreDraft} className="text-sm font-semibold text-amber-800 dark:text-amber-200 hover:underline">
                    Restore
                  </button>
                  <span className="text-amber-800 dark:text-amber-200">&middot;</span>
                  <button onClick={discardDraft} className="text-sm text-amber-700 dark:text-amber-400 hover:underline">
                    Discard
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-foreground">Markdown Content</label>
              <span className="text-xs text-muted-foreground">
                {isDev ? "Drag & drop or paste images to upload" : "Editor disabled in production"}
              </span>
            </div>
            <button 
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="text-xs bg-muted px-3 py-1 rounded-md text-foreground hover:bg-muted/80 transition"
            >
              {isPreview ? "Show Editor" : "Show Preview"}
            </button>
          </div>

          {isDev && !isPreview && <FormattingToolbar onFormat={formatText} />}

          {isPreview ? (
            <div className="w-full h-[600px] overflow-auto rounded-md border bg-card text-foreground shadow-sm">
              <MarkdownPreview content={content} />
            </div>
          ) : (
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onDrop={isDev ? handleDrop : undefined}
              onPaste={isDev ? handlePaste : undefined}
              onDragOver={(e) => e.preventDefault()}
              className={`w-full h-[600px] font-mono text-sm p-4 rounded-md border bg-card text-foreground shadow-sm focus:ring-2 focus:ring-[#f05a28] focus:border-transparent outline-none resize-y ${
                !isDev && "opacity-70 bg-muted cursor-not-allowed"
              }`}
              placeholder="Write your markdown here..."
              disabled={isUploading || !isDev}
            />
          )}
        </div>

        {/* Metadata Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Frontmatter</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={!isDev}
                  className="w-full rounded-md border p-2 text-sm bg-background disabled:opacity-50 disabled:bg-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Summary</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  disabled={!isDev}
                  rows={3}
                  className="w-full rounded-md border p-2 text-sm bg-background resize-none disabled:opacity-50 disabled:bg-muted"
                />
              </div>

              <div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Series Slug (Optional)</label>
                <input
                  type="text"
                  name="series"
                  value={formData.series}
                  onChange={handleChange}
                  disabled={!isDev}
                  placeholder="Parent post slug"
                  className="w-full rounded-md border p-2 text-sm bg-background disabled:opacity-50 disabled:bg-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Series Order (Optional)</label>
                <input
                  type="number"
                  name="seriesOrder"
                  value={formData.seriesOrder}
                  onChange={handleChange}
                  disabled={!isDev}
                  placeholder="e.g. 1"
                  className="w-full rounded-md border p-2 text-sm bg-background disabled:opacity-50 disabled:bg-muted"
                />
              </div>

                <label className="block text-xs font-medium text-muted-foreground mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  disabled={!isDev}
                  className="w-full rounded-md border p-2 text-sm bg-background disabled:opacity-50 disabled:bg-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Content Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={!isDev}
                  className="w-full rounded-md border p-2 text-sm bg-background disabled:opacity-50 disabled:bg-muted"
                >
                  <option value="blog">Blog</option>
                  <option value="snippet">Snippet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Preview Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="previewImageSrc"
                    value={formData.previewImageSrc}
                    onChange={handleChange}
                    disabled={!isDev || isUploadingCover}
                    placeholder="/images/cover.png"
                    className="flex-1 w-full rounded-md border p-2 text-sm bg-background disabled:opacity-50 disabled:bg-muted"
                  />
                  <label className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700 rounded-md border px-3 py-2 text-sm flex items-center justify-center whitespace-nowrap disabled:opacity-50 transition-colors">
                    {isUploadingCover ? "..." : "Upload"}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      disabled={!isDev || isUploadingCover} 
                      onChange={handleCoverUpload} 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Scheduled Publish Date (Optional)</label>
                <input
                  type="datetime-local"
                  name="publishAt"
                  value={formData.publishAt}
                  onChange={handleChange}
                  disabled={!isDev}
                  className="w-full rounded-md border p-2 text-sm bg-background disabled:opacity-50 disabled:bg-muted"
                />
              </div>
                
              {formData.previewImageSrc && (
                <div className="mt-2 aspect-video w-full rounded-md border overflow-hidden relative opacity-80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.previewImageSrc} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>

          {!formData.series && (
            <SubPagesPanel subPages={subPages} currentSlug={currentSlug} isDev={isDev} />
          )}
        </div>
      </div>
    </div>
  );
}
