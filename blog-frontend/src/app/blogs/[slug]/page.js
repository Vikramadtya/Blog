import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
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
import ScrollProgressBar from "../../../components/atom/scrollPercentageBar";
import {
  getAllBlogsMetaData,
  getBlogMetaDataBySlug,
} from "../../../services/apiServices";

export async function generateStaticParams() {
  const blogs = await getAllBlogsMetaData();

  return blogs.map((blog) => blog.slug);
}

export async function generateMetadata({ params }) {
  const { slug } = params;

  const metadata = await getBlogMetaDataBySlug(slug);

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function Post({ params }) {
  const { slug } = params;

  const res = await getBlogMetaDataBySlug(slug);
  const metadata = await res.json();
  const content = await getBlogContent(metadata[0].id);
  return (
    <>
      <ScrollProgressBar />
      <article className="prose prose-sm mx-auto  pb-20 pt-20 md:prose-base lg:prose-lg ">
        <BlogHero
          blogId={metadata[0].id}
          title={metadata[0].title}
          tags={metadata[0].tags}
          date={metadata[0].createdAt}
        />
        <Separator className="mb-20 mt-20" />

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
        />
        <StickyBar blogId={metadata[0].id} />

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
