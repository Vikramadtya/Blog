import path from "path";
import { fileURLToPath } from "url";
import { siteMetadata } from "./site.config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: siteMetadata.hostname,
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/blogs",
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;
    config.module.exprContextCritical = false;

    return config;
  },
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../"),
  outputFileTracingIncludes: {
    "/*": ["../blog-datastore/**/*"],
    "/api/**/*": ["../blog-datastore/**/*"],
    "/blogs/**/*": ["../blog-datastore/**/*"],
    "/notes/**/*": ["../blog-datastore/**/*"],
    "/admin/**/*": ["../blog-datastore/**/*"],
  },
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@swc/core-linux-x64-gnu",
      "node_modules/@swc/core-linux-x64-musl",
      ".next/cache/**/*",
      "public/images/**/*",
    ],
  },
  serverExternalPackages: ["shiki", "rehype-pretty-code", "gray-matter"],
};

export default nextConfig;
