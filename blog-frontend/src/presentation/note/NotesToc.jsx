"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SCROLL_OFFSET = 130;

function scrollToHeading(slug) {
  const el = document.getElementById(slug);
  if (!el) return;
  window.scrollTo({
    top:
      el.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET + 40,
    behavior: "smooth",
  });
  window.history.pushState(null, "", `#${slug}`);
}

function useActiveHeading(headings) {
  const [active, setActive] = useState(headings?.[0]?.slug || "");

  useEffect(() => {
    if (!headings?.length) return;
    const update = () => {
      let current = headings[0].slug;
      for (const { slug } of headings) {
        const el = document.getElementById(slug);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= SCROLL_OFFSET) current = slug;
        else break;
      }
      setActive(current);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [headings]);

  return [active, setActive];
}

/** Desktop: sticky "On this page" rail with scroll-spy. */
export default function NotesToc({ headings }) {
  const [active, setActive] = useActiveHeading(headings);
  if (!headings?.length) return null;

  return (
    <aside
      className="sticky top-24 hidden w-52 shrink-0 self-start pl-2 xl:block xl:w-60"
      aria-label="On this page"
    >
      <p className="mb-3 select-none text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        On this page
      </p>
      <nav className="relative max-h-[calc(100vh-8rem)] space-y-0.5 overflow-y-auto border-l border-border">
        {headings.map((h) => {
          const isActive = active === h.slug;
          return (
            <a
              key={h.slug}
              href={`#${h.slug}`}
              onClick={(e) => {
                e.preventDefault();
                setActive(h.slug);
                scrollToHeading(h.slug);
              }}
              className={cn(
                "-ml-px block border-l-2 py-1 pr-2 text-[0.84rem] leading-snug transition-colors",
                h.level === 3 ? "pl-6" : "pl-3.5",
                isActive
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {h.heading}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

/** Mobile / tablet: collapsible outline above the article. */
export function MobileToc({ headings }) {
  const [active, setActive] = useActiveHeading(headings);
  if (!headings?.length) return null;
  const current = headings.find((h) => h.slug === active) ?? headings[0];

  return (
    <details className="group mb-6 rounded-xl border border-border bg-card xl:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 text-sm [&::-webkit-details-marker]:hidden">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          On this page
        </span>
        <span className="min-w-0 flex-1 truncate text-right font-medium text-foreground">
          {current.heading}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <nav className="max-h-72 space-y-0.5 overflow-y-auto border-t border-border px-2 py-2">
        {headings.map((h) => (
          <a
            key={h.slug}
            href={`#${h.slug}`}
            onClick={(e) => {
              e.preventDefault();
              e.currentTarget.closest("details").open = false;
              scrollToHeading(h.slug);
            }}
            className={cn(
              "block rounded-md py-2 pr-2 text-sm leading-snug transition-colors hover:bg-muted",
              h.level === 3
                ? "pl-7 text-muted-foreground"
                : "pl-3 font-medium text-foreground",
              active === h.slug && "text-primary",
            )}
          >
            {h.heading}
          </a>
        ))}
      </nav>
    </details>
  );
}
