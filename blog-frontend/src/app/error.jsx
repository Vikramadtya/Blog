"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/atoms/Icon";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 text-red-500">
           <Icon kind="close" className="h-12 w-12" />
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
          Something went <span className="text-red-500">wrong</span>
        </h1>
        <p className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground">
          An unexpected error occurred. We&apos;ve been notified and are looking into it.
        </p>
        
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-95"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-border px-8 py-4 text-sm font-semibold transition-all hover:bg-muted active:scale-95"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}
