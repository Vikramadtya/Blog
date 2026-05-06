"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/atoms/Icon";
import { getBlogMetadataById } from "@/lib/client/api";

const LikeCount = ({ id, likes }) => {
  const [currentLikes, setCurrentLikes] = useState(likes);

  useEffect(() => {
    getBlogMetadataById(id).then((data) => {
      setCurrentLikes(data?.likes ?? likes);
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
