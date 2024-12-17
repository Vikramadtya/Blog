import React from "react";
import Tag from "./tag";
import Link from "next/link";
import dayjs from "dayjs";
import Icon from "@/components/atom/icon";

const Card = ({
  title,
  description,
  tags,
  slug,
  date,
  likes,
  views,
  blogNumber,
  id,
  previewImageSrc,
}) => {
  const tagsComponent = tags.map((tag) => (
    <Tag key={tag.id} text={tag.name} color={tag.color} />
  ));
  return (
    <>
      <div className="relative mb-10 flex max-w-[24rem] flex-col overflow-hidden rounded-xl border-2 bg-white bg-clip-border text-gray-700 shadow-md hover:border-solid hover:border-gray-700 dark:bg-black dark:hover:border-white">
        <div className="mb-3 flex items-center p-3 ">
          <img
            src={previewImageSrc}
            alt="John image"
            className="w-full rounded-lg object-cover"
          />
        </div>

        <Link href={"/blogs/" + slug} passHref>
          <div className="-mb-2 flex items-center gap-4 pl-6 text-xs">
            <h1 className="italic text-muted-foreground"># {blogNumber}</h1>
            <div className="flex items-center gap-1 text-xs">
              <Icon kind="heart" className={"h-4 w-4"} />
              <h1>{likes}</h1>
            </div>
          </div>
          <div className="relative m-0 overflow-hidden rounded-none bg-transparent bg-clip-border text-gray-700 shadow-none"></div>
          <div className="p-6">
            <h4 className="text-blue-gray-900 hover:underline-offset-3 block font-sans text-2xl font-semibold leading-snug tracking-normal antialiased hover:underline dark:text-white">
              {title}
            </h4>
            <p className="mt-3 block h-auto font-sans text-base font-normal leading-relaxed text-gray-700 antialiased dark:text-white ">
              {description}
            </p>
          </div>
        </Link>
        <div className="mt-1 flex flex-wrap gap-1 p-6">{...tagsComponent}</div>
        <Link
          href={`https://github.com/Vikramadtya/Blog-Scratch/blob/main/blogs/${id}/blog.mdx`}
          passHref
        >
          <div className="flex items-center justify-between p-6">
            <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased dark:text-white">
              view source
            </p>
            <div className="flex items-center -space-x-3 text-indigo-600">
              {dayjs(date).format("MMMM D, YYYY")}
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Card;
