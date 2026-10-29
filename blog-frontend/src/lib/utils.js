import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind classes with clsx and tailwind-merge.
 * @param  {...any} inputs - Class names, objects, or arrays.
 * @returns {string} - Merged class string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Serialise JSON-LD for an inline <script>; escaping "<" stops a "</script>" in content closing the tag. */
export function jsonLdString(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
