import Icon from "./icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import ClickableStickyBarElement from "./clickableStickyBarElement";

const StickyBar = ({ blogId }) => {
  return (
    <>
      <div className="sticky bottom-10 z-20 hidden w-full pb-20 pt-20 md:block">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center justify-evenly space-x-5 rounded-l-full rounded-r-full border border-primary/50 bg-muted pl-3 pr-3 pt-2  shadow-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <ClickableStickyBarElement
                    blogId={blogId}
                    kind="heart"
                    className={"h-6 w-6"}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Icon kind="comment" className={"h-6 w-6"} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comments</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Icon kind="tableOfContent" className={"h-6 w-6"} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Table of content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Icon kind="share" className={"h-6 w-6"} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default StickyBar;
