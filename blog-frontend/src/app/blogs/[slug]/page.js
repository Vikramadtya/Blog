import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

import { Separator } from "../../../components/atom/separator";
import BlogHero from "../../../components/molecules/blogHero";
import { prettyCodeOptions } from "../../../utils/markdownConstants";
import Comments from "../../../components/atom/comment";
import Doodle from "../../../components/atom/doodle";
import StickyBar from "../../../components/atom/stickyBar";
import ScrollProgressBar from "../../../components/atom/scrollPercentageBar";
import {
  getBlogContent,
  getAllBlogs,
  getBlogBySlug,
  getMetadata,
  getMetadataDuringBuild,
} from "../../../services/apiServices";
import { useMDXComponents } from "../../../mdx-components";

export async function generateStaticParams() {
  const blogs = await getAllBlogs();

  return blogs.map((blog) => blog.slug);
}

export async function generateMetadata({ params }) {
  const { slug } = params;

  const metadata = await getBlogBySlug(slug);

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function Post({ params }) {
  const { slug } = params;

  const blogData = await getBlogBySlug(slug);
  const metaData = await getMetadataDuringBuild(blogData[0].id);
  const content = await getBlogContent(blogData[0].id);

  return (
    <>
      <ScrollProgressBar />
      <article className="prose prose-sm mx-auto  pb-20 pt-20 md:prose-base lg:prose-lg ">
        <BlogHero
          blogId={blogData[0].id}
          title={blogData[0].title}
          tags={blogData[0].tags}
          date={blogData[0].createdAt}
          views={metaData[0].views}
          likes={metaData[0].likes}
        />
        <Separator className="mb-20 mt-20" />
        <div className="dark:text-gray-50">
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
            co
          />
        </div>

        <StickyBar blogId={blogData[0].id} blogSlug={blogData[0].slug} />

        <Separator className="mb-20 mt-20" />

        <div className="flex items-center justify-center">
          <Doodle classData={"h-20 w-20"} />
        </div>
        <div className="flex items-center justify-center">
          <Comments />
        </div>
      </article>
    </>
  );
}
