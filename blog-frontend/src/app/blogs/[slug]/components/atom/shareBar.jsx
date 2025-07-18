"use client";

import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  XIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  EmailShareButton,
  EmailIcon,
  PocketShareButton,
  PocketIcon,
  InstapaperShareButton,
  InstapaperIcon,
} from "react-share";

import { classNameResolver } from "../../../../../utils/classNameResolver";

const ICON_SIZE = 36;

const ShareBar = ({ className = "", shareUrl, title }) => {
  return (
    <div
      className={classNameResolver(
        "bg-surface/80 dark:bg-surfaceDark/60 flex flex-wrap items-center justify-center gap-3 rounded-xl px-2 py-4 transition-all",
        className,
      )}
    >
      <FacebookShareButton url={shareUrl} title={title}>
        <FacebookIcon size={ICON_SIZE} round />
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={title}>
        <XIcon size={ICON_SIZE} round />
      </TwitterShareButton>

      <TelegramShareButton url={shareUrl} title={title}>
        <TelegramIcon size={ICON_SIZE} round />
      </TelegramShareButton>

      <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
        <WhatsappIcon size={ICON_SIZE} round />
      </WhatsappShareButton>

      <LinkedinShareButton url={shareUrl}>
        <LinkedinIcon size={ICON_SIZE} round />
      </LinkedinShareButton>

      <RedditShareButton
        url={shareUrl}
        title={title}
        windowWidth={660}
        windowHeight={460}
      >
        <RedditIcon size={ICON_SIZE} round />
      </RedditShareButton>

      <EmailShareButton url={shareUrl} subject={title} body="Check this out!">
        <EmailIcon size={ICON_SIZE} round />
      </EmailShareButton>

      <PocketShareButton url={shareUrl} title={title}>
        <PocketIcon size={ICON_SIZE} round />
      </PocketShareButton>

      <InstapaperShareButton url={shareUrl} title={title}>
        <InstapaperIcon size={ICON_SIZE} round />
      </InstapaperShareButton>
    </div>
  );
};

export default ShareBar;
