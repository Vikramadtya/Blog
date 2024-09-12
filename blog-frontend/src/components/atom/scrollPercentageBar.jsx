"use client";

import { useEffect, useState } from "react";

const ScrollProgressBar = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", async () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;
      const scrollPercentage = scrollY / (documentHeight - windowHeight);
      setPercentage(scrollPercentage * 100);
    });
  }, []);

  return (
    <>
      <div className="sticky top-0 mb-4 h-0.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-0.5 rounded-full bg-blue-600 dark:bg-blue-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </>
  );
};

export default ScrollProgressBar;
