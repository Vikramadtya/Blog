"use client";

import * as React from "react";
import { Fragment } from "react";

import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import useSound from "use-sound";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const [ThemeSound] = useSound("/sounds/switch-on.mp3");

  return (
    <Switch
      checked={theme === "dark"}
      onChange={() => {
        ThemeSound();
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      as={Fragment}
    >
      {({ checked }) => (
        /* Use the `checked` state to conditionally style the button. */
        <button
          className={`${
            checked ? "bg-yellow-300" : "bg-black"
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Change theme</span>
          <span
            className={`${
              checked ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          ></span>
        </button>
      )}
    </Switch>
  );
};

export default ThemeToggle;
