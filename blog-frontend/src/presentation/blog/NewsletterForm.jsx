"use client";

import React, { useState } from "react";
import { notify } from "@/lib/client/api";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await notify(email);
      if (res.success || res.message) {
        setStatus("success");
        setMessage("Thanks for subscribing! Keep an eye on your inbox.");
        setEmail("");
      } else {
        throw new Error(res.error || "Failed to subscribe");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-sm mt-12 mb-12 relative overflow-hidden">
      {/* Decorative background nodes (optional, mimics the lines/dots in the image) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(0,0,0,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10">
        <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-3">
          My best stuff is in my email.
        </h3>
        <p className="text-lg text-muted-foreground mb-8">
          My goal is for it to be the most useful email you read that day.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-4">
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-w-0 flex-auto rounded-lg border border-border px-4 py-3 text-foreground shadow-sm focus:border-[#f05a28] focus:ring-1 focus:ring-[#f05a28] sm:text-base bg-background disabled:opacity-50"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="flex-none rounded-lg bg-[#f05a28] px-8 py-3 text-sm font-bold tracking-wide text-white shadow-sm hover:bg-[#d94a1b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a28] disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase"
          >
            {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Subscribe"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground">
          No spam. Unsubscribe in one click.
        </p>

        {message && (
          <p className={`mt-4 text-sm font-medium ${status === "error" ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
