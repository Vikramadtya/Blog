"use client";

import Icon from "./icon";

const ClickableStickyBarElement = ({ kind, className, handler }) => {
  return (
    <div
      onClick={() => {
        handler();
      }}
    >
      <Icon kind={kind} className={className} />
    </div>
  );
};

export default ClickableStickyBarElement;
