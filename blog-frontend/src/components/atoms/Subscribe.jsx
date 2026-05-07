"use client";
import React from "react";
import { notify } from "@/lib/client/api";

import content from "../../../config/content.json";

import Icon from "./Icon";

const Subscribe = () => {
  const [status, setStatus] = React.useState("idle"); // idle, loading, success, error

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    try {
      await notify(formData.get("email"));
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-4xl px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-10 shadow-2xl transition-all dark:bg-indigo-900 sm:p-16">
        <div className="relative z-10">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {status === "success" ? "You're on the list!" : content.subscribe.title}
          </h2>

          <p className="mt-4 text-center text-lg text-indigo-100">
            {status === "success" 
              ? "Thanks for subscribing! I'll keep you posted with the latest deep dives."
              : content.subscribe.description}
          </p>

          {status !== "success" && (
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <div className="min-w-0 flex-1 sm:max-w-md">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={status === "loading"}
                  placeholder={content.subscribe.placeholder}
                  className="w-full rounded-2xl border-0 bg-white/10 px-6 py-4 text-white placeholder-indigo-200 ring-1 ring-inset ring-white/20 transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Icon kind="clock" className="h-5 w-5 animate-spin" />
                ) : (
                  content.subscribe.buttonText
                )}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-4 text-center text-sm font-medium text-red-200">
              Something went wrong. Please try again.
            </p>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
    </div>
  );
};

export default Subscribe;
