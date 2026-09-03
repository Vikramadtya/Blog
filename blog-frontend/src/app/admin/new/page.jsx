"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { siteMetadata } from "../../../../site.config.mjs";

export default function NewPostPage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    tags: "blog",
    type: "blog"
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // If in production, just show an error message.
  const isDev = process.env.NODE_ENV === "development";

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title if slug hasn't been manually edited
    if (name === "title" && formData.slug === slugify(formData.title)) {
      setFormData({ ...formData, title: value, slug: slugify(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const slugify = (text) => {
    return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/create-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(`Success! File created at: ${data.filePath}`);
        // Reset form
        setFormData({ title: "", slug: "", summary: "", tags: "blog", type: "blog" });
      } else {
        setStatus("error");
        setMessage(data.error || "An error occurred.");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 sm:py-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl flex items-center gap-3">
          Create New Post
          {!isDev && (
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              Read-Only Mode
            </span>
          )}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isDev ? "Draft a new markdown post." : "Creation is disabled in production."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Same fields but with disabled={!isDev} */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-foreground">
            Title
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="title"
              id="title"
              required
              disabled={!isDev}
              value={formData.title}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-[#f05a28] sm:text-sm sm:leading-6 bg-background disabled:opacity-50 disabled:bg-muted"
            />
          </div>
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium leading-6 text-foreground">
            Slug / Filename
          </label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-border focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#f05a28] sm:max-w-md bg-background disabled:opacity-50 disabled:bg-muted">
              <span className="flex select-none items-center pl-3 text-muted-foreground sm:text-sm">
                blogs/
              </span>
              <input
                type="text"
                name="slug"
                id="slug"
                required
                disabled={!isDev}
                value={formData.slug}
                onChange={handleChange}
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:bg-muted"
              />
              <span className="flex select-none items-center pr-3 text-muted-foreground sm:text-sm">
                .md
              </span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium leading-6 text-foreground">
            Summary
          </label>
          <div className="mt-2">
            <textarea
              id="summary"
              name="summary"
              rows={3}
              required
              disabled={!isDev}
              value={formData.summary}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-[#f05a28] sm:text-sm sm:leading-6 bg-background disabled:opacity-50 disabled:bg-muted"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tags" className="block text-sm font-medium leading-6 text-foreground">
              Tags (comma separated)
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="tags"
                id="tags"
                disabled={!isDev}
                value={formData.tags}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-[#f05a28] sm:text-sm sm:leading-6 bg-background disabled:opacity-50 disabled:bg-muted"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium leading-6 text-foreground">
              Content Type
            </label>
            <div className="mt-2">
              <select
                id="type"
                name="type"
                disabled={!isDev}
                value={formData.type}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-[#f05a28] sm:text-sm sm:leading-6 bg-background disabled:opacity-50 disabled:bg-muted"
              >
                <option value="blog">Blog</option>
                <option value="snippet">Snippet</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 pt-4 border-t border-border mt-8">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="text-sm font-semibold leading-6 text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === "loading" || !isDev}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              !isDev ? "bg-gray-400 cursor-not-allowed opacity-50" : "bg-[#f05a28] hover:bg-[#d94a1b] focus-visible:outline-[#f05a28]"
            }`}
          >
            {status === "loading" ? "Creating..." : "Create Post"}
          </button>
        </div>

        {message && (
          <div className={`mt-4 rounded-md p-4 text-sm font-medium ${
            status === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
