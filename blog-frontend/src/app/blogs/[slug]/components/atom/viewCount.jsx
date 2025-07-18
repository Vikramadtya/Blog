"use client";
import { useEffect, useState } from "react";
import Icon from "../../../../../components/atom/icon";
import { addView, getMetadata } from "../../../../../services/apiServices";

const ViewCount = ({ id, views }) => {
  const [currentViews, setCurrentViews] = useState(views);

  useEffect(() => {
    addView(id);
    getMetadata(id)
      .then((res) => res.json())
      .then((data) => {
        setCurrentViews(data[0]?.views ?? views);
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
