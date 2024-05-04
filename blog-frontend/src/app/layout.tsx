import "./globals.css";

import type { Metadata } from "next";

import "animate.css";
import { Inter } from "next/font/google";

import Header from "@/components/organisms/header/header";
import ThemeProvider from "@/components/utils/themeProvider";
import Footer from "@/components/organisms/footer/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neural cook",
  description: "A blog by vikramaditya singh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="apple-mobile-web-app-title" content="Neural Cook" />
        <meta name="application-name" content="Neural Cook" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <script
          defer
          src="https://eu.umami.is/script.js"
          data-website-id="2d0c15ba-afa2-4213-960b-763c2285f1ee"
        />
      </head>
      <body className={inter.className}>
        <div className="flex h-screen flex-col justify-between">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
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
