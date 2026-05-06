import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

import { Separator } from "@/components/atoms/Separator";
import BlogHero from "@/components/molecules/BlogHero";
import Comments from "@/components/atoms/Comment";
import Doodle from "@/components/atoms/Doodle";
import StickyBar from "@/components/atoms/StickyBar";
import ScrollProgressBar from "@/components/atoms/ScrollPercentageBar";
import ShareBar from "@/components/atoms/ShareBar";

import { useMDXComponents } from "@/components/atoms/MdxComponents";
import { prettyCodeOptions } from "@/utils/markdownConstants";
import {
  getBlogBySlug,
  getAllBlogs,
  getBlogContent,
} from "@/lib/server/blog";
import { BLOG_TYPES } from "@/lib/constants";
import { getBlogToc } from "@/lib/server/blog";
import { siteMetadata } from "../../../../site.config.mjs";

// Static params for SSG
export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

// SEO metadata generation
export async function generateMetadata({ params }) {
  const blogData = await getBlogBySlug(params.slug);
  if (!blogData) return {};

  const publishedAt = new Date(blogData.createdAt).toISOString();
  const modifiedAt = new Date(blogData.updatedAt || blogData.createdAt).toISOString();

  return {
    title: blogData.title,
    description: blogData.description,
    openGraph: {
      title: blogData.title,
      description: blogData.description,
      url: `${siteMetadata.siteUrl}/blogs/${blogData.slug}`,
      siteName: siteMetadata.title,
      locale: siteMetadata.locale,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      images: [blogData.previewImageSrc || siteMetadata.socialBanner],
      authors: [siteMetadata.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blogData.title,
      description: blogData.description,
      images: [blogData.previewImageSrc || siteMetadata.socialBanner],
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/blogs/${blogData.slug}`,
    },
  };
}

// Main blog post page
export default async function Post({ params }) {
  const { slug } = params;

  const blogData = await getBlogBySlug(slug);
  const content = await getBlogContent(blogData.id);
  const tableOfContent = getBlogToc(content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogData.title,
    "image": blogData.previewImageSrc || siteMetadata.socialBanner,
    "datePublished": blogData.createdAt,
    "dateModified": blogData.updatedAt || blogData.createdAt,
    "author": [
      {
        "@type": "Person",
        "name": siteMetadata.author,
        "url": siteMetadata.portfolioLink,
      },
    ],
    "publisher": {
      "@type": "Organization",
      "name": siteMetadata.title,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteMetadata.siteUrl}/logo.png`,
      },
    },
    "description": blogData.description,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteMetadata.siteUrl}/blogs/${blogData.slug}`,
    },
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteMetadata.siteUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blogs",
        "item": `${siteMetadata.siteUrl}/blogs`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blogData.title,
        "item": `${siteMetadata.siteUrl}/blogs/${blogData.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
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
          shareUrl={`${siteMetadata.siteUrl}/blogs/${blogData.slug}`}
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
