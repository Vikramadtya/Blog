"use client";
import React from "react";
import Tag from "@/presentation/ui/Tag";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import Icon from "@/presentation/ui/Icon";
import { siteMetadata } from "../../../site.config.mjs";
import { useBlogMetrics } from "@/hooks/useBlogMetrics";

const Card = (props) => {
  const blog = props.blog || props;
  const {
    title,
    description,
    tags,
    slug,
    permalink,
    isSeries,
    date,
    createdAt,
    likes: initialLikes,
    views: initialViews,
    blogNumber,
    id,
    previewImageSrc,
    readingTime,
  } = blog.permalink !== undefined
    ? blog
    : { ...blog, permalink: props.permalink, isSeries: props.isSeries };

  const resolvedPermalink = permalink || slug;
  const displayDate = date || createdAt;
  const { likes, views } = useBlogMetrics(
    id,
    initialLikes,
    initialViews,
    false,
  );
  const sourceUrl = siteMetadata.siteRepo
    ? `${siteMetadata.siteRepo}/blob/main/blog-datastore/blogs/${slug}.md`
    : null;

  return (
    <div className="card-premium group/card relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card/90 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      {previewImageSrc && (
        <div className="relative aspect-video w-full overflow-hidden border-b border-border">
          <Image
            src={previewImageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
          />
        </div>
      )}

      <div className="flex flex-col justify-between p-5">
        {/* Blog Meta Header */}
        <div className="mb-2.5 flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span className="font-semibold text-primary">#{blogNumber}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" title="Likes">
              <Icon kind="heart" className="h-3.5 w-3.5 text-rose-500" />
              <span>{likes ?? 0}</span>
            </div>
            <div className="flex items-center gap-1" title="Views">
              <Icon kind="eye" className="h-3.5 w-3.5 text-primary" />
              <span>{views ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Title + Description */}
        <Link href={`/blogs/${resolvedPermalink}`} passHref>
          <div className="group cursor-pointer">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {title}
              {isSeries && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 6h13" />
                    <path d="M8 12h13" />
                    <path d="M8 18h13" />
                    <path d="M3 6h.01" />
                    <path d="M3 12h.01" />
                    <path d="M3 18h.01" />
                  </svg>
                  Series
                </span>
              )}
              {blog.publish === false && (
                <span className="ml-2 inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-medium text-amber-700 dark:text-amber-400">
                  Draft
                </span>
              )}
            </h2>
            <p className="mt-2 line-clamp-3 font-sans text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </Link>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag.id} text={tag.name} color={tag.color} id={tag.id} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 font-mono text-xs text-muted-foreground">
          {sourceUrl ? (
            <Link href={sourceUrl} passHref>
              <span className="transition-colors hover:text-primary hover:underline">
                View Source
              </span>
            </Link>
          ) : (
            <span />
          )}
          {readingTime && (
            <div className="flex items-center gap-1">
              <Icon kind="clock" className="h-3 w-3" />
              <span>{readingTime}</span>
            </div>
          )}
          <span>{dayjs(displayDate).format("MMM D, YYYY")}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
