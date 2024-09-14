"use client";
import Icon from "./icon";
import React, { useEffect, useState } from "react";
import { addView, getView } from "../../services/apiServices";

const ViewCount = ({ id, views }) => {
  const [currentViews, setCurrentViews] = useState(views);

  getView(id)
    .then((res) => res.json())
    .then((res) => {
      setCurrentViews(res.views);
    });

  useEffect(() => {
    addView(id).then((res) => res.json());
  }, [id]);

  return (
    <>
      <Icon kind="eye" className={"h-6 w-6"} />
      <p className="text-xs font-semibold md:text-sm">{currentViews}</p>
    </>
  );
};

export default ViewCount;
