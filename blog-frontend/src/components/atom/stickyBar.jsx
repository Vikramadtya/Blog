import Icon from "./icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import LikeButton from "./likeButton";
import Link from "next/link";
import ShareButton from "./shareButton";
import ShareBar from "./shareBar";

const StickyBar = ({ blogId, blogSlug }) => {
  return (
    <>
      <div className="sticky bottom-10 z-20 hidden w-full pb-20 pt-20 md:block">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center justify-evenly space-x-5 rounded-l-full rounded-r-full border border-primary/50 bg-muted pl-3 pr-3 pt-2  shadow-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <LikeButton
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
                  <Link href="#comments">
                    {" "}
                    <Icon kind="comment" className={"h-6 w-6"} />
                  </Link>
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
                  <ShareButton blogSlug={blogSlug} />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col items-center">
                    <ShareBar className="mt-5" />
                    <p className="text-sm text-black">
                      or simply click to copy url
                    </p>
                  </div>
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
