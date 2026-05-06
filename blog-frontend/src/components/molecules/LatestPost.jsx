import React from "react";
import Tag from "../atoms/Tag";
import Link from "next/link";
import Image from "next/image";
import content from "../../../config/content.json";

const LatestPost = ({ title, description, tags, slug, previewImageSrc }) => {
  return (
    <section className="animate-fade-in-up w-full">
      <div className="flex flex-col-reverse items-start gap-12 md:flex-row md:items-center">
        {/* Text Column */}
        <div className="flex flex-col gap-6 md:w-1/2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold uppercase tracking-widest text-primary">
              {content.home.latestLabel}
            </h2>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700" />
          </div>

          <Link href={`/blogs/${slug}`}>
            <h1 className="text-3xl font-bold leading-tight tracking-tight transition-all md:text-5xl">
              {title}
            </h1>
          </Link>

          <p className="text-base text-muted-foreground md:text-lg">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag.id} text={tag.name} color={tag.color} />
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href={`/blogs/${slug}`}
            className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            {content.shared.readMore}
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>
        </div>

        {/* Image Column */}
        <div className="flex justify-center md:w-1/2">
          {previewImageSrc && (
            <Image
              src={previewImageSrc}
              alt={`Preview of ${title}`}
              width={600}
              height={400}
              priority
              className="max-h-96 rounded-xl object-cover shadow-lg"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestPost;
