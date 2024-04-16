import { siteMetadata } from "@/MetaData";

export const navLinks = [
  { key: 1, href: "/blogs", title: "All Posts", shortcut: "⌘+B" },
  { key: 2, href: "/tags", title: "Tags", shortcut: "⌘+B" },
  {
    key: 3,
    href: siteMetadata.portfolioLink,
    title: "Author",
    shortcut: "⌘+B",
  },
];

export const dropDownMenuNavLinks = [
  { key: 1, href: "/", title: "Home", icon: "home", shortcut: "⌘+H" },
  {
    key: 2,
    href: siteMetadata.blogLink,
    title: "All Posts",
    icon: "home",
    shortcut: "⌘+B",
  },
  {
    key: 3,
    href: siteMetadata.blogLink,
    title: "Tags",
    icon: "home",
    shortcut: "⌘+B",
  },
  { key: 4, href: "", title: "", icon: "", shortcut: "" },
  {
    key: 5,
    href: siteMetadata.blogLink,
    title: "Author",
    icon: "home",
    shortcut: "⌘+B",
  },
];
