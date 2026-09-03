"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/ui/Tooltip';

import LikeButton from "@/presentation/blog/LikeButton";
import ShareButton from "@/presentation/blog/ShareButton";
import ShareBar from "@/presentation/blog/ShareBar";
import ScrollToComment from "@/presentation/blog/ScrollToComment";
import TableOfContent from "@/presentation/blog/TableOfContent";
import content from "../../../config/content.json";
import { useMetrics } from "@/presentation/providers/BlogMetricsProvider";

import { siteMetadata } from "../../../site.config.mjs";

const StickyBar = ({ blogSlug, title, tableOfContent }) => {
  const { toggleLike, hasLiked, isLiking } = useMetrics();
  const shareUrl = `${siteMetadata.siteUrl}/blogs/${blogSlug}`;

  return (
    <div className="sticky bottom-10 z-30 hidden w-full items-center justify-center md:flex">
      <div className="bg-surface dark:bg-surfaceDark/70 flex items-center gap-4 rounded-full border border-primary/30 px-6 py-3 shadow-md backdrop-blur-md transition-all">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <LikeButton
                onLike={toggleLike}
                hasLiked={hasLiked}
                disabled={isLiking}
                kind="heart"
                className="h-6 w-6"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{content.shared.like}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ScrollToComment />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{content.shared.comments}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TableOfContent tableOfContent={tableOfContent} />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{content.shared.toc}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ShareButton blogSlug={blogSlug} />
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col items-center gap-2">
                <ShareBar className="mt-1" shareUrl={shareUrl} title={title} />
                <button 
                  onClick={() => {
                    const copyText = async () => {
                      if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(shareUrl);
                      } else {
                        const textArea = document.createElement("textarea");
                        textArea.value = shareUrl;
                        textArea.style.position = "absolute";
                        textArea.style.left = "-999999px";
                        document.body.prepend(textArea);
                        textArea.select();
                        try { document.execCommand('copy'); }
                        finally { textArea.remove(); }
                      }
                    };
                    copyText().then(() => alert("Copied to clipboard!")).catch(() => alert("Failed to copy"));
                  }}
                  className="mb-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {content.shared.copyUrl}
                </button>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default StickyBar;
