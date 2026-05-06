import site from "./config/site.json" with { type: "json" };

export const siteMetadata = {
  ...site,
  // Site paths & identification
  siteRepo: site.siteRepo || "https://github.com/Vikramadtya/Blog",
  localBlogDatastorePath: "./blog-datastore/blogs",
  
  // Feature Flags
  firebaseEnabled: !!(
    process.env.FIREBASE_CONFIG_API_KEY &&
    process.env.FIREBASE_CONFIG_PROJECT_ID &&
    process.env.FIREBASE_CONFIG_APP_ID
  ),

  // Display settings
  postDateTemplate: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },

  // Refined Giscus configuration
  giscus: {
    enabled: !!site.giscus?.repo,
    ...site.giscus,
    mapping: site.giscus?.mapping || "pathname",
    strict: site.giscus?.strict || "0",
    reactionsEnabled: site.giscus?.reactionsEnabled || "1",
    emitMetadata: site.giscus?.emitMetadata || "0",
    inputPosition: site.giscus?.inputPosition || "top",
    theme: site.giscus?.theme || "light",
    lang: site.giscus?.lang || "en",
    loading: site.giscus?.loading || "lazy",
  },

  // Analytics configuration
  analytics: {
    enabled: !!site.analytics?.umamiWebsiteId,
    ...site.analytics,
  },
};
