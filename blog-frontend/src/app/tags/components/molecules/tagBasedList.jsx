"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import Tag from "../atoms/tag";

const TagBasedList = ({ tags, tagToMetadataBlog, allBlogs }) => {
  const [blogs, setBlogs] = useState(allBlogs);
  const [activeButton, setActiveButton] = useState(null);

  return (
    <>
      {/* Tag Filter Buttons */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => {
              setBlogs(tagToMetadataBlog[tag.id]);
              setActiveButton(tag.id);
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 ${
              activeButton === tag.id
                ? "bg-gray-100 text-black ring-4 ring-primary ring-offset-2 dark:ring-offset-gray-800"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            }`}
            style={{
              backgroundColor: activeButton === tag.id ? "#f0f0f0" : tag.color,
              color: activeButton === tag.id ? "#000" : "#fff",
            }}
          >
            {tag.name.replace(" ", "-")} | {tag.count}
          </button>
        ))}
      </div>

      {/* Blog List Timeline */}
      <ol className="relative ml-3 space-y-10 border-s border-gray-300 dark:border-gray-700">
        {blogs.map((blog) => (
          <li key={blog.id} className="ms-4">
            <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-300 dark:border-gray-900 dark:bg-gray-600"></div>

            <time className="text-sm text-gray-500 dark:text-gray-400">
              {dayjs(blog.createdAt).format("MMMM D, YYYY")}
            </time>

            <div className="mt-2 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {blog.title}
                </h3>
                <p className="mb-3 mt-1 text-gray-600 dark:text-gray-400">
                  {blog.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Tag key={tag.id} text={tag.name} color={tag.color} />
                  ))}
                </div>

                <a
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Read the blog →
                </a>
              </div>

              {blog.previewImageSrc && (
                <div className="hidden w-80 shrink-0 md:block">
                  <img
                    src={blog.previewImageSrc}
                    alt={blog.title}
                    className="h-44 w-full rounded-md object-cover shadow-sm"
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
};

export default TagBasedList;
