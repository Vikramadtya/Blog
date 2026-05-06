import MarkDownContentList from "@/components/molecules/MarkDownContentList";
import React from "react";

const FeaturedSection = ({ title, blogs, blogIdToMetadata }) => (
  <div className="w-full">
    <h2 className="mb-6 text-2xl font-semibold tracking-wide text-gray-800 dark:text-gray-100 md:text-3xl">
      {title}
    </h2>
    <MarkDownContentList blogs={blogs} blogIdToMetadata={blogIdToMetadata} />
  </div>
);

export default FeaturedSection;
