import React from "react";

import InDevelopment from "../../components/molecules/inDevelopment";
import Tag from "../../components/atom/tag";
import {
  getAllBlogs,
  getAllTags,
  getTagsToBlogs,
} from "../../services/apiServices";
import Link from "next/link";
import TagBasedList from "../../components/molecules/tagBasedList";

export default async function Blog() {
  const tags = await getAllTags();
  const tagToMetadataBlog = await getTagsToBlogs();
  const allBlogs = await getAllBlogs();

  return (
    <main className="flex flex-col items-center justify-between px-12 md:px-24 lg:px-32 xl:px-48">
      <div className="mt-4 flex w-full flex-col gap-10 p-4 md:mt-8">
        <div className="flex flex-col items-start justify-center gap-8 md:items-center">
          <h1 className="text-4xl font-bold tracking-widest">Tags</h1>
          <div />
        </div>

        <TagBasedList
          tags={tags}
          tagToMetadataBlog={tagToMetadataBlog}
          allBlogs={allBlogs}
        />
      </div>
    </main>
  );
}
