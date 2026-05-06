import React from "react";
import Card from "@/components/atoms/Card";

const MarkdownContentList = ({ blogs, blogIdToMetadata }) => {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-6 pb-16 pt-16 md:grid-cols-2 xl:grid-cols-3">
      {blogs.map((blog) => (
        <Card
          key={blog.id}
          title={blog.title}
          description={blog.description}
          tags={blog.tags}
          slug={blog.slug}
          date={blog.createdAt}
          likes={blogIdToMetadata[blog.id]?.likes || 0}
          views={blogIdToMetadata[blog.id]?.views || 0}
          id={blog.id}
          blogNumber={blog.blogNumber}
          previewImageSrc={blog.previewImageSrc}
        />
      ))}
    </div>
  );
};

export default MarkdownContentList;
