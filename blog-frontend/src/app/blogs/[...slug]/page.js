import { MDXRemote } from "next-mdx-remote/rsc";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Link from "next/link";
import dayjs from "dayjs";
import { notFound } from "next/navigation";

import { Separator } from "@/presentation/ui/Separator";
import CommentsSection from "@/presentation/blog/CommentsSection";
import Doodle from "@/presentation/ui/Doodle";
import ScrollProgressBar from "@/presentation/ui/ScrollPercentageBar";
import ShareBar from "@/presentation/blog/ShareBar";
import RelatedPosts from "@/presentation/blog/RelatedPosts";
import AuthorBio from "@/presentation/blog/AuthorBio";
import NewsletterForm from "@/presentation/blog/NewsletterForm";
import SeriesNavigation from "@/presentation/blog/SeriesNavigation";
import BlogPostLayout from "@/presentation/blog/BlogPostLayout";
import BlogReadingNavigation from "@/presentation/blog/BlogReadingNavigation";

import { getMDXComponents } from "@/presentation/ui/MdxComponents";
import { prettyCodeOptions } from "@/lib/markdownConstants";
import { blogService } from "@/core";
import { siteMetadata } from "../../../../site.config.mjs";
import { buildBlogIndexData } from "@/lib/blogCategories";
import { BlogMetricsProvider } from "@/presentation/providers/BlogMetricsProvider";

function extractHeadings(markdown) {
  if (!markdown) return [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const text = rawText
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "");
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ level, text, id });
  }
  return headings;
}

// Static params for SSG
export async function generateStaticParams() {
  const blogs = await blogService.getAllPosts();
  return blogs.map((blog) => ({ slug: blog.permalink.split("/") }));
}

// SEO metadata generation
export async function generateMetadata({ params, searchParams }) {
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam.join("/") : slugParam;
  const isPreview = searchParams?.preview === "true";
  const blogData = await blogService.getPostBySlug(slug, {
    includeUnpublished: isPreview,
  });
  if (!blogData) return {};

  const ogImageUrl = blogData.previewImageSrc
    ? `${siteMetadata.siteUrl}${blogData.previewImageSrc}`
    : `${siteMetadata.siteUrl}/api/og?title=${encodeURIComponent(
        blogData.title
      )}&readingTime=${encodeURIComponent(blogData.readingTime)}`;

  return {
    title: blogData.title,
    description: blogData.description,
    openGraph: {
      title: blogData.title,
      description: blogData.description,
      url: `${siteMetadata.siteUrl}/blogs/${blogData.permalink}`,
      siteName: siteMetadata.title,
      locale: siteMetadata.locale,
      type: "article",
      publishedTime: new Date(blogData.createdAt).toISOString(),
      modifiedTime: new Date(
        blogData.updatedAt || blogData.createdAt
      ).toISOString(),
      images: [{ url: ogImageUrl }],
      authors: [siteMetadata.author],
    },
    twitter: {
      card: "summary_large_image",
      title: blogData.title,
      description: blogData.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/blogs/${blogData.permalink}`,
    },
  };
}

export default async function Post({ params, searchParams }) {
  const { slug: slugParam } = params;
  const slug = Array.isArray(slugParam) ? slugParam.join("/") : slugParam;
  const isPreview = searchParams?.preview === "true";

  const blogData = await blogService.getPostBySlug(slug, {
    includeUnpublished: isPreview,
  });
  if (!blogData) notFound();

  const isDev = process.env.NODE_ENV === "development";
  const allBlogsData = await blogService.getAllPosts({
    includeUnpublished: isDev || isPreview,
  });

  const parentSeriesSlug = blogData.series || blogData.slug;
  const seriesChildren = allBlogsData
    .filter((p) => p.series === parentSeriesSlug)
    .sort((a, b) => (Number(a.seriesOrder) || 0) - (Number(b.seriesOrder) || 0));

  const isSeries = seriesChildren.length > 0;
  let seriesParentData = null;
  if (isSeries) {
    try {
      seriesParentData = await blogService.getPostBySlug(parentSeriesSlug);
    } catch (e) {
      console.warn("Failed to fetch series parent:", e);
    }
  }

  // Build ordered series list to compute series position and next/prev
  let seriesAllParts = [];
  let currentPartIndex = -1;
  if (seriesParentData || isSeries) {
    const parentObj = seriesParentData || (blogData.series ? null : blogData);
    if (parentObj) {
      seriesAllParts = [parentObj, ...seriesChildren];
      currentPartIndex = seriesAllParts.findIndex(
        (p) => p.slug === blogData.slug
      );
    }
  }

  // Determine previous and next posts
  let prevPost = null;
  let nextPost = null;
  if (seriesAllParts.length > 1 && currentPartIndex !== -1) {
    prevPost = seriesAllParts[currentPartIndex - 1] || null;
    nextPost = seriesAllParts[currentPartIndex + 1] || null;
  } else {
    const currentIndex = allBlogsData.findIndex(
      (p) => p.slug === blogData.slug
    );
    if (currentIndex !== -1) {
      prevPost = allBlogsData[currentIndex - 1] || null;
      nextPost = allBlogsData[currentIndex + 1] || null;
    }
  }

  const { categories } = buildBlogIndexData(allBlogsData);
  const headings = extractHeadings(blogData.content);
  const formattedDate = blogData.createdAt
    ? dayjs(blogData.createdAt).format("MMMM YYYY")
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogData.title,
    image: blogData.previewImageSrc || siteMetadata.socialBanner,
    datePublished: blogData.createdAt,
    dateModified: blogData.updatedAt || blogData.createdAt,
    author: [
      {
        "@type": "Person",
        name: siteMetadata.author,
        url: siteMetadata.portfolioLink,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: siteMetadata.title,
      logo: {
        "@type": "ImageObject",
        url: `${siteMetadata.siteUrl}/logo.png`,
      },
    },
    description: blogData.description,
    keywords: blogData.tags
      .map((t) => (typeof t === "string" ? t : t.name))
      .join(", "),
    wordCount: (blogData.content || "").split(/\s+/).length,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteMetadata.siteUrl}/blogs/${blogData.permalink}`,
    },
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteMetadata.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blogs",
        item: `${siteMetadata.siteUrl}/blogs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blogData.title,
        item: `${siteMetadata.siteUrl}/blogs/${blogData.permalink}`,
      },
    ],
  };

  return (
    <BlogMetricsProvider
      id={blogData.id}
      initialLikes={blogData.likes}
      initialViews={blogData.views}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <ScrollProgressBar />

      <BlogPostLayout
        categories={categories}
        tableOfContents={headings}
        currentSlug={blogData.slug}
      >
        <article className="blog-post-content learning-note">
          {/* Back link */}
          <Link href="/blogs" className="back-to-blog">
            &larr; All posts
          </Link>

          {/* Series Navigation Breadcrumb */}
          {seriesParentData && (
            <div className="post-series-nav">
              <Link href={`/blogs/${seriesParentData.permalink || seriesParentData.slug}`}>
                {seriesParentData.title}
              </Link>
              <span>&middot;</span>
              <span>
                {currentPartIndex > 0
                  ? `Part ${currentPartIndex + 1}: ${blogData.title}`
                  : "Overview"}
              </span>
            </div>
          )}

          {/* Article Header */}
          <h1>{blogData.title}</h1>
          <p className="post-meta">
            {formattedDate && <span>{formattedDate} &middot; </span>}
            <span>{blogData.readingTime || "5 min read"}</span>
          </p>

          {/* Cover Image */}
          {blogData.previewImageSrc && (
            <div className="mb-10 w-full overflow-hidden rounded-xl border border-line bg-card shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blogData.previewImageSrc}
                alt={blogData.title}
                className="w-full object-cover max-h-[480px]"
              />
            </div>
          )}

          {/* Series Overview Callout / Links if this is a series parent */}
          {isSeries && (
            <div className="mb-10">
              <SeriesNavigation
                parent={seriesParentData || blogData}
                seriesParts={seriesChildren}
                currentSlug={slug}
              />
            </div>
          )}

          {/* Blog Content */}
          <section className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRemote
              source={blogData.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkMath],
                  rehypePlugins: [
                    rehypeKatex,
                    rehypeSlug,
                    [
                      rehypeAutolinkHeadings,
                      {
                        properties: {
                          className: ["anchor"],
                          ariaLabel: "Link to section",
                        },
                      },
                    ],
                    [rehypePrettyCode, prettyCodeOptions],
                  ],
                },
              }}
              components={getMDXComponents()}
            />
          </section>

          {/* Previous / Next Post Navigation */}
          <BlogReadingNavigation prevPost={prevPost} nextPost={nextPost} />

          <Separator className="my-14" />

          {/* Author Bio */}
          <AuthorBio />

          {/* Related Posts */}
          <RelatedPosts
            currentSlug={blogData.slug}
            currentTags={blogData.tags}
            allBlogs={allBlogsData}
          />

          <Separator className="my-14" />

          {/* Newsletter Form */}
          <NewsletterForm />

          {/* Share Bar */}
          {siteMetadata.features?.socialShare && (
            <ShareBar
              className="my-10"
              shareUrl={`${siteMetadata.siteUrl}/blogs/${blogData.permalink}`}
              title={blogData.title}
            />
          )}

          {/* Comments Section */}
          <div className="flex flex-col space-y-6 pt-6">
            <div className="flex justify-center">
              <Doodle classData="h-16 w-16" />
            </div>
            <CommentsSection blogId={blogData.slug} />
          </div>
        </article>
      </BlogPostLayout>
    </BlogMetricsProvider>
  );
}
