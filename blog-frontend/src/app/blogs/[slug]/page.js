import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getHighlighter } from "shiki";
import rehypeSlug from "rehype-slug";

import { Separator } from "../../../components/atom/separator";
import BlogHero from "../../../components/molecules/blogHero";
import { prettyCodeOptions } from "../../../utils/markdownConstants";
import {
  getBlogContent,
  getBlogMetaDataFromSlug,
  getBlogsMetaDataFromRemote,
} from "../../../services/blogService";
import Comments from "../../../components/atom/comment";
import Doodle from "../../../components/atom/doodle";
import StickyBar from "../../../components/atom/stickyBar";

export async function generateStaticParams() {
  const blogs = await getBlogsMetaDataFromRemote();

  return blogs.map((blog) => ({
    slug: blog.slug,
    id: blog.id,
    title: blog.title,
    description: blog.description,
  }));
}
export async function generateMetadata({ params }) {
  const { slug } = params;

  const metadata = await getBlogMetaDataFromSlug(slug);

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function Post({ params }) {
  const { slug } = params;

  const metadata = await getBlogMetaDataFromSlug(slug);

  const content = await getBlogContent(metadata.id);

  return (
    <article className="prose prose-sm mx-auto  pb-20 pt-20 md:prose-base lg:prose-lg ">
      <BlogHero
        title={metadata.title}
        tags={metadata.tags}
        date={metadata.createdAt}
      />
      <Separator className="mb-20 mt-20" />

      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
          },
        }}
      />
      <StickyBar />

      <Separator className="mb-20 mt-20" />

      <div className="flex items-center justify-center">
        <Doodle classData={"h-20 w-20"} />
      </div>
      <div className="flex items-center justify-center">
        <Comments />
      </div>
    </article>
  );
}
