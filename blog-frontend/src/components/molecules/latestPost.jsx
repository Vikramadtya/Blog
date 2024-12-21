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
          <a
            href={`/blogs/${slug}`}
            className="mb-2 me-2 mt-2 inline-flex w-40 items-center rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            Read the blog
            <svg
              className="ms-2 h-3 w-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
        <div className="flex hidden justify-center md:block">
          <div className="p-2 pt-5">
            <img
              src={previewImageSrc}
              alt=""
              className="h-96 w-96 rounded-md"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestPost;
