import Card from "./card";
import React from "react";

const FeaturedPost = () => {
  return (
    <>
      <div className="flex flex-col items-start space-y-5 py-10 md:container md:items-center">
        <div className="flex flex-col items-start gap-3 px-4 md:items-center">
          <h1 className="bg-gradient-to-r from-primary to-gray-400 bg-clip-text text-2xl font-bold text-transparent md:text-5xl">
            Featured Blogs
          </h1>
          <p className="text-muted-foreground">
            Here are some of my featured blogs
          </p>
          <div>
            <button href="/projects" className="text-base">
              View all blogs
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl gap-x-[5px] md:mx-auto">
        <div className="columns-3 gap-10">
          <Card
            title={"Something"}
            description={
              "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"
            }
            tags={[]}
            slug={"test"}
            key={1}
          />
          <Card
            title={"Something"}
            description={
              "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)"
            }
            tags={[]}
            slug={"test"}
            key={1}
          />
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
    </>
  );
};

export default FeaturedPost;
