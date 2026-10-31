"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const hrefFor = (bookSlug, node) => `/notes/${bookSlug}/${node.path.join("/")}`;

// Files first, then folders, keeping the authored order inside each group
const sortNodes = (nodes = []) =>
  [...nodes].sort((a, b) =>
    a.type === b.type ? 0 : a.type === "file" ? -1 : 1,
  );

/** Keeps only files whose title matches `query`, plus the folders that lead to them. */
function filterTree(nodes, query) {
  if (!query) return nodes;
  const q = query.toLowerCase();
  return nodes.flatMap((node) => {
    if (node.type === "file")
      return node.title.toLowerCase().includes(q) ? [node] : [];
    const children = filterTree(node.children || [], query);
    return children.length ? [{ ...node, children }] : [];
  });
}

const containsHref = (node, bookSlug, pathname) =>
  node.type === "file"
    ? hrefFor(bookSlug, node) === pathname
    : (node.children || []).some((child) =>
        containsHref(child, bookSlug, pathname),
      );

function Chevron({ open }) {
  return (
    <svg
      className={cn(
        "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
        open && "rotate-90",
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function NoteLink({ node, bookSlug, pathname }) {
  const href = hrefFor(bookSlug, node);
  const active = pathname === href;
  const ref = useRef(null);

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <Link
      ref={ref}
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative block rounded-md py-1.5 pl-3 pr-2 text-[0.9rem] leading-snug transition-colors",
        active
          ? "bg-accent font-semibold text-primary before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {node.title}
    </Link>
  );
}

function Folder({ node, bookSlug, pathname, level, forceOpen }) {
  const hasActive = useMemo(
    () => containsHref(node, bookSlug, pathname),
    [node, bookSlug, pathname],
  );
  const [open, setOpen] = useState(level === 0 || hasActive);

  // Navigating into a folder (search result, prev/next link) should reveal the page
  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  const expanded = open || forceOpen;

  return (
    <div className={level === 0 ? "mt-5" : "mt-1"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted",
          level === 0
            ? "text-[0.7rem] font-bold uppercase tracking-[0.12em] text-foreground"
            : "text-[0.9rem] font-semibold text-foreground",
        )}
      >
        <Chevron open={expanded} />
        <span className="truncate">{node.title}</span>
      </button>
      {expanded && (
        <div className="ml-[0.9rem] mt-0.5 space-y-0.5 border-l border-border pl-2">
          <Nodes
            nodes={node.children}
            bookSlug={bookSlug}
            pathname={pathname}
            level={level + 1}
            forceOpen={forceOpen}
          />
        </div>
      )}
    </div>
  );
}

function Nodes({ nodes, bookSlug, pathname, level, forceOpen }) {
  return sortNodes(nodes).map((node, i) =>
    node.type === "file" ? (
      <NoteLink
        key={`${node.title}-${i}`}
        node={node}
        bookSlug={bookSlug}
        pathname={pathname}
      />
    ) : (
      <Folder
        key={`${node.title}-${i}`}
        node={node}
        bookSlug={bookSlug}
        pathname={pathname}
        level={level}
        forceOpen={forceOpen}
      />
    ),
  );
}

function NavContent({ tree, bookSlug, allBooks, autoFocusSearch = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () => filterTree(tree || [], query.trim()),
    [tree, query],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-3">
        <div className="relative">
          <select
            value={bookSlug}
            onChange={(e) => router.push(`/notes/${e.target.value}`)}
            aria-label="Choose a book"
            className="w-full appearance-none rounded-lg border border-border bg-card px-3.5 py-2.5 pr-9 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {allBooks?.map((book) => (
              <option key={book.slug} value={book.slug}>
                {book.title}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
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
        </div>

        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter notes…"
            aria-label="Filter notes in this book"
            autoFocus={autoFocusSearch}
            className="w-full rounded-lg border border-border bg-transparent py-2 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <nav
        aria-label="Notes"
        className="mt-2 min-h-0 flex-1 overflow-y-auto pb-8"
      >
        {visible.length ? (
          <Nodes
            nodes={visible}
            bookSlug={bookSlug}
            pathname={pathname}
            level={0}
            forceOpen={Boolean(query.trim())}
          />
        ) : (
          <p className="px-2 py-6 text-sm text-muted-foreground">
            No notes match “{query}”.
          </p>
        )}
      </nav>
    </div>
  );
}

export default function NotesSidebar({ tree, bookSlug, allBooks }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const bookTitle =
    allBooks?.find((b) => b.slug === bookSlug)?.title ?? bookSlug;

  // Close the drawer after navigating
  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <aside className="hidden w-64 shrink-0 self-start border-r border-border py-6 pr-5 lg:sticky lg:top-[4.1rem] lg:block lg:h-[calc(100vh-4.1rem)]">
        <NavContent tree={tree} bookSlug={bookSlug} allBooks={allBooks} />
      </aside>

      {/* Mobile: slim bar that opens the same navigation as a drawer */}
      <div className="sticky top-[4.1rem] z-30 -mx-4 border-b border-border bg-background/90 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2 text-left text-sm shadow-sm transition active:scale-[0.99]"
        >
          <svg
            className="h-4 w-4 shrink-0 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h10M4 18h16"
            />
          </svg>
          <span className="min-w-0 flex-1 truncate font-semibold text-foreground">
            {bookTitle}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Browse
          </span>
        </button>
      </div>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Browse notes"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(21rem,88vw)] flex-col bg-background p-4 shadow-2xl duration-200 animate-in slide-in-from-left">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-base font-bold text-foreground">
                Browse notes
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <NavContent tree={tree} bookSlug={bookSlug} allBooks={allBooks} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
