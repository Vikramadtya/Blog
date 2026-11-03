"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Desktop nav with a pill on the section you're in (e.g. /notes/... highlights "Notes"). */
export default function NavLinks({ links }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const external = /^https?:/.test(link.href);
        const active =
          !external &&
          (pathname === link.href || pathname.startsWith(`${link.href}/`));
        return (
          <Link
            key={link.key}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {link.title}
          </Link>
        );
      })}
    </>
  );
}
