"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BlogExplorerSidebar({
  categories = [],
  tableOfContents = [],
  currentSlug = "",
  initialCollapsed = false,
  onToggleCollapse,
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  // Default open all categories
  const [openFolders, setOpenFolders] = useState(() => {
    const initial = {};
    categories.forEach((cat) => {
      initial[cat.key] = true;
    });
    return initial;
  });

  const [activeHeadingId, setActiveHeadingId] = useState("");

  const toggleFolder = (key) => {
    setOpenFolders((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleSidebar = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    if (onToggleCollapse) {
      onToggleCollapse(nextState);
    }
  };

  // Scroll spy for Table of Contents
  useEffect(() => {
    if (!tableOfContents || tableOfContents.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0% 0% -70% 0%",
        threshold: 0.1,
      }
    );

    tableOfContents.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tableOfContents]);

  return (
    <aside className="blog-sidebar">
      {/* Sidebar Collapse Toggle */}
      <button
        type="button"
        className="sidebar-toggle"
        onClick={handleToggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <span className="st-icon mono">{collapsed ? "▸" : "◂"}</span>
        <span className="st-label mono">
          {collapsed ? "Expand" : "Collapse sidebar"}
        </span>
      </button>

      <div className={`blog-sidebar-body ${collapsed ? "hidden" : "block"}`}>
        {/* Code-Editor File Tree Navigation */}
        <nav className="blog-nav" aria-label="Blog Explorer">
          <div className="blog-nav-header mono">
            <span aria-hidden="true">📁</span>
            <span>EXPLORER : ~/BLOG</span>
          </div>

          <div className="space-y-1">
            {categories.map((cat) => {
              const isOpen = !!openFolders[cat.key];
              const totalItems =
                (cat.standalonePosts?.length || 0) +
                (cat.seriesList || []).reduce(
                  (sum, s) => sum + (s.parts?.length || 1),
                  0
                );

              return (
                <div key={cat.key} className="file-tree-group">
                  <button
                    type="button"
                    className="file-tree-folder-btn"
                    onClick={() => toggleFolder(cat.key)}
                    data-open={isOpen}
                    aria-expanded={isOpen}
                  >
                    <span className="file-tree-chevron mono">▸</span>
                    <span className="file-tree-folder-icon" aria-hidden="true">
                      {isOpen ? "📂" : "📁"}
                    </span>
                    <span className="truncate">{cat.key}</span>
                    <span className="file-tree-folder-count mono">
                      [{totalItems}]
                    </span>
                  </button>

                  {isOpen && (
                    <div className="file-tree-items">
                      {/* Series folders or parts */}
                      {cat.seriesList &&
                        cat.seriesList.map((series) => (
                          <div key={series.parent.slug} className="my-0.5">
                            <div className="flex items-center gap-1.5 px-1 py-0.5 text-[0.72rem] font-semibold text-ink-muted/80 mono">
                              <span className="text-[0.68rem] text-primary">↳</span>
                              <span className="truncate">{series.parent.slug}/</span>
                            </div>
                            <div className="ml-2 pl-1.5 border-l border-line flex flex-col gap-0.5">
                              {series.parts.map((part, pIdx) => {
                                const permalink = part.permalink || (part.series ? `${part.series}/${part.slug}` : part.slug);
                                const isCurrent =
                                  currentSlug === part.slug ||
                                  pathname === `/blogs/${permalink}` ||
                                  pathname.endsWith(`/${part.slug}`);

                                return (
                                  <Link
                                    key={part.slug}
                                    href={`/blogs/${permalink}`}
                                    className={`file-tree-item ${
                                      isCurrent ? "active" : ""
                                    }`}
                                    title={part.title}
                                  >
                                    <span className="text-[0.65rem] opacity-60">
                                      {pIdx === 0 ? "index.md" : `${part.slug}.md`}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                      {/* Standalone posts */}
                      {cat.standalonePosts &&
                        cat.standalonePosts.map((post) => {
                          const permalink = post.permalink || post.slug;
                          const isCurrent =
                            currentSlug === post.slug ||
                            pathname === `/blogs/${permalink}` ||
                            pathname.endsWith(`/${post.slug}`);

                          return (
                            <Link
                              key={post.slug}
                              href={`/blogs/${permalink}`}
                              className={`file-tree-item ${
                                isCurrent ? "active" : ""
                              }`}
                              title={post.title}
                            >
                              <span className="opacity-70 text-[0.7rem]">📄</span>
                              <span className="truncate">{post.slug}.md</span>
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Table of Contents (for blog post page) */}
        {tableOfContents && tableOfContents.length > 0 && (
          <div className="mt-6 pt-4 border-t border-line">
            <h4 className="blog-nav-header mono">
              <span>TABLE OF CONTENTS</span>
            </h4>
            <ul className="space-y-1 pl-1 text-[0.78rem] mono">
              {tableOfContents.map((heading) => {
                const isActive = activeHeadingId === heading.id;
                return (
                  <li
                    key={heading.id}
                    style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}
                  >
                    <a
                      href={`#${heading.id}`}
                      className={`block py-1 px-1.5 rounded transition-colors truncate ${
                        isActive
                          ? "text-primary font-semibold bg-primary/10"
                          : "text-ink-muted hover:text-ink hover:underline"
                      }`}
                    >
                      {heading.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
