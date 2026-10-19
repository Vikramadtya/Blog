"use client";

import Icon from "@/presentation/ui/Icon";
import useSound from "use-sound";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/ui/DropdownMenu";
import Link from "next/link";
import * as React from "react";
import { TooltipContent, TooltipTrigger } from "@/presentation/ui/Tooltip";
import ShareButton from "@/presentation/blog/ShareButton";

const TableOfContent = React.forwardRef(({ tableOfContent }, ref) => {
  const [ThemeSound] = useSound("/sounds/switch-on.mp3");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div ref={ref}>
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) ThemeSound();
            setMenuOpen(open);
          }}
        >
          <DropdownMenuTrigger className="inline-flex items-center">
            <Icon kind="tableOfContent" className={"h-6 w-6"} />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="mb-5 mt-5 max-h-[70vh] overflow-y-auto min-w-[240px]"
            data-side="top"
          >
            <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground select-none border-b border-border/50 mb-1">
              CONTENTS
            </div>
            {(tableOfContent || []).map((menuItem, idx) => {
              return (
                <DropdownMenuItem key={`${menuItem.slug}-${idx}`}>
                  <div
                    className="w-full cursor-pointer flex items-center"
                    onClick={() => {
                      const element = document.getElementById(menuItem.slug);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    style={{ paddingLeft: `${(menuItem.level - 1) * 12}px` }}
                  >
                    <span
                      className="w-[2px] h-[13px] rounded-full mr-2.5 flex-shrink-0 bg-[#4596bd]"
                      aria-hidden="true"
                    />
                    <span
                      className={`pr-2 leading-snug ${menuItem.level === 1 ? "font-semibold text-foreground" : "text-sm text-muted-foreground"}`}
                    >
                      {menuItem.heading}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
});
TableOfContent.displayName = "TableOfContent";

export default TableOfContent;
