import React from "react";
import Link from "next/link";

export default function SeriesNavigation({ parent, seriesParts, currentSlug }) {
  if (!parent) return null;

  // Combine parent and seriesParts into an ordered list
  const allParts = [
    { ...parent, isParent: true },
    ...seriesParts.sort(
      (a, b) => (Number(a.seriesOrder) || 0) - (Number(b.seriesOrder) || 0)
    ),
  ];

  const currentIndex = allParts.findIndex((p) => p.slug === currentSlug);

  return (
    <div className="my-8 rounded-xl border border-line bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-muted px-2.5 py-0.5 text-xs font-semibold text-primary mono">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 9h16" />
              <path d="M4 15h16" />
              <path d="M10 3L8 21" />
              <path d="M16 3l-2 18" />
            </svg>
            SERIES
          </span>
          <h3 className="text-xl font-bold tracking-tight text-ink font-display">
            {parent.title}
          </h3>
        </div>
        <div className="text-xs font-medium text-ink-muted mono">
          {currentIndex !== -1 ? `${currentIndex + 1} / ` : ""}
          {allParts.length} Parts
        </div>
      </div>

      <div className="space-y-1.5">
        {allParts.map((part, idx) => {
          const isActive = part.slug === currentSlug;
          return (
            <Link
              key={part.slug}
              href={`/blogs/${part.permalink || part.slug}`}
              className={`block rounded-lg px-4 py-2.5 transition-colors border ${
                isActive
                  ? "bg-primary/10 border-primary/40 font-semibold text-primary"
                  : "bg-transparent border-transparent text-ink-muted hover:border-line hover:bg-muted/40 hover:text-ink"
              }`}
            >
              <div className="flex items-center justify-between text-sm">
                <span>
                  <span className="mono mr-2 text-xs opacity-75">
                    {idx + 1}.
                  </span>
                  {part.title}
                </span>
                {isActive && (
                  <span className="text-xs font-bold text-primary mono">
                    CURRENT
                  </span>
                )}
              </div>
              {isActive && part.summary && (
                <p className="mt-1.5 text-xs text-ink-muted pl-4 border-l-2 border-primary/50">
                  {part.summary}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
