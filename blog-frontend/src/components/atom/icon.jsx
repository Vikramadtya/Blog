import Chart from "../../../public/icons/chart.svg";
import NextJS from "../../../public/icons/nextjs.svg";
import TailwindCSS from "../../../public/icons/tailwind.svg";
import Umami from "../../../public/icons/umami.svg";
import Location from "../../../public/icons/location.svg";
import Home from "../../../public/icons/home.svg";
import Me from "../../../public/icons/me.svg";
import WrenchAndHammer from "../../../public/icons/wrench-and-hammer.svg";
import Search from "../../../public/icons/search.svg";
import Tag from "../../../public/icons/tag.svg";
import Avatar from "../../../public/icons/tag.svg";
import Calendar from "../../../public/icons/tag.svg";
import Heart from "../../../public/icons/heart.svg";
import Share from "../../../public/icons/share.svg";
import TableOfContent from "../../../public/icons/toc.svg";
import Up from "../../../public/icons/up.svg";
import Comment from "../../../public/icons/comment.svg";

import { classNameResolver } from "@/utils/classNameResolver";

const components = {
  chart: Chart,
  nextJS: NextJS,
  tailwindCSS: TailwindCSS,
  umami: Umami,
  location: Location,
  home: Home,
  me: Me,
  wrenchAndHammer: WrenchAndHammer,
  search: Search,
  tag: Tag,
  calendar: Calendar,
  up: Up,
  heart: Heart,
  comment: Comment,
  tableOfContent: TableOfContent,
  share: Share,
};

const Icon = ({ kind, className }) => {
  const IconSvg = components[kind];
  return (
    <>
      <i className={`inline-block`}>
        <IconSvg className={classNameResolver(className)} />
      </i>
    </>
  );
};

export default Icon;
