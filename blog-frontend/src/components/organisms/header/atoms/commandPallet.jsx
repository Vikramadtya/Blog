"use client";

import * as React from "react";
import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";

import { Dialog, Combobox, Transition } from "@headlessui/react";
import useSound from "use-sound";

import Icon from "@/components/atom/icon";
import Command from "../../../../../public/icons/command.svg";

import { dropDownMenuNavLinks } from "@/utils/NavLinks";

export default function CommandPalett() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        setIsOpen(!isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleIcon = () => {
    setIsOpen(!isOpen);
  };

  const [ThemeSound] = useSound("/sounds/switch-on.mp3");

  const searchResult = query
    ? dropDownMenuNavLinks.filter((page) =>
        page.title.toLowerCase().includes(query.toLocaleLowerCase()),
      )
    : dropDownMenuNavLinks.filter((link) => link.title !== "");
  return (
    <>
      <button
        className="inline-flex items-center rounded-full border border-blue-700 p-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-700 hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500  dark:hover:text-white"
        type="button"
        aria-label="Command palette"
        onClick={() => {
          toggleIcon();
          ThemeSound();
        }}
      >
        <Command
          className={`h-[1.2rem]  w-[1.2rem] rotate-0 scale-100 transition-all`}
        />
      </button>
      <Transition.Root
        show={isOpen}
        as={Fragment}
        afterLeave={() => setQuery("")}
      >
        <Dialog
          onClose={setIsOpen}
          className="fixed inset-0 z-20 overflow-y-auto p-12 pt-[20vh]"
        >
          <Transition.Child
            enter="duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-zinc-500/75 " />
          </Transition.Child>
          <Transition.Child
            enter="duration-300 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Combobox
              value=""
              onChange={(page) => {
                setIsOpen(false);
                router.push(`${page.href}`);
              }}
              as="div"
              className="relative mx-auto max-h-[50vh] max-w-xl divide-y divide-gray-300 overflow-hidden overflow-y-scroll rounded-xl bg-zinc-200 shadow-2xl ring-1 ring-black/5 dark:divide-zinc-700 dark:bg-zinc-800"
            >
              <div className="flex items-center px-4">
                <Icon kind="search" className="h-6 w-6" />
                <Combobox.Input
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  className="h-12 border-0 bg-transparent pl-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none dark:text-neutral-400"
                  placeholder="Search..."
                  autoComplete="on"
                />
              </div>
              {searchResult.length > 0 && (
                <Combobox.Options
                  static
                  className="max-h-30 overflow-y-auto py-4 text-sm"
                >
                  {searchResult.map((link) => (
                    <Combobox.Option key={link.key} value={link}>
                      {({ active }) => (
                        <div
                          className={`flex cursor-pointer items-center space-x-1 px-14  py-2  ${
                            active
                              ? "bg-zinc-300 dark:bg-zinc-600"
                              : "bg-zinc-200 dark:bg-zinc-800"
                          }`}
                        >
                          <Icon kind={link.icon} className={"h-4 w-4"} />
                          <span
                            className={`pl-3 font-medium ${
                              active
                                ? "text-neutral-900 dark:text-neutral-200"
                                : "text-neutral-900 dark:text-neutral-200"
                            }`}
                          >
                            {link.title}
                          </span>
                        </div>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}
              {query && searchResult.length === 0 && (
                <p className="px-12 py-4 text-sm text-gray-500 ">
                  no results found
                </p>
              )}
            </Combobox>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
}
