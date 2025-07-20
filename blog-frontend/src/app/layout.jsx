import "./globals.css";
import "animate.css";
import { Inter } from "next/font/google";
import Header from "../components/organisms/header/header";
import ThemeProvider from "../components/utils/themeProvider";
import Footer from "../components/organisms/footer/footer";
import HeadContent from "./headContent";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
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
