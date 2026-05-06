"use client";
import Icon from "@/components/atoms/Icon";
import { siteMetadata as siteConfig } from "../../../site.config.mjs";
import React from "react";
import LikeButton from "@/components/atoms/LikeButton";

const ShareButton = React.forwardRef(({ blogSlug }, ref) => {
  const shareUrl = `${siteConfig.siteUrl}/blogs/${blogSlug}`;

  return (
    <div
      ref={ref}
      id="share-button"
      onClick={() => {
        try {
          navigator.clipboard.writeText(shareUrl).then(() => {});
        } catch (e) {
          alert(`Could not copy to clipboard URL : ${shareUrl}`);
        }
      }}
    >
      <Icon kind="share" className={"h-6 w-6"} />
    </div>
  );
});

ShareButton.displayName = "ShareButton";

export default ShareButton;
