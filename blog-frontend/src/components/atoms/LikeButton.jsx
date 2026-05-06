"use client";

import Icon from "@/components/atoms/Icon";
import { incrementBlogLikesOrViewsById } from "@/lib/client/api";
import { METADATA_TYPE } from "@/lib/constants";
import React from "react";

const LikeButton = React.forwardRef(
  ({ blogId, kind, className, handler }, ref) => {
    return (
      <div
        ref={ref}
        onClick={() => {
          incrementBlogLikesOrViewsById(blogId, METADATA_TYPE.likes).then(
            (response) => {},
          );
        }}
      >
        <Icon kind={kind} className={className} />
      </div>
    );
  },
);

LikeButton.displayName = "LikeButton";

export default LikeButton;
