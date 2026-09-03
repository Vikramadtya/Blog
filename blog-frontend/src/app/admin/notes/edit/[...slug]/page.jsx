"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarkdownPreview from "@/presentation/admin/MarkdownPreview";

export default function EditNotePage({ params }) {
  const router = useRouter();
  // slug is an array of path parts. Next.js might pass them URL-encoded.
  const slugArray = params.slug || [];
  const notePath = slugArray.map(decodeURIComponent).join("/");
  
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [status, setStatus] = useState("loading");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [hasUnsavedDraft, setHasUnsavedDraft] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/admin/notes/single?path=${encodeURIComponent(notePath)}`);
        const data = await res.json();
        if (res.ok) {
          setContent(data.content || "");
          setStatus("idle");
          
          if (typeof window !== "undefined") {
            const draft = localStorage.getItem(`draft_note_${notePath}`);
            if (draft && draft !== data.content) {
              setHasUnsavedDraft(true);
              const useDraft = window.confirm("You have an unsaved draft. Do you want to load it?");
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

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaveMessage("");
    try {
      const res = await fetch("/api/admin/notes/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: notePath, content })
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
    return <div className="p-8 text-center text-gray-500">Loading editor...</div>;
  }
  if (status === "error") {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            &larr; Back to Admin
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editing Note: {notePath}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && <span className="text-sm text-green-600 dark:text-green-400">{saveMessage}</span>}
          {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
          {hasUnsavedDraft && <span className="text-sm text-amber-600 dark:text-amber-400">Unsaved draft</span>}
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 flex flex-col h-[70vh]">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 p-3 rounded-t-xl">
          <span className="text-sm font-medium text-gray-500">Markdown Content</span>
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="text-xs bg-gray-200 dark:bg-zinc-800 px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
          >
            {isPreview ? "Show Editor" : "Show Preview"}
          </button>
        </div>
        
        {isPreview ? (
          <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900">
            <MarkdownPreview content={content} />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={handleContentChange}
            className="flex-1 w-full resize-none bg-transparent p-6 font-mono text-sm text-gray-900 focus:outline-none dark:text-gray-100"
            placeholder="Write your note content here..."
            spellCheck="false"
          />
        )}
      </div>
    </div>
  );
}
