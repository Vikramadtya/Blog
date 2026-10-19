import React from "react";
import Link from "next/link";
import dayjs from "dayjs";

export default function BlogEditorialCard({
  post,
  partLabel = "",
  isSeriesParent = false,
  seriesCount = 0,
}) {
  const permalink =
    post.permalink ||
    (post.series ? `${post.series}/${post.slug}` : post.slug);

  const displayDate = post.createdAt
    ? dayjs(post.createdAt).format("MMMM YYYY")
    : "";

  const readingTime = post.readingTime || "5 min read";

  return (
    <Link href={`/blogs/${permalink}`} className="blog-card group">
      <div className="blog-card-path mono">
        <span>~/blogs/{permalink}.md</span>
      </div>

      <h3 className="group-hover:text-primary transition-colors">
        {post.title}
      </h3>

      <p>{post.summary || post.description || "Read this article..."}</p>

      <div className="blog-card-foot">
        <span className="blog-card-meta mono">
          {displayDate && `${displayDate} · `}
          {readingTime}
        </span>

        {isSeriesParent && (
          <span className="blog-card-part mono text-primary border-primary/40 bg-primary/5">
            Series · {seriesCount} {seriesCount === 1 ? "part" : "parts"}
          </span>
        )}

        {partLabel && !isSeriesParent && (
          <span className="blog-card-part mono text-primary">
            {partLabel}
          </span>
        )}

        {post.publish === false && (
          <span className="blog-card-part mono text-amber-600 border-amber-500/40 bg-amber-500/10 dark:text-amber-400">
            Draft
          </span>
        )}
      </div>
    </Link>
  );
}
