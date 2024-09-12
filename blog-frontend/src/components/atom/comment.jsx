"use client";
import Giscus from "@giscus/react";
import { siteMetadata } from "@/MetaData";

import { useTheme } from "next-themes";

const Comments = () => {
  const { theme } = useTheme();

  return (
    <>
      <Giscus
        id={siteMetadata.giscus.label}
        repo={siteMetadata.giscus.commentsRepo}
        repoId={siteMetadata.giscus.commentsRepoId}
        category={siteMetadata.giscus.gitHubDiscussionCategory}
        categoryId={siteMetadata.giscus.gitHubDiscussionCategoryId}
        mapping={siteMetadata.giscus.commentsMapping}
        reactionsEnabled={siteMetadata.giscus.reactionsEnabled}
        emitMetadata={siteMetadata.giscus.emitMetadata}
        inputPosition={siteMetadata.giscus.inputPosition}
        theme={
          theme === "dark"
            ? siteMetadata.giscus.darkTheme
            : siteMetadata.giscus.lightTheme
        }
        lang={siteMetadata.giscus.lang}
        loading={siteMetadata.giscus.loading}
      />
    </>
  );
};

export default Comments;
