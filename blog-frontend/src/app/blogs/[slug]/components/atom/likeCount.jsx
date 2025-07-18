"use client";
import { useEffect, useState } from "react";
import Icon from "../../../../../components/atom/icon";
import { getMetadata } from "../../../../../services/apiServices";

const LikeCount = ({ id, likes }) => {
  const [currentLikes, setCurrentLikes] = useState(likes);

  useEffect(() => {
    getMetadata(id)
      .then((res) => res.json())
      .then((data) => {
        setCurrentLikes(data[0]?.likes ?? likes);
      });
  }, [id, likes]);

  return (
    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200">
      <Icon kind="heart" className="h-5 w-5 text-rose-500" />
      <span className="text-sm font-medium">{currentLikes}</span>
    </div>
  );
};

export default LikeCount;
