import Link from "next/link";
import SocialIcon from "@/components/atoms/SocialIcon";
import BuildWith from "@/components/atoms/BuildWith";
import { siteMetadata } from "../../../../site.config.mjs";
const { content } = siteMetadata;

const Footer = () => {
  return (
    <footer className="z-50">
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          {siteMetadata.instagram && (
            <SocialIcon
              kind="instagram"
              href={siteMetadata.instagram}
              size={20}
            />
          )}
          {siteMetadata.email && (
            <SocialIcon
              kind="mail"
              href={`mailto:${siteMetadata.email}`}
              size={20}
            />
          )}
          {siteMetadata.github && (
            <SocialIcon kind="github" href={siteMetadata.github} size={20} />
          )}
          <SocialIcon kind="rss" href="/feed.xml" size={20} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{`Copyright © ${new Date().getFullYear()} ${content.footer.copyrightText}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          {content.footer.buildWithText}{` `}
          {siteMetadata.author}
        </div>
      </div>
      <div className="mb-8 ml-10 mr-10 flex flex-col items-center justify-between space-y-4 md:mb-10 md:flex md:flex-row md:space-y-0">
        <BuildWith />

        <div className="my-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>
            {siteMetadata.title} - {siteMetadata.description}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
