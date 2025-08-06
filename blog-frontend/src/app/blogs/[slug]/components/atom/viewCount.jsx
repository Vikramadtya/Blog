"use client";
import { useEffect, useState } from "react";
import Icon from "../../../../../components/atom/icon";
import {
  incrementBlogLikesOrViewsById,
  METADATA_TYPE,
} from "../../../../../services/apiServices";
import { logger } from "../../../../api/lib/api-utils";

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
