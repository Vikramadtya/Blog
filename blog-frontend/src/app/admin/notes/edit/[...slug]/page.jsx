"use client";

import React, { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarkdownPreview from "@/presentation/admin/MarkdownPreview";
import { uploadImage } from "@/lib/client/adminApi";

export default function EditNotePage({ params }) {
  const router = useRouter();
  // slug is an array of path parts. Next.js might pass them URL-encoded.
  const slugArray = use(params).slug || [];
  const notePath = slugArray.map(decodeURIComponent).join("/");

  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [status, setStatus] = useState("loading");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [hasUnsavedDraft, setHasUnsavedDraft] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(
          `/api/admin/notes/single?path=${encodeURIComponent(notePath)}`,
        );
        const data = await res.json();
        if (res.ok) {
          const saved = data.file?.content ?? "";
          setContent(saved);
          setStatus("idle");

          if (typeof window !== "undefined") {
            const draft = localStorage.getItem(`draft_note_${notePath}`);
            if (draft && draft !== saved) {
              setHasUnsavedDraft(true);
              const useDraft = window.confirm(
                "You have an unsaved draft. Do you want to load it?",
              );
              if (useDraft) setContent(draft);
            }
          }
        } else {
          throw new Error(data.error || "Failed to load note");
        }
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    };
    fetchNote();
  }, [notePath]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (typeof window !== "undefined") {
      localStorage.setItem(`draft_note_${notePath}`, newContent);
    }
  };

  const updateContent = (next) => {
    setContent(next);
    if (typeof window !== "undefined")
      localStorage.setItem(`draft_note_${notePath}`, next);
  };

  // Uploads the image, then inserts ![name](url) where the cursor is
  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, `notes/${notePath}`);
      const alt = file.name.replace(/\.[^.]+$/, "");
      const snippet = `\n![${alt}](${url})\n`;
      const el = textareaRef.current;
      const at = el ? el.selectionStart : content.length;
      updateContent(
        content.slice(0, at) +
          snippet +
          content.slice(el ? el.selectionEnd : at),
      );
      setIsPreview(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    e.preventDefault();
    handleImageUpload(file);
  };

  const handlePaste = (e) => {
    const file = e.clipboardData?.files?.[0];
    if (!file) return;
    e.preventDefault();
    handleImageUpload(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaveMessage("");
    try {
      const res = await fetch("/api/admin/notes/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: notePath, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSaveMessage("Saved successfully!");
      if (typeof window !== "undefined") {
        localStorage.removeItem(`draft_note_${notePath}`);
        setHasUnsavedDraft(false);
      }
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="p-8 text-center text-gray-500">Loading editor...</div>
    );
  }
  if (status === "error") {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            &larr; Back to Admin
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editing Note: {notePath}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && (
            <span className="text-sm text-green-600 dark:text-green-400">
              {saveMessage}
            </span>
          )}
          {error && (
            <span className="text-sm text-red-600 dark:text-red-400">
              {error}
            </span>
          )}
          {hasUnsavedDraft && (
            <span className="text-sm text-amber-600 dark:text-amber-400">
              Unsaved draft
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>

      <div className="flex h-[70vh] flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <span className="text-sm font-medium text-gray-500">
            Markdown Content
          </span>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleImageUpload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-md bg-gray-200 px-3 py-1 text-xs text-gray-700 transition hover:bg-gray-300 disabled:opacity-50 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
            >
              {uploading ? "Uploading..." : "Insert image"}
            </button>
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="rounded-md bg-gray-200 px-3 py-1 text-xs text-gray-700 transition hover:bg-gray-300 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
            >
              {isPreview ? "Show Editor" : "Show Preview"}
            </button>
          </div>
        </div>

        {isPreview ? (
          <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900">
            <MarkdownPreview
              content={content}
              baseDir={`notes/${notePath.split("/").slice(0, -1).join("/")}`}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onDrop={handleDrop}
            onPaste={handlePaste}
            className="w-full flex-1 resize-none bg-transparent p-6 font-mono text-sm text-gray-900 focus:outline-none dark:text-gray-100"
            placeholder="Write your note content here… drag, drop or paste an image to upload it"
            spellCheck="false"
          />
        )}
      </div>
    </div>
  );
}
