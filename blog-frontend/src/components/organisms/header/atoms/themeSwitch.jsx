"use client";

import React, { Fragment, useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import useSound from "use-sound";

const ThemeToggle = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [playSound] = useSound("/sounds/switch-on.mp3");

  // This useEffect runs only on the client, after the component has mounted.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything on the server, or until the component has mounted.
  if (!isMounted) {
    return null; // or return a placeholder skeleton
  }

  const toggleTheme = () => {
    playSound();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Switch checked={theme === "dark"} onChange={toggleTheme} as={Fragment}>
      {({ checked }) => (
        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-300 transition dark:bg-zinc-700">
          <span className="sr-only">Toggle theme</span>
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              checked ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      )}
    </Switch>
  );
};

export default ThemeToggle;
