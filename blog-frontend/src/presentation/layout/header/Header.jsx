import React from "react";
import Link from "next/link";

import CommandPalette from "@/presentation/ui/CommandPalette";
import ThemeToggle from "@/presentation/layout/ThemeSwitch";
import MobileNavMenu from "@/presentation/layout/MobileNavMenu";
import Logo from "@/presentation/ui/Logo";

import { siteMetadata } from "../../../../site.config.mjs";
import { navLinks } from "@/lib/navLinks";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-background/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        {/* Left section: Brand name in Playfair Display serif */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label={siteMetadata.headerTitle || siteMetadata.author}
            className="flex items-center gap-2.5 text-ink hover:text-primary transition-colors"
          >
            <Logo size={36} />
            <span className="font-serif text-lg md:text-xl font-semibold tracking-wide">
              {siteMetadata.headerTitle || siteMetadata.author || "Neel Mishra"}
            </span>
          </Link>
        </div>

        {/* Right section: nav links, theme toggle, command palette */}
        <div className="flex items-center gap-4">
          {/* Navigation links (shown on medium/large screens) */}
          <nav className="hidden gap-1.5 md:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-primary hover:bg-primary/5"
              >
                {link.title}
              </Link>
            ))}
            {process.env.NODE_ENV === "development" && (
              <Link
                href="/admin"
                className="rounded-md px-2.5 py-1 text-xs font-mono font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              >
                admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {siteMetadata.features.themeToggle && <ThemeToggle />}
            <MobileNavMenu />
            {siteMetadata.features.search && <CommandPalette />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
