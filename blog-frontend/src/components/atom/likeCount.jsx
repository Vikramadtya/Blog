"use client";
import Icon from "./icon";
import React, { useState } from "react";
import { getLikes } from "../../services/apiServices";

const LikeCount = ({ id }) => {
  const [likes, setLikes] = useState("fetching latest view count");

  getLikes(id)
    .then((res) => res.json())
    .then((likes) => setLikes(likes))
    .catch((err) => {
      console.log(err);
      setLikes("failed to fetch like count");
    });

  return (
    <>
      <Icon kind="heart" className={"h-6 w-6"} />
      <p className="text-xs font-semibold md:text-sm">{likes}</p>
    </>
  );
};

export default LikeCount;
