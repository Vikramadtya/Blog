import MarkdownContentList from "@/components/molecules/MarkdownContentList";
import React from "react";

const FeaturedSection = ({ title, blogs, blogIdToMetadata }) => (
  <section className="w-full">
    <h2 className="mb-6 text-2xl font-semibold tracking-wide text-gray-800 dark:text-gray-100 md:text-3xl">
      {title}
    </h2>
    <MarkdownContentList blogs={blogs} blogIdToMetadata={blogIdToMetadata} />
  </section>
);

export default FeaturedSection;
