import React from "react";
import Link from "next/link";

import CommandPallet from "../../../components/organisms/header/atoms/commandPallet";
import CurrentPath from "../../../components/organisms/header/atoms/currentPath";
import ThemeToggle from "../../../components/organisms/header/atoms/themeSwitch";
import DropMenu from "../../../components/organisms/header/atoms/dropMenu";
import Logo from "../../../components/atom/logo";

import { siteMetadata } from "@/MetaData";
import { navLinks } from "@/utils/NavLinks";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-background/80 shadow-md backdrop-blur-md dark:border-zinc-800 dark:bg-background/80">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        {/* Left section: Logo and current path */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-center gap-2">
              <Logo size={60} />
            </div>
          </Link>
          <CurrentPath />
        </div>

        {/* Right section: nav links, theme toggle, command palette */}
        <div className="flex items-center gap-3">
          {/* Navigation links (shown on large screens only) */}
          <nav className="hidden gap-2 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-zinc-700 dark:hover:text-indigo-400"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <ThemeToggle />
          <DropMenu />
          <CommandPallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
