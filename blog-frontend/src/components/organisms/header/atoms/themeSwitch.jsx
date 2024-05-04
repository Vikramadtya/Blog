"use client";

import * as React from "react";
import { useState, Fragment } from "react";

import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import useSound from "use-sound";

import SunIcon from "../../../../../public/icons/owl.svg";
import MoonIcon from "../../../../../public/icons/sun.svg";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const [ThemeSound] = useSound("/sounds/switch-on.mp3");

  return (
    <Switch
      checked={theme === "dark"}
      onChange={() => {
        ThemeSound();
        setTheme(theme === "light" ? "dark" : "light");
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
          >
            {/*<SunIcon className="h-[0.8rem] w-[0.8rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />*/}
            {/*<MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />*/}
          </span>
        </button>
      )}
    </Switch>
  );
};

export default ThemeToggle;
