"use client";

import Icon from "./icon";
import { addLike } from "../../services/apiServices";

const LikeButton = ({ blogId, kind, className, handler }) => {
  return (
    <div
      onClick={() => {
        addLike(blogId).then((r) => {});
      }}
    >
      <Icon kind={kind} className={className} />
    </div>
  );
};

export default LikeButton;
