"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "../atoms/Icon";
import Card from "../atoms/Card";

const Search = ({ blogs }) => {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag");
  const [query, setQuery] = useState(initialTag || "");

  const filteredBlogs = useMemo(() => {
    if (!query) return blogs;
    const lowerQuery = query.toLowerCase();
    return (blogs || []).filter((blog) => {
      const titleMatch = blog.title?.toLowerCase().includes(lowerQuery);
      const summaryMatch = (blog.summary || blog.description)?.toLowerCase().includes(lowerQuery);
      const tagsMatch = blog.tags?.some((tag) => 
        (typeof tag === "string" ? tag : tag.name)?.toLowerCase().includes(lowerQuery)
      );
      return titleMatch || summaryMatch || tagsMatch;
    });
  }, [query, blogs]);

  return (
    <div className="w-full space-y-8">
      <div className="relative mx-auto max-w-2xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon kind="search" className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="h-12 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-lg ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search blogs, tags, or topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
            <button 
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground"
            >
                <Icon kind="close" className="h-5 w-5" />
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <Card key={blog.id} blog={blog} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <Icon kind="search" className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <p className="mt-4 text-xl font-medium text-muted-foreground">No blogs found matching &quot;{query}&quot;</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
