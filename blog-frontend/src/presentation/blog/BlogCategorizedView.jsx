"use client";

import React, { useState } from "react";
import BlogEditorialCard from "@/presentation/blog/BlogEditorialCard";

export default function BlogCategorizedView({ categories = [] }) {
  const [activeCategory, setActiveCategory] = useState("__all__");

  const totalAllPosts = categories.reduce(
    (sum, cat) => sum + (cat.totalPostsCount || 0),
    0
  );

  const filteredCategories =
    activeCategory === "__all__"
      ? categories
      : categories.filter((c) => c.key === activeCategory);

  return (
    <div>
      {/* Terminal Style Filter Chips */}
      <section className="blog-controls" aria-label="Filter posts by category">
        <div className="blog-chips" role="group">
          <button
            type="button"
            className="blog-chip"
            aria-pressed={activeCategory === "__all__"}
            onClick={() => setActiveCategory("__all__")}
          >
            <span className="blog-chip-label">all</span>
            <span className="blog-chip-count mono">{totalAllPosts}</span>
          </button>

          {categories.map((cat) => {
            const isPressed = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                className="blog-chip"
                aria-pressed={isPressed}
                onClick={() =>
                  setActiveCategory(isPressed ? "__all__" : cat.key)
                }
              >
                <span className="blog-chip-label">{cat.key}</span>
                <span className="blog-chip-count mono">
                  {cat.totalPostsCount}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Categorized Sections */}
      <section className="flex flex-col gap-10">
        {filteredCategories.map((cat) => (
          <div key={cat.key} className="flex flex-col gap-3">
            {/* Category Header */}
            <div className="blog-category-header">
              <h2 className="blog-category-title">
                <span className="mono blog-category-hash">##</span>
                <span>{cat.label}</span>
                <span className="mono blog-category-count">
                  [{cat.totalPostsCount}]
                </span>
              </h2>
              {cat.blurb && (
                <p className="blog-category-blurb">{cat.blurb}</p>
              )}
            </div>

            {/* Series Accordions (Collapsible) */}
            {cat.seriesList &&
              cat.seriesList.map((series) => {
                const totalParts = series.parts.length;
                return (
                  <details
                    key={series.parent.slug}
                    className="blog-section"
                    open
                  >
                    <summary className="blog-section-header">
                      <span
                        className="blog-section-chevron mono"
                        aria-hidden="true"
                      >
                        &#9656;
                      </span>
                      <span className="blog-section-title">
                        {series.parent.title}
                      </span>
                      <span className="blog-section-count mono">
                        {totalParts} {totalParts === 1 ? "post" : "posts"}
                      </span>
                    </summary>

                    <div className="blog-section-grid">
                      {series.parts.map((part, pIdx) => (
                        <BlogEditorialCard
                          key={part.slug}
                          post={part}
                          partLabel={`Part ${pIdx + 1}`}
                        />
                      ))}
                    </div>
                  </details>
                );
              })}

            {/* Standalone Posts Grid */}
            {cat.standalonePosts && cat.standalonePosts.length > 0 && (
              <div className="blog-section-grid">
                {cat.standalonePosts.map((post) => (
                  <BlogEditorialCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
