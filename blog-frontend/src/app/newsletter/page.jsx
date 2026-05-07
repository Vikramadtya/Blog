import React from "react";
import Subscribe from "@/components/atoms/Subscribe";
import { siteMetadata } from "../../../site.config.mjs";

export async function generateMetadata() {
  return {
    title: `Newsletter | ${siteMetadata.title}`,
    description: "Join the community and get the latest technical insights delivered to your inbox.",
    alternates: {
      canonical: `${siteMetadata.siteUrl}/newsletter`,
    },
  };
}

export default function NewsletterPage() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center py-20">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
          Stay <span className="text-indigo-500">Connected</span>
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground">
          I write about software engineering, Linux chronicles, and the journey of building modern web applications. No spam, just deep dives.
        </p>
        
        <Subscribe />
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-border p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold">Bi-weekly Updates</h3>
            <p className="text-sm text-muted-foreground">Regular deep dives without the noise.</p>
          </div>
          <div className="rounded-2xl border border-border p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="font-bold">Code First</h3>
            <p className="text-sm text-muted-foreground">Practical examples and snippet breakdowns.</p>
          </div>
          <div className="rounded-2xl border border-border p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold">Privacy Matters</h3>
            <p className="text-sm text-muted-foreground">Your email is safe with me. One click unsubscribe.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
