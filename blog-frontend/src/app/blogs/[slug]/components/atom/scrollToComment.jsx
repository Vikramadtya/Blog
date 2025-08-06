"use client";

import Icon from "../../../../../components/atom/icon";
import React from "react";
import ShareButton from "./shareButton";

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
