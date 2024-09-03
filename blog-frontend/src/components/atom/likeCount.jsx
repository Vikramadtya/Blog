"use client";
import Icon from "./icon";
import React, { useState } from "react";
import { getLikes } from "../../services/likesServices";

const LikeCount = ({ id }) => {
  const [likes, setLikes] = useState("fetching latest view count");

  getLikes(id).then((likes) => setLikes(likes));

  return (
    <>
      <Icon kind="heart" className={"h-6 w-6"} />
      <p className="text-xs font-semibold md:text-sm">{likes}</p>
    </>
  );
};

export default LikeCount;
