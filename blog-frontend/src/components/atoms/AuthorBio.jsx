import React from "react";
import Image from "next/image";
import Link from "next/link";
import SocialIcon from "./SocialIcon";
import { siteMetadata } from "../../../site.config.mjs";

export default function AuthorBio() {
  return (
    <div className="mt-16 rounded-3xl border border-border bg-muted/30 p-8 md:p-12">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-indigo-500/20">
          <Image
            src="/icons/me.svg" // Fallback to icon if avatar is missing
            alt={siteMetadata.author}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="mb-2 flex flex-col items-center justify-between gap-2 md:flex-row">
            <h3 className="text-2xl font-bold">{siteMetadata.author}</h3>
            <div className="flex gap-3">
              {siteMetadata.twitter && <SocialIcon kind="twitter" href={siteMetadata.twitter} size={18} />}
              {siteMetadata.github && <SocialIcon kind="github" href={siteMetadata.github} size={18} />}
              {siteMetadata.linkedin && <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={18} />}
            </div>
          </div>
          
          <p className="mb-6 text-lg text-muted-foreground">
            {siteMetadata.designation} at {siteMetadata.company}. I build high-performance web applications and write about the intersection of software engineering and human creativity.
          </p>
          
          <Link
            href={siteMetadata.portfolioLink}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            View Portfolio &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
