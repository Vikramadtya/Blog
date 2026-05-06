"use client";

import Link from "next/link";
import React, { useState } from "react";
import useSound from "use-sound";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/atoms/DropdownMenu";

import Icon from "@/components/atoms/Icon";
import MenuOpen from "../../../public/icons/menu-open.svg";
import MenuClose from "../../../public/icons/menu-close.svg";
import { dropDownMenuNavLinks } from "@/utils/navLinks";

const DropMenu = () => {
  const [playSound] = useSound("/sounds/switch-on.mp3");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="px-2">
      <DropdownMenu
        onOpenChange={() => {
          playSound();
          setMenuOpen(!menuOpen);
        }}
      >
        <DropdownMenuTrigger className="relative inline-flex items-center rounded-full border border-indigo-600 p-2 text-indigo-600 transition hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-400">
          <MenuOpen
            className={`h-5 w-5 transition-all ${
              menuOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"
            }`}
          />
          <MenuClose
            className={`absolute h-5 w-5 transition-all ${
              menuOpen ? "rotate-0 scale-100" : "rotate-90 scale-0"
            }`}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-2 w-64 rounded-xl bg-white p-2 shadow-lg ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
          {dropDownMenuNavLinks.map((item) =>
            item.title === "" ? (
              <DropdownMenuSeparator key={item.key} />
            ) : (
              <DropdownMenuItem key={item.key}>
                <Link href={item.href} className="flex w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Icon kind={item.icon} className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropMenu;
