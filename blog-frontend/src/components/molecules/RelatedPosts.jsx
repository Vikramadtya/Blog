import React from "react";
import Card from "../atoms/Card";

const RelatedPosts = ({ currentSlug, currentTags, allBlogs }) => {
  const currentTagNames = currentTags.map(t => (typeof t === "string" ? t : t.name).toLowerCase());
  
  const related = allBlogs
    .filter(blog => blog.slug !== currentSlug) // Exclude current
    .map(blog => {
      const blogTags = blog.tags.map(t => (typeof t === "string" ? t : t.name).toLowerCase());
      const intersection = blogTags.filter(t => currentTagNames.includes(t));
      return { ...blog, score: intersection.length };
    })
    .filter(blog => blog.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (related.length === 0) return null;

  return (
    <section className="mt-20 border-t pt-10">
      <h2 className="mb-8 text-2xl font-bold tracking-tight">You Might Also Like</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {related.map((blog) => (
          <Card key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
