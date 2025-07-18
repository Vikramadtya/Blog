"use client";

import { useEffect, useState } from "react";

const ScrollProgressBar = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const totalScrollable = scrollHeight - clientHeight;
      const scrolled = (scrollTop / totalScrollable) * 100;
      setPercentage(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[9999] w-full">
      <div className="h-1 bg-neutral-200 dark:bg-neutral-800">
        <div
          className="h-1 bg-blue-600 transition-all duration-200 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ScrollProgressBar;
