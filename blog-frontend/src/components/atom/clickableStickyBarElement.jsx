"use client";

import Icon from "./icon";
import { addLike } from "../../services/apiServices";

const ClickableStickyBarElement = ({ blogId, kind, className, handler }) => {
  return (
    <div
      onClick={() => {
        addLike(blogId)
          .then((res) => res.json())
          .then((res) => console.log(res));
      }}
    >
      <Icon kind={kind} className={className} />
    </div>
  );
};

export default ClickableStickyBarElement;
