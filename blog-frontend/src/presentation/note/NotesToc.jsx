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

      if (headingElements.length === 0) return;

      let currentSlug = headingElements[0].slug;
      for (const item of headingElements) {
        const rect = item.element.getBoundingClientRect();
        if (rect.top <= 140) {
          currentSlug = item.slug;
        } else {
          break;
        }
      }
      setActiveSlug(currentSlug);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  return (
    <aside className="hidden lg:block w-48 xl:w-60 flex-shrink-0 sticky top-24 self-start pl-4 py-1 border-l-2 border-gray-200/80 dark:border-zinc-800">
      <div className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-3 select-none">
        CONTENTS
      </div>
      <nav className="space-y-1.5">
        {headings.map((h, i) => {
          const isActive = activeSlug === h.slug;
          return (
            <a
              key={i}
              href={`#${h.slug}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSlug(h.slug);
                const el = document.getElementById(h.slug);
                if (el) {
                  const yOffset = -90;
                  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                  window.scrollTo({ top: y, behavior: "smooth" });
                  window.history.pushState(null, "", `#${h.slug}`);
                }
              }}
              className={`group flex items-start text-sm transition-colors ${
                h.level === 3 ? "pl-4" : ""
              } ${
                isActive
                  ? "text-[#4596bd] dark:text-[#58a6cf] font-bold"
                  : "text-gray-800 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white font-normal"
              }`}
            >
              <span
                className={`w-[2px] h-[14px] rounded-full mr-2.5 flex-shrink-0 mt-1 transition-colors ${
                  isActive
                    ? "bg-[#ec3882]"
                    : "bg-[#4596bd] group-hover:bg-[#34789b]"
                }`}
                aria-hidden="true"
              />
              <span className="leading-snug">{h.heading}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
