"use client";
import dayjs from "dayjs";
import React from "react";

import Tag from "../atoms/Tag";
import Icon from "../atoms/Icon";
import ViewCount from "../atoms/ViewCount";
import LikeCount from "../atoms/LikeCount";
import { useBlogMetrics } from "@/hooks/useBlogMetrics";

const BlogHero = ({ blogId, title, tags, date, views, likes }) => {
  const { likes: currentLikes, views: currentViews, hasLiked, toggleLike, isLiking } = useBlogMetrics(blogId, likes, views);

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <h1 className="px-4 text-center text-3xl font-extrabold tracking-tight dark:text-gray-50 md:text-5xl">
        {title}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Icon kind="tag" className="h-5 w-5 text-indigo-500" />
        {tags.map((tag) => (
          <Tag key={tag.id} text={tag.name} color={tag.color} id={tag.id} />
        ))}
      </div>

      <div className="flex items-center space-x-6 text-sm font-medium text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon kind="calendar" className="h-5 w-5" />
          <span>{dayjs(date).format("MMMM D, YYYY")}</span>
        </div>

        <div className="flex items-center space-x-4">
          <ViewCount views={currentViews} />
          <LikeCount 
            likes={currentLikes} 
            hasLiked={hasLiked} 
            onLike={toggleLike} 
            disabled={isLiking} 
          />
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
