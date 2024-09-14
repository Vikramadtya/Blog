import React from "react";
import Tag from "@/components/atom/tag";

const LatestPost = ({ title, description, tags, slug, previewImageSrc }) => {
  const tagsComponent = tags.map((tag) => (
    <Tag key={tag.id} text={tag.name} color={tag.color} />
  ));
  return (
    <>
      <div className="flex w-full justify-between md:flex-row">
        <div className="flex flex-col gap-4 md:w-[50%]">
          <div className="flex items-center">
            <h1 className="mr-4 text-xl font-bold tracking-widest">Latest</h1>
            <div className="flex-grow">
              <hr className="border-gray-300 dark:border-gray-700" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <a href={`/blogs/${slug}`}>
              <h1 className="text-2xl font-bold leading-[1.1] tracking-wider md:text-[40px]">
                {title}
              </h1>
            </a>

            <p className="text-muted-foreground">{description}</p>
            <div className="flex flex-wrap gap-2"></div>
          </div>
          <div className="flex flex-wrap gap-1">{...tagsComponent}</div>
        </div>
        <div className="flex hidden justify-center md:block">
          <div className="p-2 pt-5">
            <img
              src={previewImageSrc}
              alt="John image"
              className="w-fit rounded-md"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestPost;
