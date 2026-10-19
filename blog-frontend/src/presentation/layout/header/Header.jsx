import React from "react";
import Link from "next/link";

import CommandPalette from "@/presentation/ui/CommandPalette";
import CurrentPath from "@/presentation/layout/CurrentPath";
import ThemeToggle from "@/presentation/layout/ThemeSwitch";
import MobileNavMenu from "@/presentation/layout/MobileNavMenu";
import Logo from "@/presentation/ui/Logo";

import { siteMetadata } from "../../../../site.config.mjs";
import { navLinks } from "@/lib/navLinks";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        {/* Left section: Logo and brand in Playfair Display serif */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            aria-label={siteMetadata.headerTitle}
            className="flex items-center gap-2.5 text-foreground hover:text-primary transition-colors"
          >
            <Logo size={40} />
            <span className="font-serif text-lg md:text-xl font-semibold tracking-wide">
              {siteMetadata.headerTitle || siteMetadata.author}
            </span>
          </Link>
          <CurrentPath />
        </div>

        {/* Right section: nav links, theme toggle, command palette */}
        <div className="flex items-center gap-3">
          {/* Navigation links */}
          <nav className="hidden gap-2 lg:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-primary"
              >
                {link.title}
              </Link>
            ))}
            {process.env.NODE_ENV === "development" && (
              <Link
                href="/admin"
                className="rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
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
