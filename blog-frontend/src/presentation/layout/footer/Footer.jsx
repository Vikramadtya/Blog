import Link from "next/link";
import SocialIcon from "@/presentation/ui/SocialIcon";
import BuildWith from "@/presentation/blog/BuildWith";
import Logo from "@/presentation/ui/Logo";
import { siteMetadata } from "../../../../site.config.mjs";
const { content } = siteMetadata;

const EXPLORE = [
  { href: "/blogs", label: "All posts" },
  { href: "/notes", label: "Notes" },
  { href: "/snippets", label: "Snippets" },
  { href: "/tags", label: "Tags" },
  { href: "/feed.xml", label: "RSS feed" },
];

const SOCIALS = [
  ["instagram", siteMetadata.instagram],
  ["twitter", siteMetadata.twitter],
  ["facebook", siteMetadata.facebook],
  ["youtube", siteMetadata.youtube],
  ["linkedin", siteMetadata.linkedin],
  ["mail", siteMetadata.email && `mailto:${siteMetadata.email}`],
  ["github", siteMetadata.github],
].filter(([, href]) => href);

const Footer = () => {
  return (
    <footer className="relative z-10 mt-24 border-t border-border/70 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.6fr_1fr_1fr] md:px-10 lg:px-16">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-foreground"
          >
            <Logo size={40} />
            <span className="font-serif text-xl font-semibold tracking-wide">
              {siteMetadata.headerTitle || siteMetadata.author}
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {siteMetadata.description}
          </p>
        </div>

        <nav aria-label="Explore">
          <h2 className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-foreground">
            Explore
          </h2>
          <ul className="space-y-2.5 text-sm">
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-foreground">
            Connect
          </h2>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            {SOCIALS.map(([kind, href]) => (
              <SocialIcon key={kind} kind={kind} href={href} size={20} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-muted-foreground md:flex-row md:px-10 lg:px-16">
          <p>
            {`© ${new Date().getFullYear()} ${siteMetadata.title}. ${content.footer.copyrightText}`}
          </p>
          <BuildWith />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
