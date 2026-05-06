"use client";

import Icon from "@/components/atoms/Icon";
import useSound from "use-sound";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/atoms/DropdownMenu";
import Link from "next/link";
import * as React from "react";
import { TooltipContent, TooltipTrigger } from "@/components/atoms/Tooltip";
import ShareButton from "@/components/atoms/ShareButton";

const TableOfContent = React.forwardRef(({ tableOfContent }, ref) => {
  const [ThemeSound] = useSound("/sounds/switch-on.mp3");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div ref={ref}>
        <DropdownMenu
          onOpenChange={() => {
            ThemeSound();
            setMenuOpen(!menuOpen);
          }}
        >
          <DropdownMenuTrigger className="inline-flex items-center">
            <Icon kind="tableOfContent" className={"h-6 w-6"} />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mb-5 mt-5" data-side="top">
            {tableOfContent.map((menuItem) => {
              return (
                <DropdownMenuItem key={menuItem.slug}>
                  <div
                    onClick={() => {
                      console.log("menuItem", menuItem.slug);
                      window.scrollTo({
                        top: document.getElementById(menuItem.slug).offsetTop,
                        behavior: "smooth",
                      });
                    }}
                  >
                    <div className="flex w-56 items-center justify-between">
                      <div className="flex items-center justify-between">
                        <span className="pl-2 pr-2 ">{menuItem.heading}</span>
                      </div>
                    </div>
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
