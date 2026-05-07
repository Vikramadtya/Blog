import React from "react";
import Link from "next/link";
import Icon from "@/components/atoms/Icon";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
           <Icon kind="search" className="h-12 w-12" />
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
          Page not <span className="text-indigo-500">found</span>
        </h1>
        <p className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-95"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
