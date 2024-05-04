import Card from "./card";
import React from "react";

const LatestPost = () => {
  return (
    <>
      <div className="mt-12">
        <div className="md:container">
          <div className="flex flex-col items-start justify-between space-y-7 md:flex-row md:items-center">
            <div className="space-y-3 md:w-[80%]">
              <div className="text-start">
                <h1 className="bg-gradient-to-r from-primary to-gray-400 bg-clip-text text-2xl font-bold text-transparent md:text-5xl">
                  Latest Post
                </h1>
              </div>
              <p className="text-muted-foreground">
                Check out my latest blog post
              </p>
              <div>
                <button href="/blog" className="text-base">
                  All blogs
                </button>
              </div>
            </div>
            <div className="no-highlight -mx-2 space-y-2 rounded-2xl shadow-xl md:max-w-sm lg:max-w-md">
              <Card
                title={"Something"}
                description={
                  "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"
                }
                tags={[]}
                slug={"test"}
                key={1}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LatestPost;
