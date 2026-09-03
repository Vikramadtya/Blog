import React from 'react';
import Link from 'next/link';

export default function SeriesNavigation({ parent, seriesParts, currentSlug }) {
  if (!parent) return null;
  
  // Combine parent and seriesParts into an ordered list
  const allParts = [
    { ...parent, isParent: true },
    ...seriesParts.sort((a, b) => a.seriesOrder - b.seriesOrder)
  ];
  
  const currentIndex = allParts.findIndex(p => p.slug === currentSlug);

  return (
    <div className="my-10 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="mb-2 inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M4 9h16"/>
              <path d="M4 15h16"/>
              <path d="M10 3L8 21"/>
              <path d="M16 3l-2 18"/>
            </svg>
            Series
          </span>
          <h3 className="text-lg font-bold tracking-tight text-foreground">{parent.title}</h3>
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {allParts.length} Parts
        </div>
      </div>
      
      <div className="space-y-2">
        {allParts.map((part, idx) => {
          const isActive = part.slug === currentSlug;
          return (
            <Link
              key={part.slug}
              href={`/blogs/${part.slug}`}
              className={`block rounded-lg px-4 py-3 transition-colors ${
                isActive 
                  ? "bg-muted font-medium text-foreground" 
                  : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{idx + 1}. {part.title}</span>
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
