import React from "react";

import { getAllBlogs, getAllTags } from "../../services/apiServices";
import TagBasedList from "./components/molecules/tagBasedList";
import { getTagToBlogMap } from "../../services/blogServices";

export default async function Tags() {
  const tags = await getAllTags();
  const tagToMetadataBlog = await getTagToBlogMap(tags);
  const allBlogs = tagToMetadataBlog["00000000-0000-0000-0000-000000000000"];

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
