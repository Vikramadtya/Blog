"use client";
import Icon from "./icon";
import React, { useEffect, useState } from "react";
import { addView, getMetadata } from "../../services/apiServices";

const ViewCount = ({ id, views }) => {
  const [currentViews, setCurrentViews] = useState(views);

  useEffect(() => {
    addView(id).then((res) => res.json());

    getMetadata(id)
      .then((res) => res.json())
      .then((res) => {
        setCurrentViews(res[0].views);
      });
  }, [id]);

  return (
    <>
      <Icon kind="eye" className={"h-6 w-6"} />
      <p className="text-xs font-semibold md:text-sm">{currentViews}</p>
    </>
  );
};

export default ViewCount;
