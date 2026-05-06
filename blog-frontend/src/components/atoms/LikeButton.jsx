"use client";

import Icon from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";
import React from "react";

const LikeButton = React.forwardRef(
  ({ blogId, kind, className, onLike, hasLiked, disabled }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        onClick={onLike}
        className={cn(
          "transition-transform active:scale-90 disabled:opacity-50",
          className,
        )}
      >
        <Icon 
          kind={kind} 
          className={cn(
            className,
            hasLiked ? "fill-rose-500 text-rose-500" : "text-gray-500 hover:text-rose-400"
          )} 
        />
      </button>
    );
  },
);

LikeButton.displayName = "LikeButton";

export default LikeButton;
