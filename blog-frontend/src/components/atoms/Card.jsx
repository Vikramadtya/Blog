import React from "react";
import Tag from "@/components/atoms/Tag";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import Icon from "@/components/atoms/Icon";
import { siteMetadata } from "../../../site.config.mjs";

const Card = ({
  title,
  description,
  tags,
  slug,
  date,
  likes,
  blogNumber,
  id,
  previewImageSrc,
}) => {
  const sourceUrl = siteMetadata.siteRepo 
    ? `${siteMetadata.siteRepo}/blob/main/blogs/${id}/blog.md`
    : null;
  return (
    <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900">
      {previewImageSrc && (
        <Image
          src={previewImageSrc}
          alt={title}
          width={400}
          height={250}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="aspect-video w-full object-cover"
        />
      )}

      <div className="flex flex-col justify-between p-5">
        {/* Blog Meta Header */}
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span className="italic">#{blogNumber}</span>
          <div className="flex items-center gap-1">
            <Icon kind="heart" className="h-4 w-4 text-red-500" />
            <span>{likes ?? 0}</span>
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
          <span>{dayjs(date).format("MMMM D, YYYY")}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
