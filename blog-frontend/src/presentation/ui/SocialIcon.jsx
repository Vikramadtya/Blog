import Mail from "../../../public/icons/mail.svg";
import Github from "../../../public/icons/github.svg";
import Facebook from "../../../public/icons/facebook.svg";
import Youtube from "../../../public/icons/youtube.svg";
import Linkedin from "../../../public/icons/linkedin.svg";
import Twitter from "../../../public/icons/twitter.svg";
import Instagram from "../../../public/icons/instagram.svg";
import Rss from "../../../public/icons/rss.svg";

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  rss: Rss,
};

const SocialIcon = ({ kind, href, size }) => {
  const SocialSvg = components[kind];

  return (
    <>
      <a
        className="text-sm text-gray-500 transition hover:text-gray-600"
        target="_blank"
        rel="noopener noreferrer"
        href={href}
      >
        <span className="sr-only">{kind}</span>
        <SocialSvg
          className={`fill-current text-gray-700 hover:text-blue-400 dark:text-gray-200`}
          width={size}
          height={size}
        />
      </a>
    </>
  );
};

export default SocialIcon;
