"use client";
import Icon from "./icon";
import React, { useState } from "react";
import { getView } from "../../services/viewsServices";

const ViewCount = ({ id }) => {
  const [views, setViews] = useState("fetching latest view count");

  getView(id).then((view) => setViews(view));

  return (
    <>
      <Icon kind="eye" className={"h-6 w-6"} />
      <p className="text-xs font-semibold md:text-sm">{views}</p>
    </>
  );
};

export default ViewCount;
