"use client";
import dayjs from "dayjs";
import React from "react";

import Tag from '@/presentation/ui/Tag';
import Icon from '@/presentation/ui/Icon';
import ViewCount from '@/presentation/blog/ViewCount';
import LikeCount from '@/presentation/blog/LikeCount';
import { useMetrics } from "@/presentation/providers/BlogMetricsProvider";
import { siteMetadata } from "../../../site.config.mjs";

const BlogHero = ({ title, tags, date, readingTime }) => {
  const {
    likes: currentLikes,
    views: currentViews,
    hasLiked,
    toggleLike,
    isLiking,
  } = useMetrics();

  return (
    <div className="flex flex-col items-center justify-center space-y-5">
      <h1 className="px-4 text-center text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
        {title}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <Icon kind="tag" className="mr-1 h-4 w-4 text-muted-foreground" />
        {tags.map((tag, i) => (
          <div key={tag.id || tag || i} className="rounded-md bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
            {tag.name || tag}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
        <div className="flex items-center space-x-1.5">
          <Icon kind="calendar" className="h-4 w-4" />
          <span>{dayjs(date).format("MMMM D, YYYY")}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 pt-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
<img 
          src={siteMetadata.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(siteMetadata.author)}&background=4f46e5&color=fff`} 
          alt={siteMetadata.author} 
          className="h-8 w-8 rounded-full object-cover shadow-sm ring-2 ring-background" 
        />
        <span className="text-sm font-medium text-foreground">{siteMetadata.author}</span>
      </div>

      <div className="flex items-center justify-center space-x-4 pt-2 text-xs text-muted-foreground">
        {readingTime && (
          <div className="flex items-center space-x-1.5">
            <Icon kind="clock" className="h-4 w-4" />
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
