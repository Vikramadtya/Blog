"use client";
import Icon from "@/presentation/ui/Icon";
import { siteMetadata as siteConfig } from "../../../site.config.mjs";
import React from "react";
import LikeButton from "@/presentation/blog/LikeButton";

const ShareButton = React.forwardRef(({ blogSlug, className, ...props }, ref) => {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = `${siteConfig.siteUrl}/blogs/${blogSlug}`;

  const handleCopy = async (e) => {
    if (props.onClick) props.onClick(e);
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } finally {
          textArea.remove();
        }
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert(`Could not copy to clipboard URL : ${shareUrl}`);
    }
  };

  return (
    <button
      {...props}
      ref={ref}
      id="share-button"
      onClick={handleCopy}
      className={`flex items-center justify-center rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${className || ""}`}
      aria-label="Share post"
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-6 w-6 text-green-500"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <Icon kind="share" className="h-6 w-6" />
      )}
    </button>
  );
});

ShareButton.displayName = "ShareButton";

export default ShareButton;
