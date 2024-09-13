import React from "react";

const LatestPost = () => {
  return (
    <>
      <div className="flex justify-between md:flex-row">
        <div className="flex flex-col gap-4 md:w-[50%]">
          <div className="flex items-center">
            <h1 className="mr-4 text-xl font-bold tracking-widest">Latest</h1>
            <div className="flex-grow">
              <hr className="border-gray-300 dark:border-gray-700" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <a href={`/blog/`}>
              <h1 className="text-2xl font-bold leading-[1.1] tracking-wider md:text-[40px]">
                Sort Visualizer
              </h1>
            </a>
            <p className="text-muted-foreground">
              This post describes the Random Forest, a method created to solve
              the overfitting issue of Decision Trees.
            </p>
            <div className="flex flex-wrap gap-2"></div>
            <div></div>
          </div>
        </div>
        <div className="flex hidden justify-center md:block">
          <div className="p-2 pt-5">
            <img
              src="https://pagedone.io/asset/uploads/1696244579.png"
              alt="John image"
              className="w-fit rounded-md"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestPost;
