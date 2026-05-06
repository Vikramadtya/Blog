"use client";
import React from "react";
import { notify } from "@/lib/client/api";

import content from "../../../config/content.json";

const Subscribe = () => {
  return (
    <div className="mx-auto mt-16 max-w-4xl px-6 lg:px-8">
      <div className="relative rounded-xl bg-white p-10  transition-all dark:bg-neutral-900 sm:p-16">
        <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          {content.subscribe.title}
        </h2>

        <p className="mt-2 text-center text-lg text-gray-600 dark:text-gray-300">
          {content.subscribe.description}
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            notify(formData.get("email")).then(() => {
              console.log("notified of subscription");
            });
          }}
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <div className="flex-1">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={content.subscribe.placeholder}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {content.subscribe.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Subscribe;
