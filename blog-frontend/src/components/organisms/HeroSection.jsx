import React from "react";
import Image from "next/image";

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
            I learn by doing. <br />
            <span className="font-serif italic text-[#f05a28]">
              Then I write
            </span>{" "}
            <br />
            <span className="font-serif italic text-[#f05a28]">down how.</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-6 text-lg font-semibold text-foreground sm:text-xl">
            For operators getting technical, and builders learning to operate.
          </p>

          {/* Description */}
          <p className="mb-10 text-base leading-relaxed text-muted-foreground sm:text-lg">
            I go deep on one hard thing at a time, then write down exactly how
            to do it yourself. The topic keeps changing; the method doesn&apos;t.
          </p>

          {/* Subscribe Box */}
          <div className="rounded-xl border border-border bg-muted/30 p-6 md:p-8">
            <h3 className="mb-2 text-xl font-bold text-foreground">
              My best stuff is in my email.
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
              My goal is for it to be the most useful email you read that day.
            </p>
            <div className="hero-subscribe">
              <form className="flex w-full items-center gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  className="h-10 whitespace-nowrap rounded-md bg-[#f05a28] px-4 py-2 font-bold text-white transition-colors hover:bg-[#d94a1b]"
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No spam. Unsubscribe in one click.
            </p>
          </div>

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
