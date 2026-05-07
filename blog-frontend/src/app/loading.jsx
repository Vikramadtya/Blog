import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col px-6 pt-32 md:px-12 lg:px-24">
      <div className="mx-auto w-full max-w-5xl animate-pulse">
        {/* Hero Skeleton */}
        <div className="mb-8 h-12 w-3/4 rounded-2xl bg-muted" />
        <div className="mb-12 h-6 w-1/2 rounded-xl bg-muted/60" />
        
        {/* Image Skeleton */}
        <div className="aspect-[2/1] w-full rounded-3xl bg-muted" />
        
        {/* Content Skeleton */}
        <div className="mt-16 space-y-6">
          <div className="h-4 w-full rounded bg-muted/40" />
          <div className="h-4 w-full rounded bg-muted/40" />
          <div className="h-4 w-5/6 rounded bg-muted/40" />
          <div className="h-4 w-full rounded bg-muted/40" />
          <div className="h-4 w-4/6 rounded bg-muted/40" />
        </div>
      </div>
    </div>
  );
}
