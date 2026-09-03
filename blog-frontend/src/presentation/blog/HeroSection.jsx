import React from "react";
import Image from "next/image";
import HeroSubscribeForm from "@/presentation/blog/HeroSubscribeForm";

import { siteMetadata } from "../../../site.config.mjs";

const HeroSection = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 lg:flex-row">
        {/* Left Content */}
        <div className="flex w-full flex-col justify-center lg:w-1/2">
          {/* Profile Header */}

          {/* Main Title */}
          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            I learn by building. <br />
            <span className="font-serif italic text-[#f05a28]">
              Then I document
            </span>{" "}
            <br />
            <span className="font-serif italic text-[#f05a28]">the path.</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-6 text-lg font-semibold text-foreground sm:text-xl">
            For software engineers who want to go deeper, ship better, and
            understand how things actually work.
          </p>

          {/* Description */}
          <p className="mb-10 text-base leading-relaxed text-muted-foreground sm:text-lg">
            I take on one hard engineering problem at a time, dig into the
            details, and document the path from idea to working code. The
            technology changes. The method stays the same: build it, understand
            it, write it down.
          </p>

          {/* Subscribe Box */}
          <HeroSubscribeForm />

          {/* Tags */}
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span>PRODUCTIVITY</span>
            <span>·</span>
            <span>DEFI</span>
            <span>·</span>
            <span>BUSINESS</span>
            <span>·</span>
            <span>AI</span>
          </div>
        </div>

        {/* Right Content - Illustration */}
        <div className="flex w-full justify-center lg:w-1/2">
          <div className="relative aspect-[4/5] w-full max-w-lg">
            {/* The image uploaded by the user will be placed here */}
            <Image
              src="/images/home-hero.png"
              alt="Desk workspace illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
