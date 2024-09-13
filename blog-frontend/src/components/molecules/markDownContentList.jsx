import Card from "../atom/card";
import React from "react";

const MarkDownContentList = ({ blogs }) => {
  return (
    <>
      <div className="w-full columns-1 pb-32 pt-32 md:columns-2  xl:columns-3">
        {blogs.map((blog) => (
          <Card
            title={blog.title}
            description={blog.description}
            tags={blog.tags}
            slug={blog.slug}
            key={blog.id}
            date={blog.createdAt}
          />
        ))}
      </div>
    </>
  );
};

export default MarkDownContentList;
