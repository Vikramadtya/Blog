import { siteMetadata } from "@/MetaData";

export const navLinks = [
  { key: 1, href: "/blogs", title: "All Posts", shortcut: "⌘+B" },
  { key: 2, href: "/tags", title: "Tags", shortcut: "⌘+T" },
  {
    key: 3,
    href: "/books",
    title: "Books",
    shortcut: "⌘+K",
  },
  {
    key: 4,
    href: siteMetadata.portfolioLink,
    title: "Author",
    shortcut: "⌘+A",
  },
];

export const dropDownMenuNavLinks = [
  { key: 1, href: "/", title: "Home", icon: "home", shortcut: "⌘+H" },
  {
    key: 2,
    href: "/blogs",
    title: "All Posts",
    icon: "all",
    shortcut: "⌘+B",
  },
  {
    key: 3,
    href: "/tags",
    title: "Tags",
    icon: "tag",
    shortcut: "⌘+T",
  },
  {
    key: 4,
    href: "/books",
    title: "Books",
    icon: "book",
    shortcut: "⌘+K",
  },
  { key: 5, href: "", title: "", icon: "", shortcut: "" },
  {
    key: 6,
    href: siteMetadata.portfolioLink,
    title: "Author",
    icon: "me",
    shortcut: "⌘+A",
  },
];
