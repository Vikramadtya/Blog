"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Typed from "typed.js";
import Icon from "@/components/atom/icon";

const CurrentPath = () => {
  const pathname = usePathname();
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [pathname === "/" ? "/home" : pathname],
      typeSpeed: 40,
      backSpeed: 20,
      showCursor: false,
    });
    return () => typed.destroy();
  }, [pathname]);

  return (
    <div className="flex items-center gap-2 text-base font-medium text-zinc-700 dark:text-zinc-200">
      <Icon kind="location" className="h-5 w-5" />
      <span ref={el} />
    </div>
  );
};

export default CurrentPath;
