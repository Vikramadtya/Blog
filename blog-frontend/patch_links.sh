# In sitemap.js
sed -i '' -e 's/url: `${siteMetadata.siteUrl}\/blogs\/${blog.slug}`,/url: `${siteMetadata.siteUrl}\/blogs\/${blog.permalink}`,/' src/app/sitemap.js

# In feed.xml
sed -i '' -e 's/const url = `${siteMetadata.siteUrl}\/blogs\/${blog.slug}`;/const url = `${siteMetadata.siteUrl}\/blogs\/${blog.permalink}`;/' src/app/feed.xml/route.js

# In page.js (blog page)
# We also need to extract params.slug properly
sed -i '' -e 's/const { slug } = params;/const { slug: slugParam } = params;\n  const slug = Array.isArray(slugParam) ? slugParam[slugParam.length - 1] : slugParam;/' src/app/blogs/\[...slug\]/page.js
sed -i '' -e 's/generateMetadata({ params, searchParams }) {/generateMetadata({ params, searchParams }) {\n  const slugParam = params.slug;\n  const slug = Array.isArray(slugParam) ? slugParam[slugParam.length - 1] : slugParam;/' src/app/blogs/\[...slug\]/page.js
sed -i '' -e 's/const blogData = await blogService.getPostBySlug(params.slug, { includeUnpublished: isPreview });/const blogData = await blogService.getPostBySlug(slug, { includeUnpublished: isPreview });/' src/app/blogs/\[...slug\]/page.js

# Update all blogData.slug in page.js to blogData.permalink for URLs
sed -i '' -e 's/\/blogs\/${blogData.slug}/\/blogs\/${blogData.permalink}/g' src/app/blogs/\[...slug\]/page.js

# Change generateStaticParams to return array
sed -i '' -e 's/return blogs.map((blog) => ({ slug: blog.slug }));/return blogs.map((blog) => ({ slug: blog.permalink.split("\/") }));/' src/app/blogs/\[...slug\]/page.js

# Note: StickyBar expects blogSlug={blogData.slug}, CommentsSection expects blogId={blogData.slug}. Those can stay as the base slug or we can use permalink. The user can keep them as base slug since it's used for IDs, not routing. Wait, for StickyBar, blogSlug is used for Share button! So StickyBar should get blogData.permalink!
sed -i '' -e 's/blogSlug={blogData.slug}/blogSlug={blogData.permalink}/g' src/app/blogs/\[...slug\]/page.js

# In admin/page.jsx
sed -i '' -e 's/href={`\/blogs\/${post.slug}?preview=true`}/href={`\/blogs\/${post.permalink}?preview=true`}/' src/app/admin/page.jsx

# In api/admin/newsletter
sed -i '' -e 's/const postUrl = `${siteMetadata.siteUrl}\/blogs\/${blog.slug}`;/const postUrl = `${siteMetadata.siteUrl}\/blogs\/${blog.permalink}`;/' src/app/api/admin/newsletter/route.js

# In Card.jsx
sed -i '' -e 's/href={`\/blogs\/${slug}`} passHref/href={`\/blogs\/${item.permalink || slug}`} passHref/' src/presentation/ui/Card.jsx
# Wait, Card.jsx uses `slug`, let's check it.
