import React from "react";
import Link from "next/link";

export default function SeriesNavigation({ parent, seriesParts, currentSlug }) {
  if (!parent) return null;

  // Combine parent and seriesParts into an ordered list
  const allParts = [
    { ...parent, isParent: true },
    ...seriesParts.sort((a, b) => a.seriesOrder - b.seriesOrder),
  ];

  const currentIndex = allParts.findIndex((p) => p.slug === currentSlug);

  return (
    <div className="my-10 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-primary/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-primary">
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
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
            {parent.title}
          </h3>
        </div>
        <div className="text-xs font-mono font-medium text-muted-foreground">
          {currentIndex + 1} / {allParts.length} Parts
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
                  ? "bg-primary/10 border-primary/30 font-semibold text-primary"
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>
                  {idx + 1}. {part.title}
                </span>
                {isActive && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-xs shadow-sm">
                    ✓
                  </span>
                )}
              </div>
              {isActive && part.summary && (
                <p className="mt-2 text-sm text-muted-foreground/80 pl-4 border-l-2 border-border/50">
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
