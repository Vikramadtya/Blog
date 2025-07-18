"use client";

import React, { Fragment } from "react";
import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import useSound from "use-sound";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [playSound] = useSound("/sounds/switch-on.mp3");

  const toggleTheme = () => {
    playSound();
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Switch checked={theme === "dark"} onChange={toggleTheme} as={Fragment}>
      {({ checked }) => (
        <button
          className={`relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-300 transition dark:bg-zinc-700`}
        >
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
