import React from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSubscribeForm from "@/presentation/blog/HeroSubscribeForm";

const TOPICS = ["Productivity", "DeFi", "Business", "AI"];

const HeroSection = () => {
  return (
    <div className="relative w-full">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-14 lg:flex-row lg:gap-10">
        {/* Left Content */}
        <div className="fade-up flex w-full flex-col justify-center lg:w-[52%]">
          <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Engineering notes, written in public
          </span>

          <h1 className="mb-6 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            I learn by building. <br />
            <span className="hero-accent font-serif italic">
              Then I document
            </span>{" "}
            <span className="hero-accent font-serif italic">the path.</span>
          </h1>

          <p className="mb-5 max-w-xl text-lg font-semibold leading-snug text-foreground sm:text-xl">
            For software engineers who want to go deeper, ship better, and
            understand how things actually work.
          </p>

          <p className="mb-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            I take on one hard engineering problem at a time, dig into the
            details, and document the path from idea to working code. The
            technology changes. The method stays the same: build it, understand
            it, write it down.
          </p>

          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              Read the blog <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/notes"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
            >
              Browse notes
            </Link>
          </div>

          <HeroSubscribeForm />

          <ul
            className="mt-8 flex flex-wrap items-center gap-2"
            aria-label="Topics"
          >
            {TOPICS.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-border bg-card/70 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Content - Illustration */}
        <div
          className="fade-up flex w-full justify-center lg:w-[48%]"
          style={{ animationDelay: "120ms" }}
        >
          <div className="hero-frame relative aspect-[4/5] w-full max-w-lg">
            <Image
              src="/images/home-hero.png"
              alt="Desk workspace illustration"
              fill
              className="relative z-10 object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
