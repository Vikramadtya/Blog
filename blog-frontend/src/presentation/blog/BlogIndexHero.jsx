import React from "react";
import { siteMetadata } from "../../../site.config.mjs";

export default function BlogIndexHero({
  totalPosts = 0,
  totalSeries = 0,
  totalCategories = 0,
}) {
  const content = siteMetadata.content?.blogs || {};

  return (
    <section className="blog-hero">
      <p className="eyebrow">
        <span className="mono">~/blog</span>
      </p>
      <h1>Notes from the lab.</h1>
      <p className="lead">
        {content.description ||
          "A living archive of long-form walkthroughs on systems, architecture, and engineering — cross-linked, illustrated, written to be the reference I wish I had."}
      </p>
      <p className="blog-hero-stats mono">
        <span>{totalPosts} posts</span>
        {totalSeries > 0 && <span> &middot; {totalSeries} series</span>}
        <span> &middot; {totalCategories} categories</span>
      </p>
    </section>
  );
}
