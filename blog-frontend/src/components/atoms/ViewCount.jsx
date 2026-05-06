"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/atoms/Icon";
import { incrementBlogLikesOrViewsById } from "@/lib/client/api";
import { METADATA_TYPE } from "@/lib/constants";

const ViewCount = ({ id, views }) => {
  const [currentViews, setCurrentViews] = useState(views);

  useEffect(() => {
    incrementBlogLikesOrViewsById(id, METADATA_TYPE.views).then((response) => {
      setCurrentViews(response.data.views ?? views);
    });
  }, [id, views]);

  return (
    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
      <Icon kind="eye" className="h-5 w-5 text-blue-500" />
      <span className="text-sm font-medium">{currentViews}</span>
    </div>
  );
};

export default ViewCount;
