import React from "react";
import Tag from "../../app/tags/components/atoms/tag";
import Link from "next/link";
import dayjs from "dayjs";
import Icon from "../../components/atom/icon";

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
  return (
    <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900">
      {previewImageSrc && (
        <img
          src={previewImageSrc}
          alt={title}
          className="w-full object-cover"
        />
      )}

      <div className="flex flex-col justify-between p-5">
        {/* Blog Meta Header */}
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span className="italic">#{blogNumber}</span>
          <div className="flex items-center gap-1">
            <Icon kind="heart" className="h-4 w-4 text-red-500" />
            <span>{likes}</span>
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
            <Tag key={tag.id} text={tag.name} color={tag.color} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground dark:border-neutral-700">
          <Link
            href={`https://github.com/Vikramadtya/Blog-Scratch/blob/main/blogs/${id}/blog.md`}
            passHref
          >
            <span className="hover:underline">View Source</span>
          </Link>
          <span>{dayjs(date).format("MMMM D, YYYY")}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
