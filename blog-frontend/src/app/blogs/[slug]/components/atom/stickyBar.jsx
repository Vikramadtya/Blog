import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

import LikeButton from "./likeButton";
import ShareButton from "./shareButton";
import ShareBar from "./shareBar";
import ScrollToComment from "./scrollToComment";
import TableOfContent from "./tableOfContent";

const StickyBar = ({ blogId, blogSlug, tableOfContent }) => {
  return (
    <div className="sticky bottom-10 z-30 hidden w-full items-center justify-center md:flex">
      <div className="bg-surface dark:bg-surfaceDark/70 flex items-center gap-4 rounded-full border border-primary/30 px-6 py-3 shadow-md backdrop-blur-md transition-all">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <LikeButton blogId={blogId} kind="heart" className="h-6 w-6" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Like</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ScrollToComment />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Comments</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TableOfContent tableOfContent={tableOfContent} />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Table of Contents</p>
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
                  or click to copy URL
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
