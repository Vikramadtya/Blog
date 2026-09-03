"use client";
import React, { useState } from "react";
import { notify } from "@/lib/client/api";

const HeroSubscribeForm = () => {
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    const formData = new FormData(event.currentTarget);
    try {
      await notify(formData.get("email"));
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border bg-green-500/10 p-6 md:p-8">
        <h3 className="mb-2 text-xl font-bold text-green-600 dark:text-green-400">
          You&apos;re on the list!
        </h3>
        <p className="text-sm text-muted-foreground">
          Thanks for subscribing. I&apos;ll keep you posted with the latest deep dives.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-6 md:p-8">
      <h3 className="mb-2 text-xl font-bold text-foreground">
        My best stuff is in my email.
      </h3>
      <p className="mb-6 text-sm text-muted-foreground">
        My goal is for it to be the most useful email you read that day.
      </p>
      <div className="hero-subscribe">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            disabled={status === "loading"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="h-10 whitespace-nowrap rounded-md bg-[#f05a28] px-4 py-2 font-bold text-white transition-colors hover:bg-[#d94a1b] disabled:opacity-50"
          >
            {status === "loading" ? "SUBSCRIBING..." : "SUBSCRIBE"}
          </button>
        </form>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs font-medium text-red-500">
          {errorMessage || "Something went wrong. Please try again."}
        </p>
      )}
      <p className="mt-4 text-xs text-muted-foreground">
        No spam. Unsubscribe in one click.
      </p>
    </div>
  );
};

export default HeroSubscribeForm;
