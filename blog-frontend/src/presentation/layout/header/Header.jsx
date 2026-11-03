import React from "react";
import Link from "next/link";

import CommandPalette from "@/presentation/ui/CommandPalette";
import CurrentPath from "@/presentation/layout/CurrentPath";
import ThemeToggle from "@/presentation/layout/ThemeSwitch";
import MobileNavMenu from "@/presentation/layout/MobileNavMenu";
import Logo from "@/presentation/ui/Logo";
import NavLinks from "@/presentation/layout/header/NavLinks";

import { siteMetadata } from "../../../../site.config.mjs";
import { navLinks } from "@/lib/navLinks";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 shadow-[0_1px_0_0_hsl(var(--background)/0.6),0_8px_24px_-18px_rgba(19,32,26,0.25)] backdrop-blur-xl backdrop-saturate-150 transition-colors">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        {/* Left section: Logo and brand in Playfair Display serif */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            aria-label={siteMetadata.headerTitle}
            className="flex items-center gap-2.5 text-foreground transition-colors hover:text-primary"
          >
            <Logo size={40} />
            <span className="font-serif text-lg font-semibold tracking-wide md:text-xl">
              {siteMetadata.headerTitle || siteMetadata.author}
            </span>
          </Link>
          <CurrentPath />
        </div>

        {/* Right section: nav links, theme toggle, command palette */}
        <div className="flex items-center gap-3">
          {/* Navigation links */}
          <nav className="hidden items-center gap-2 lg:flex">
            <NavLinks links={navLinks} />
            {process.env.NODE_ENV === "development" && (
              <Link
                href="/admin"
                className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-700 transition-colors hover:bg-amber-500/20"
              >
                admin
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
