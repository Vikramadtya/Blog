import React from "react";
import Tag from "./tag";
import Link from "next/link";

const Card = ({ title, description, tags, slug }) => {
  const tagsComponent = [];
  for (let i = 0; i < tags.length; ++i) {
    tagsComponent.push(<Tag key={i} text={tags[i]} id={i % 9} />);
  }
  return (
    <>
      <div className="relative flex max-w-[24rem] flex-col overflow-hidden rounded-xl border-2 bg-white bg-clip-border text-gray-700 shadow-md hover:border-solid hover:border-gray-700 dark:bg-black dark:hover:border-white">
        <Link href={"/blogs/" + slug} passHref>
          <div className="relative m-0 overflow-hidden rounded-none bg-transparent bg-clip-border text-gray-700 shadow-none"></div>
          <div className="p-6">
            <h4 className="text-blue-gray-900 hover:underline-offset-3 block font-sans text-2xl font-semibold leading-snug tracking-normal antialiased hover:underline dark:text-white">
              {title}
            </h4>
            <p className="mt-3 block font-sans text-xl font-normal leading-relaxed text-gray-700 antialiased dark:text-white">
              {description}
            </p>
          </div>
        </Link>
        <div className="mt-1 flex flex-wrap gap-1 p-6">{...tagsComponent}</div>
        <Link href={"/blog/" + slug} passHref>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center -space-x-3"> visit </div>
            <p className="block font-sans text-base font-normal leading-relaxed text-inherit antialiased dark:text-white">
              view source
            </p>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Card;
