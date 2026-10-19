import React from "react";
import Link from "next/link";

import CommandPalette from "@/presentation/ui/CommandPalette";
import CurrentPath from "@/presentation/layout/CurrentPath";
import ThemeToggle from "@/presentation/layout/ThemeSwitch";
import MobileNavMenu from "@/presentation/layout/MobileNavMenu";
import Logo from "@/presentation/ui/Logo";

import { siteMetadata } from "../../../../site.config.mjs";
import { navLinks } from "@/lib/navLinks";

const { content } = siteMetadata;

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
            {process.env.NODE_ENV === "development" && (
              <Link
                href="/admin"
                className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-gray-100 dark:text-red-400 dark:hover:bg-zinc-700"
              >
                Admin
              </Link>
            )}
          </nav>

          {siteMetadata.features.themeToggle && <ThemeToggle />}
          <MobileNavMenu />
          {siteMetadata.features.search && <CommandPalette />}
        </div>
      </div>
    </header>
  );
};

export default Header;
