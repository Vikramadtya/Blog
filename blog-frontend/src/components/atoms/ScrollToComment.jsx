"use client";

import Icon from "./Icon";
import React from "react";
import ShareButton from "./ShareButton";

const ScrollToComment = React.forwardRef(({}, ref) => {
  return (
    <div>
      <div
        ref={ref}
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
});

ScrollToComment.displayName = "ScrollToComment";

export default ScrollToComment;
