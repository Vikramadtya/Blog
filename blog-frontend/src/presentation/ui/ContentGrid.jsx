import React from "react";
import Card from "@/presentation/ui/Card";

const ContentGrid = ({ blogs, blogIdToMetadata, seriesParentSlugs = new Set() }) => {
  return (
    <ul className="grid w-full grid-cols-1 items-start gap-6 pb-16 pt-16 md:grid-cols-2 xl:grid-cols-3">
      {blogs.map((blog) => (
        <li key={blog.id}>
          <Card
            blog={blog}
            title={blog.title}
            description={blog.description}
            tags={blog.tags}
            slug={blog.slug}
            permalink={blog.permalink || blog.slug}
            publish={blog.publish}
            date={blog.createdAt}
            likes={blogIdToMetadata[blog.id]?.likes || 0}
            views={blogIdToMetadata[blog.id]?.views || 0}
            id={blog.id}
            blogNumber={blog.blogNumber}
            previewImageSrc={blog.previewImageSrc}
            readingTime={blog.readingTime}
            isSeries={seriesParentSlugs.has(blog.slug)}
          />
        </li>
      ))}
    </ul>
  );
};

export default ContentGrid;
