"use client";

import Icon from "../../../../../components/atom/icon";

const ScrollToComment = () => {
  return (
    <div>
      <div
        onClick={() =>
          window.scrollTo({
            top: document.getElementById("comments").offsetTop,
            behavior: "smooth",
          })
        }
      >
        <Icon kind="comment" className={"h-6 w-6"} />
      </div>
    </div>
  );
};

export default ScrollToComment;
