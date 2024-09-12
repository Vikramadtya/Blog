import React from "react";
import Link from "next/link";

import CommandPallet from "@/components/organisms/header/atoms/commandPallet";
import CurrentPath from "@/components/organisms/header/atoms/currentPath";
import ThemeToggle from "@/components/organisms/header/atoms/themeSwitch";
import DropMenu from "@/components/organisms/header/atoms/dropMenu";
import Logo from "@/components/atom/logo";

import { siteMetadata } from "@/MetaData";
import { navLinks } from "@/utils/NavLinks";

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between  pb-2">
      <div className="flex items-center justify-between md:gap-10">
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between gap-3 pl-4">
            <Logo size={70} />
          </div>
        </Link>
        <CurrentPath />
      </div>
      <div className="relative mr-7 flex items-center text-base leading-5">
        <div className="hidden lg:block">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="underlined-header-link rounded-xl font-bold sm:p-4 dark:hover:bg-opacity-10"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <ThemeToggle />
        <DropMenu />
        <CommandPallet />
      </div>
    </header>
  );
};

export default Header;
