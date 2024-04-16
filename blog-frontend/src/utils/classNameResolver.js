import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function classNameResolver(...inputs) {
  return twMerge(clsx(inputs));
}
