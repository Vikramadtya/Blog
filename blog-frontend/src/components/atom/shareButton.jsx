"use client";
import Icon from "./icon";

const ShareButton = ({}) => {
  return (
    <div
      id="share-button"
      onClick={() => {
        console.log("share button clicked");
        navigator.clipboard
          .writeText("copied to clipboard")
          .then((r) => console.log("copies to clipboard", r));
      }}
    >
      <Icon kind="share" className={"h-6 w-6"} />
    </div>
  );
};

export default ShareButton;
