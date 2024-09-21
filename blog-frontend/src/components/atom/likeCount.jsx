"use client";
import Icon from "./icon";
import React, { useEffect, useState } from "react";
import { getMetadata } from "../../services/apiServices";

const LikeCount = ({ id, likes }) => {
  const [currentLikes, setCurrentLikes] = useState(likes);

  useEffect(() => {
    getMetadata(id)
      .then((res) => res.json())
      .then((res) => setCurrentLikes(res[0].likes));
  }, []);

  return (
    <>
      <Icon kind="heart" className={"h-6 w-6"} />
      <p className="text-xs font-semibold md:text-sm">{currentLikes}</p>
    </>
  );
};

export default LikeCount;
