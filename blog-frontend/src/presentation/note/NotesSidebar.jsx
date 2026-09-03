"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function TreeNode({ node, bookSlug, level = 0 }) {
  const pathname = usePathname();

  if (node.type === "file") {
    const href = `/notes/${bookSlug}/${node.path.join("/")}`;
    const isActive = pathname === href;
    
    // In the image, root files (About) are bold, child files are lighter
    const isRoot = level === 0;
    
    return (
      <div className={`${isRoot ? "mt-6 mb-2" : "my-2"}`}>
        <Link 
          href={href}
          className={`block text-sm transition-colors ${
            isActive 
              ? "text-blue-600 font-semibold dark:text-blue-400" 
              : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          } ${isRoot ? "font-semibold" : ""}`}
        >
          {node.title}
        </Link>
      </div>
    );
  }

  // Directory node (renders as an all-caps section header)
  return (
    <div className="mt-8 mb-2">
      <div className="text-xs font-bold tracking-wider text-gray-900 dark:text-gray-300 uppercase mb-3">
        {node.title}
      </div>
      
      <div className="space-y-1">
        {node.children.map((child, idx) => (
          <TreeNode key={idx} node={child} bookSlug={bookSlug} level={level + 1} />
        ))}
      </div>
    </div>
  );
}

export default function NotesSidebar({ tree, bookSlug, allBooks }) {
  const router = useRouter();

  const handleBookChange = (e) => {
    const newSlug = e.target.value;
    router.push(`/notes/${newSlug}`);
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 lg:border-r border-gray-100 dark:border-zinc-800 h-auto lg:h-[calc(100vh-4rem)] lg:sticky top-16 overflow-y-auto py-6 pr-6 hidden lg:block">
      
      {/* Dropdown for Book Selection */}
      <div className="mb-8">
        <div className="relative">
          <select
            value={bookSlug}
            onChange={handleBookChange}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200"
          >
            {allBooks?.map((book) => (
              <option key={book.slug} value={book.slug}>
                {book.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      <nav>
        {tree.map((node, idx) => (
          <TreeNode key={idx} node={node} bookSlug={bookSlug} level={0} />
        ))}
      </nav>
    </aside>
  );
}
