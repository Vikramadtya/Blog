import React from "react";
import Link from "next/link";

export default function BlogReadingNavigation({ prevPost, nextPost }) {
  if (!prevPost && !nextPost) return null;

  return (
    <nav className="post-nav" aria-label="Reading navigation">
      {prevPost ? (
        <Link
          href={`/blogs/${prevPost.permalink || prevPost.slug}`}
          className="post-nav-card prev group"
        >
          <span className="post-nav-dir mono">&larr; Previous</span>
          <span className="post-nav-title group-hover:text-primary transition-colors">
            {prevPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextPost ? (
        <Link
          href={`/blogs/${nextPost.permalink || nextPost.slug}`}
          className="post-nav-card next group"
        >
          <span className="post-nav-dir mono">Next &rarr;</span>
          <span className="post-nav-title group-hover:text-primary transition-colors">
            {nextPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
