import React from "react";

import fs from "fs";
import path from "path";
import matter from "gray-matter";

import MarkDownContentList from "../../components/molecules/markDownContentList";
import { getBlogsMetaDataFromRemote } from "../../services/blogService";

export default async function Blog() {
  const blogs = await getBlogsMetaDataFromRemote();

  return (
    <main className="flex flex-col items-center justify-between px-12 md:px-24 lg:px-32 xl:px-48">
      <div className="w-full space-y-2 pb-8 pt-6 md:space-y-5 ">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-relaxed dark:text-gray-100">
          Blogs
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          I invite you to click on each project to learn more about its
          objectives, technologies used, and my role in its development. Feel
          free to reach out if you have any questions or would like to discuss
          these projects in more detail. Thank you for taking the time to
          explore my work!
        </p>
      </div>
      <MarkDownContentList blogs={blogs} />
    </main>
  );
}
