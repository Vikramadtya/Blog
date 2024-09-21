"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import Tag from "../atom/tag";

const TagBasedList = ({ tags, tagToMetadataBlog, allBlogs }) => {
  const [blogs, setBlogs] = useState(allBlogs);
  const [activeButton, setActiveButton] = useState(0);
  console.log(tags);
  const tagsComponent = [];
  tagsComponent.push(
    ...tags.map((tag) => (
      <button
        key={tag.id}
        type="button"
        className={`mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium hover:bg-blue-800  dark:bg-blue-600 dark:hover:bg-blue-700 ${activeButton === tag.id ? "text-black outline-none ring-4 ring-blue-500 dark:ring-blue-800" : "text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"}`}
        onClick={() => {
          setBlogs(tagToMetadataBlog[tag.id]);
          setActiveButton(tag.id);
        }}
        style={{
          backgroundColor: `${activeButton === tag.id ? "#ecf0f1" : tag.color}`,
        }}
      >
        <span>{tag.name.split(" ").join("-") + " | " + tag.count}</span>
      </button>
    )),
  );

  const blogComponent = blogs.map((blog) => {
    const tagComponents = blog.tags.map((tag) => (
      <Tag key={tag.id} text={tag.name} color={tag.color} />
    ));
    return (
      <li key={blog.id} className="mb-10 ms-4 ">
        <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
        <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
          {dayjs(blog.createdAt).format("MMMM D, YYYY")}
        </time>
        <div className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {blog.title}
            </h3>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              {blog.description}
            </p>
            <div className="flex flex-wrap gap-1 pb-4">{...tagComponents}</div>

            <a
              href={`/blogs/${blog.slug}`}
              className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Read the blog{" "}
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
                src={blog.previewImageSrc}
                alt="John image"
                className="h-48 w-96 rounded-md object-cover"
              />
            </div>
          </div>
        </div>
      </li>
    );
  });

  return (
    <>
      <div className="md:mx-auto md:px-20">
        <div className="flex flex-wrap gap-5">{tagsComponent}</div>
      </div>

      <ol className="relative border-s border-gray-200 dark:border-gray-700 ">
        {blogComponent}
      </ol>
    </>
  );
};

export default TagBasedList;
