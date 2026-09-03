import { MDXRemote } from "next-mdx-remote/rsc";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { Separator } from "@/presentation/ui/Separator";
import BlogHero from "@/presentation/blog/BlogHero";
import CommentsSection from "@/presentation/blog/CommentsSection";
import Doodle from "@/presentation/ui/Doodle";
import StickyBar from "@/presentation/layout/StickyBar";
import ScrollProgressBar from "@/presentation/ui/ScrollPercentageBar";
import ShareBar from "@/presentation/blog/ShareBar";
import RelatedPosts from "@/presentation/blog/RelatedPosts";
import AuthorBio from "@/presentation/blog/AuthorBio";
import NewsletterForm from "@/presentation/blog/NewsletterForm";

import { getMDXComponents } from "@/presentation/ui/MdxComponents";
import { prettyCodeOptions } from "@/lib/markdownConstants";
import { blogService } from "@/core";
import { BLOG_TYPES } from "@/lib/constants";
import { siteMetadata } from "../../../../site.config.mjs";
import SeriesNavigation from "@/presentation/blog/SeriesNavigation";

// Static params for SSG
export async function generateStaticParams() {
  const blogs = await blogService.getAllPosts();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

// SEO metadata generation
export async function generateMetadata({ params }) {
  const blogData = await blogService.getPostBySlug(params.slug);
  if (!blogData) return {};

  // Use dynamic OG if preview is missing
  const ogImageUrl = blogData.previewImageSrc 
    ? `${siteMetadata.siteUrl}${blogData.previewImageSrc}`
    : `${siteMetadata.siteUrl}/api/og?title=${encodeURIComponent(blogData.title)}&readingTime=${encodeURIComponent(blogData.readingTime)}`;

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
      publishedTime: new Date(blogData.createdAt).toISOString(),
      modifiedTime: new Date(blogData.updatedAt || blogData.createdAt).toISOString(),
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
      canonical: `${siteMetadata.siteUrl}/blogs/${blogData.slug}`,
    },
  };
}

import { BlogMetricsProvider } from "@/presentation/providers/BlogMetricsProvider";

// Main blog post page
export default async function Post({ params }) {
  const { slug } = params;

  const blogData = await blogService.getPostBySlug(slug);
  if (!blogData) return null;
  
  const parentSeriesSlug = blogData.series || blogData.slug;
  const seriesChildren = await (await blogService.getAllPosts()).filter(p => p.series === parentSeriesSlug).sort((a,b) => a.seriesOrder - b.seriesOrder);
  const isSeries = seriesChildren.length > 0;
  const seriesParentData = isSeries ? await blogService.getPostBySlug(parentSeriesSlug) : null;

  const [content, allBlogsData] = await Promise.all([
    blogData.content,
    blogService.getAllPosts(),
  ]);
  const tableOfContent = null /* TOC is now handled differently or we can extract it on the client */;

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
    wordCount: content.split(/\s+/).length,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteMetadata.siteUrl}/blogs/${blogData.slug}`,
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
        item: `${siteMetadata.siteUrl}/blogs/${blogData.slug}`,
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

      <article className="relative mx-auto max-w-5xl px-6 py-12 md:px-12 lg:px-20">
        {/* Cover Image */}
        {blogData.previewImageSrc && (
          <div className="mb-12 w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
<img 
              src={blogData.previewImageSrc} 
              alt={blogData.title}
              className="w-full object-cover"
              style={{ maxHeight: '500px' }}
            />
          </div>
        )}

        {/* Hero */}
        <BlogHero
          title={blogData.title}
          tags={blogData.tags}
          date={blogData.createdAt}
          readingTime={blogData.readingTime}
        />

        <Separator className="my-16" />

        {isSeries && (
          <SeriesNavigation 
            parent={seriesParentData} 
            seriesParts={seriesChildren} 
            currentSlug={slug} 
          />
        )}

        {/* Blog Content */}
        <section className="mx-auto w-full max-w-[65ch] prose prose-sm prose-neutral dark:prose-invert md:prose-base lg:prose-lg">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                remarkPlugins: [],
                rehypePlugins: [
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

        <AuthorBio />

        {/* Sticky TOC / Like-Share bar */}
        <StickyBar blogSlug={blogData.slug} title={blogData.title} tableOfContent={tableOfContent} />

        {/* Related Posts */}
        <RelatedPosts
          currentSlug={blogData.slug}
          currentTags={blogData.tags}
          allBlogs={allBlogsData}
        />

        <Separator className="my-16" />

        <NewsletterForm />

        {/* Share Bar */}
        {siteMetadata.features.socialShare && (
          <ShareBar
            className="mb-10"
            shareUrl={`${siteMetadata.siteUrl}/blogs/${blogData.slug}`}
            title={blogData.title}
          />
        )}

        {/* Fun Footer */}
        <div className="flex flex-col space-y-6">
          <div className="flex justify-center">
            <Doodle classData="h-20 w-20" />
          </div>
          <CommentsSection blogId={blogData.slug} />
        </div>
      </article>
    </BlogMetricsProvider>
  );
}
