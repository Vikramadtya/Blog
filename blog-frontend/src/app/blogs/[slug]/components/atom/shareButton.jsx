"use client";
import Icon from "../../../../../components/atom/icon";
import { siteMetadata as siteConfig } from "../../../../../../site.config";

const ShareButton = ({ blogSlug }) => {
  const shareUrl = `${siteConfig.siteUrl}/blogs/${blogSlug}`;

  return (
    <div
      id="share-button"
      onClick={() => {
        try {
          navigator.clipboard.writeText(shareUrl).then(() => {});
        } catch (e) {
          alert(`Could not copy to clipboard URL : ${shareUrl}`);
        }
      }}
    >
      <Icon kind="share" className={"h-6 w-6"} />
    </div>
  );
};

export default ShareButton;
