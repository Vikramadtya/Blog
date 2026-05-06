import CustomLink from "@/components/atoms/CustomLink";
import Icon from "@/components/atoms/Icon";
import content from "../../../config/content.json";

const BuildWith = () => (
  <div className="flex items-center">
    <div className="pr-2 text-sm text-gray-500 dark:text-gray-400">
      {content.footer.buildWithText}
    </div>
    <CustomLink href="https://nextjs.org" className="pl-1 pr-1">
      <Icon kind="nextJS" className={"h-5 w-5"} />
    </CustomLink>
    <CustomLink href="https://tailwindcss.com" className="pl-1 pr-1">
      <Icon kind="tailwindCSS" className={"h-5 w-5"} />
    </CustomLink>
    <CustomLink href="https://umami.is" className="pl-1 pr-1">
      <Icon kind="umami" className={"h-5 w-5"} />
    </CustomLink>{" "}
  </div>
);

export default BuildWith;
