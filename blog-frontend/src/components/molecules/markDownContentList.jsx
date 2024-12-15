import Card from "../atom/card";
import React from "react";

const MarkDownContentList = ({ blogs, blogIdToMetadata }) => {
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-3 pb-32 pt-32 md:grid-cols-2  xl:grid-cols-3">
        {blogs.map((blog) => (
          <Card
            title={blog.title}
            description={blog.description}
            tags={blog.tags}
            slug={blog.slug}
            key={blog.id}
            date={blog.createdAt}
            likes={blogIdToMetadata[blog.id].likes}
            views={blogIdToMetadata[blog.id].views}
            id={blog.id}
            blogNumber={blog.blogNumber}
            previewImageSrc={blog.previewImageSrc}
          />
        ))}
      </div>
    </>
  );
};

export default MarkDownContentList;
