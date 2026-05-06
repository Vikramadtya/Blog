import "./globals.css";
// import "animate.css";
// import { Inter } from "next/font/google";
import Header from "@/components/organisms/header/Header";
import ThemeProvider from "@/components/utils/themeProvider";
import Footer from "@/components/organisms/footer/Footer";
import { siteMetadata } from "../../site.config";

const inter = { className: "font-sans" }; // Fallback for offline build

export const metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  keywords: ["Next.js", "Tailwind CSS", "Blog", "Neural Cook", "Software Engineering"],
  authors: [{ name: siteMetadata.author, url: siteMetadata.portfolioLink }],
  creator: siteMetadata.author,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [
      {
        url: siteMetadata.socialBanner,
        width: 1200,
        height: 630,
        alt: siteMetadata.title,
      },
    ],
    locale: siteMetadata.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.socialBanner],
    creator: "@Twitter", // Fallback if not in siteMetadata
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
    types: {
      "application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang={siteMetadata.language || "en"} suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col justify-between">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="mb-auto">{children}</main>
            <Footer />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
