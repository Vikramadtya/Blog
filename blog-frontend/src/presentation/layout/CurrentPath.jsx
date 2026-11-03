"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Typed from "typed.js";
import Icon from "@/presentation/ui/Icon";

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
    <div className="hidden max-w-[16rem] items-center gap-2 overflow-hidden whitespace-nowrap font-mono text-sm font-medium text-muted-foreground xl:flex">
      <Icon kind="location" className="h-5 w-5" />
      <span ref={el} className="truncate" />
    </div>
  );
};

export default CurrentPath;
