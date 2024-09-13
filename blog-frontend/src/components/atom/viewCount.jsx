"use client";
import Icon from "./icon";
import React, { useEffect, useState } from "react";
import { addView, getView } from "../../services/apiServices";

const ViewCount = ({ id, views }) => {

  useEffect(() => {
    addView(id)
      .then((res) => res.json())
      .then((res) => console.log(res));
  }, [id]);

  return (
    <>
      <Icon kind="eye" className={"h-6 w-6"} />
      <p className="text-xs font-semibold md:text-sm">{views}</p>
    </>
  );
};

export default ViewCount;
