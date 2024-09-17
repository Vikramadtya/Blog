import dayjs from "dayjs";
import React from "react";

import Tag from "../atom/tag";
import Icon from "../atom/icon";
import ViewCount from "../atom/viewCount";
import LikeCount from "../atom/likeCount";

const BlogHero = ({ blogId, title, tags, date, views, likes }) => {
  const tagsComponent = tags.map((tag) => (
    <Tag key={tag.id} text={tag.name} color={tag.color} />
  ));

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="px-4 text-center text-2xl font-bold dark:text-gray-50 md:text-4xl">
          {title}
        </h1>

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-2 ">
            <Icon kind="tag" className={"h-6 w-6"} />
            {...tagsComponent}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon kind="calendar" className={"h-6 w-6"} />
          <p className="text-xs font-semibold md:text-sm">
            {dayjs(date).format("MMMM D, YYYY")}
          </p>
        </div>

        <div className="flex items-center space-x-2 space-y-0.5 text-muted-foreground">
          <ViewCount id={blogId} views={views} />
          <LikeCount id={blogId} likes={likes} />
        </div>
      </div>
    </>
  );
};

export default BlogHero;
