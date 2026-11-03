import Link from "next/link";
import ContentGrid from "@/presentation/ui/ContentGrid";
import React from "react";

const FeaturedSection = ({ title, eyebrow, href, blogs, blogIdToMetadata }) => (
  <section className="w-full">
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
        >
          View all
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      )}
    </div>
    <ContentGrid blogs={blogs} blogIdToMetadata={blogIdToMetadata} />
  </section>
);

export default FeaturedSection;
