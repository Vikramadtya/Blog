"use client";

import React, { useEffect, useState } from "react";

export default function NotesToc({ headings }) {
  const [activeSlug, setActiveSlug] = useState(headings[0]?.slug || "");

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings
        .map((h) => ({
          slug: h.slug,
          element: document.getElementById(h.slug),
        }))
        .filter((item) => item.element !== null);

      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const item = headingElements[i];
        if (item.element.offsetTop <= scrollPosition) {
          setActiveSlug(item.slug);
          return;
        }
      }

      if (headingElements.length > 0) {
        setActiveSlug(headingElements[0].slug);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <aside className="hidden lg:block w-44 xl:w-52 flex-shrink-0 sticky top-24 self-start pl-4 py-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3.5 flex items-center gap-1.5 select-none">
        <svg className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M2 3.75A.75.75 0 012.75 3h10.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H2.75A.75.75 0 012 8zm0 4.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
        ON THIS PAGE
      </div>
      <nav className="space-y-2">
        {headings.map((h, i) => {
          const isActive = activeSlug === h.slug;
          return (
            <a
              key={i}
              href={`#${h.slug}`}
              onClick={() => setActiveSlug(h.slug)}
              className={`block text-sm transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              } ${h.level === 3 ? "pl-3 text-xs" : ""}`}
            >
              {h.heading}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
