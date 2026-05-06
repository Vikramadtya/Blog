"use client";
import Icon from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";

const LikeCount = ({ likes, hasLiked, onLike, disabled }) => {
  return (
    <button
      onClick={onLike}
      disabled={disabled || hasLiked}
      className={cn(
        "group flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-80",
        hasLiked ? "cursor-default" : "cursor-pointer hover:opacity-80"
      )}
      title={hasLiked ? "You liked this!" : "Like this post"}
    >
      <Icon 
        kind="heart" 
        className={cn(
          "h-5 w-5 transition-colors", 
          hasLiked ? "fill-rose-500 text-rose-500" : "text-rose-500 group-hover:fill-rose-200"
        )} 
      />
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {likes}
      </span>
    </button>
  );
};

export default LikeCount;
