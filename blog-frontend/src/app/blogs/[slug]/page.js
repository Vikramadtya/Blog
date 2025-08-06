import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

import { Separator } from "@/components/atom/separator";
import BlogHero from "./components/molecules/blogHero";
import Comments from "./components/atom/comment";
import Doodle from "./components/atom/doodle";
import StickyBar from "./components/atom/stickyBar";
import ScrollProgressBar from "./components/atom/scrollPercentageBar";
import ShareBar from "./components/atom/shareBar";

import { useMDXComponents } from "./components/atom/mdx-components";
import { prettyCodeOptions } from "../../../utils/markdownConstants";
import {
  getBlogContent,
  getAllBlogs,
  getBlogMetadataBySlug,
  getBlogMetadataById,
  getBlogMetadataByType,
  BLOG_TYPES,
} from "../../../services/apiServices";
import { getBlogToc } from "../../../services/blogServices";

// Static params for SSG
export async function generateStaticParams() {
  const blogs = await getBlogMetadataByType(BLOG_TYPES.blog);
  return blogs.map((blog) => blog.slug);
}

// SEO metadata generation
export async function generateMetadata({ params }) {
  const metadata = await getBlogMetadataBySlug(params.slug);
  return {
    title: metadata.title,
    description: metadata.description,
  };
}

// Main blog post page
export default async function Post({ params }) {
  const { slug } = params;

  const blogData = await getBlogMetadataBySlug(slug);
  const content = await getBlogContent(blogData.id);
  const tableOfContent = getBlogToc(content);

  return (
    <>
      <ScrollProgressBar />

      <article className="relative mx-auto max-w-5xl px-6 py-20 md:px-12 lg:px-20">
        {/* Hero */}
        <BlogHero
          blogId={blogData.id}
          title={blogData.title}
          tags={blogData.tags}
          date={blogData.createdAt}
          views={blogData.views}
          likes={blogData.likes}
        />

        <Separator className="my-16" />

        {/* Blog Content */}
        <section className="prose prose-sm prose-neutral dark:prose-invert md:prose-base lg:prose-lg">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                remarkPlugins: [],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypePrettyCode, prettyCodeOptions],
                ],
              },
            }}
            components={useMDXComponents()}
          />
        </section>

        {/* Sticky TOC / Like-Share bar */}
        <StickyBar
          blogId={blogData.id}
          blogSlug={blogData.slug}
          tableOfContent={tableOfContent}
        />

        <Separator className="my-16" />

        {/* Share Bar */}
        <ShareBar
          className="mb-10"
          shareUrl={`https://www.neuralcook.com/blogs/${blogData.slug}`}
          title={blogData.title}
        />

        {/* Fun Footer */}
        <div className="flex flex-col items-center space-y-6">
          <Doodle classData="h-20 w-20" />
          <Comments />
        </div>
      </article>
    </>
  );
}
