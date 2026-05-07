"use client";
import React from "react";
import Tag from "@/components/atoms/Tag";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import Icon from "@/components/atoms/Icon";
import { siteMetadata } from "../../../site.config.mjs";
import { useBlogMetrics } from "@/hooks/useBlogMetrics";

const Card = (props) => {
  const blog = props.blog || props;
  const {
    title,
    description,
    tags,
    slug,
    date,
    createdAt,
    likes: initialLikes,
    views: initialViews,
    blogNumber,
    id,
    previewImageSrc,
    readingTime,
  } = blog;

  const displayDate = date || createdAt;
  const { likes, views } = useBlogMetrics(id, initialLikes, initialViews, false);
  const sourceUrl = siteMetadata.siteRepo 
    ? `${siteMetadata.siteRepo}/blob/main/blog-frontend/blog-datastore/blogs/${slug}.md`
    : null;
  return (
    <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900">
      {previewImageSrc && (
        <div className="relative aspect-video w-full overflow-hidden">
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
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span className="italic">#{blogNumber}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Icon kind="heart" className="h-4 w-4 text-rose-500" />
              <span>{likes ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon kind="eye" className="h-4 w-4 text-indigo-500" />
              <span>{views ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Title + Description */}
        <Link href={`/blogs/${slug}`} passHref>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 hover:underline dark:text-white">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {description}
            </p>
          </div>
        </Link>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag.id} text={tag.name} color={tag.color} id={tag.id} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground dark:border-neutral-700">
          {sourceUrl ? (
            <Link href={sourceUrl} passHref>
              <span className="hover:underline">View Source</span>
            </Link>
          ) : (
            <span />
          )}
          {readingTime && (
            <div className="flex items-center gap-1">
              <Icon kind="clock" className="h-3 w-3" />
              <span className="text-xs">{readingTime}</span>
            </div>
          )}
          <span>{dayjs(displayDate).format("MMM D, YYYY")}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
