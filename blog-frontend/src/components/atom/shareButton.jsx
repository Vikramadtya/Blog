"use client";
import Icon from "./icon";

const ShareButton = ({ blogSlug }) => {
  return (
    <div
      id="share-button"
      onClick={() => {
        try {
          navigator.clipboard
            .writeText(`https://www.neuralcook.com/blogs/${blogSlug}`)
            .then((r) => console.log("copied to clipboard", r));
        } catch (e) {
          alert(
            `Could not copy to clipboard URL : https://www.neuralcook.com/blogs/${blogSlug}`,
          );
        }
      }}
    >
      <Icon kind="share" className={"h-6 w-6"} />
    </div>
  );
};

export default ShareButton;
