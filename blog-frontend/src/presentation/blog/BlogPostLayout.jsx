"use client";

import React, { useState } from "react";
import BlogExplorerSidebar from "@/presentation/blog/BlogExplorerSidebar";

export default function BlogPostLayout({
  categories = [],
  tableOfContents = [],
  currentSlug = "",
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`blog-post-layout ${collapsed ? "sidebar-collapsed" : ""}`}
    >
      <BlogExplorerSidebar
        categories={categories}
        tableOfContents={tableOfContents}
        currentSlug={currentSlug}
        initialCollapsed={collapsed}
        onToggleCollapse={setCollapsed}
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
