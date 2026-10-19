"use client";
import dayjs from "dayjs";
import React from "react";

import Icon from "@/presentation/ui/Icon";
import ViewCount from "@/presentation/blog/ViewCount";
import LikeCount from "@/presentation/blog/LikeCount";
import { useMetrics } from "@/presentation/providers/BlogMetricsProvider";
import { siteMetadata } from "../../../site.config.mjs";

const BlogHero = ({ title, tags = [], date, readingTime }) => {
  const {
    likes: currentLikes,
    views: currentViews,
    hasLiked,
    toggleLike,
    isLiking,
  } = useMetrics();

  return (
    <div className="flex flex-col items-center justify-center space-y-5">
      <h1 className="font-serif px-4 text-center text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl max-w-4xl">
        {title}
      </h1>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <Icon kind="tag" className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
          {tags.map((tag, i) => (
            <div
              key={tag.id || tag || i}
              className="rounded-md bg-muted px-2.5 py-0.5 text-xs font-mono font-medium text-foreground border border-border"
            >
              #{tag.name || tag}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            siteMetadata.authorAvatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              siteMetadata.author
            )}&background=0a8f6a&color=fff`
          }
          alt={siteMetadata.author}
          className="h-8 w-8 rounded-full object-cover shadow-sm ring-2 ring-primary/20"
        />
        <span className="text-sm font-semibold text-foreground font-sans">
          {siteMetadata.author}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-muted-foreground pt-1">
        {date && (
          <div className="flex items-center space-x-1.5">
            <Icon kind="calendar" className="h-3.5 w-3.5" />
            <span>{dayjs(date).format("MMMM D, YYYY")}</span>
          </div>
        )}
        {readingTime && (
          <div className="flex items-center space-x-1.5">
            <Icon kind="clock" className="h-3.5 w-3.5" />
            <span>{readingTime}</span>
          </div>
        )}
        <ViewCount views={currentViews} />
        <LikeCount
          likes={currentLikes}
          hasLiked={hasLiked}
          onLike={toggleLike}
          disabled={isLiking}
        />
      </div>
    </div>
  );
};

export default BlogHero;
