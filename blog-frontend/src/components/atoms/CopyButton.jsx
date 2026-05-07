"use client";

import React, { useState } from "react";
import Icon from "./Icon";

export default function CopyButton({ text }) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="absolute top-4 right-4 z-20 h-8 w-8 rounded-lg bg-zinc-800 p-1.5 text-zinc-400 transition-all hover:bg-zinc-700 hover:text-white"
      aria-label="Copy code"
    >
      {isCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-full w-full text-green-400"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <Icon kind="command" className="h-full w-full" />
      )}
    </button>
  );
}
