"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import ShareBar from "./ShareBar";
import ScrollToComment from "./ScrollToComment";
import TableOfContent from "./TableOfContent";
import content from "../../../config/content.json";
import { useMetrics } from "@/components/providers/BlogMetricsProvider";

const StickyBar = ({ blogSlug, tableOfContent }) => {
  const { toggleLike, hasLiked, isLiking } = useMetrics();

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
                <ShareBar className="mt-1" />
                <p className="text-xs text-muted-foreground">
                  {content.shared.copyUrl}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default StickyBar;
