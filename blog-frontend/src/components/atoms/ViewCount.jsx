"use client";
import Icon from "@/components/atoms/Icon";

const ViewCount = ({ views }) => {
  return (
    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200" title="Views">
      <Icon kind="eye" className="h-5 w-5 text-blue-500" />
      <span className="text-sm font-semibold">{views}</span>
    </div>
  );
};

export default ViewCount;
