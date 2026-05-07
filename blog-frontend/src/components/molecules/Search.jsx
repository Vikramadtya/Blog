"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "../atoms/Icon";
import Card from "../atoms/Card";

const SearchContent = ({ blogs }) => {
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
    <div className="w-full space-y-12">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
          <Icon kind="search" className="h-6 w-6 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by title, topics, or keywords..."
          className="block w-full rounded-3xl border-2 border-border bg-background py-5 pl-14 pr-6 text-xl shadow-lg transition-all focus:border-indigo-500 focus:outline-none focus:ring-8 focus:ring-indigo-500/5 dark:bg-neutral-900 md:text-2xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-5 text-muted-foreground hover:text-indigo-500"
          >
            <Icon kind="close" className="h-6 w-6" />
          </button>
        )}
      </div>

      {filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="transition-all hover:scale-[1.03] active:scale-100">
              <Card blog={blog} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 transition-transform hover:scale-110">
            <Icon kind="search" className="h-12 w-12 opacity-30" />
          </div>
          <h3 className="mt-8 text-2xl font-bold">No posts found</h3>
          <p className="mt-2 text-lg text-muted-foreground">
            We couldn&apos;t find anything matching &quot;{query}&quot;
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-8 font-semibold text-indigo-500 hover:text-indigo-600 hover:underline"
          >
            Clear search filters
          </button>
        </div>
      )}
    </div>
  );
};

const Search = ({ blogs }) => (
  <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Initializing search...</div>}>
    <SearchContent blogs={blogs} />
  </Suspense>
);

export default Search;
