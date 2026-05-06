import React from "react";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

/**
 * Global loading template for Next.js App Router.
 * This is displayed during route transitions or when server components
 * are fetching data.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={60} />
        <p className="animate-pulse text-sm font-medium text-muted-foreground">
          Loading content...
        </p>
      </div>
    </div>
  );
}
