"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";

import useSound from "use-sound";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import Icon from "@/components/atom/icon";

import MenuOpen from "../../../../../public/icons/menu-open.svg";
import MenuClose from "../../../../../public/icons/menu-close.svg";
import { dropDownMenuNavLinks } from "@/utils/NavLinks";

const DropMenu = () => {
  const [ThemeSound] = useSound("/sounds/switch-on.mp3");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="pl-2 pr-2">
        <DropdownMenu
          onOpenChange={() => {
            ThemeSound();
            setMenuOpen(!menuOpen);
          }}
        >
          <DropdownMenuTrigger className="inline-flex items-center rounded-full border border-blue-700 p-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500  dark:hover:text-white">
            <MenuOpen
              className={`h-[1.2rem]  w-[1.2rem] rotate-0 scale-100 transition-all ${menuOpen ? "" : "-rotate-90 scale-0"} `}
            />
            <MenuClose
              className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all ${menuOpen ? "rotate-0 scale-100" : ""}`}
            />

            <span className="sr-only">Icon description</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mr-2 ">
            {dropDownMenuNavLinks.map((menuItem) => {
              if (menuItem.title === "")
                return <DropdownMenuSeparator key={menuItem.key} />;
              return (
                <DropdownMenuItem key={menuItem.key}>
                  <Link href={menuItem.href}>
                    <div className="flex w-56 items-center justify-between">
                      <div className="flex items-center justify-between">
                        <Icon kind={menuItem.icon} className="h-4 w-4" />
                        <span className="pl-2 pr-2 ">{menuItem.title}</span>
                      </div>
                      <div>
                        <DropdownMenuShortcut>
                          {menuItem.shortcut}
                        </DropdownMenuShortcut>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default DropMenu;
