"use client";
import Giscus from "@giscus/react";
import { siteMetadata } from "../../../site.config";

import { useTheme } from "next-themes";

const Comments = () => {
  const { theme } = useTheme();

  return (
    <div id="comments" className="w-full">
      <Giscus
        repo={siteMetadata.giscus.repo}
        repoId={siteMetadata.giscus.repoId}
        category={siteMetadata.giscus.category}
        categoryId={siteMetadata.giscus.categoryId}
        mapping={siteMetadata.giscus.mapping}
        reactionsEnabled={siteMetadata.giscus.reactionsEnabled === "1"}
        emitMetadata={siteMetadata.giscus.emitMetadata === "1"}
        inputPosition={siteMetadata.giscus.inputPosition}
        theme={
          theme === "dark"
            ? siteMetadata.giscus.darkTheme
            : siteMetadata.giscus.lightTheme
        }
        lang={siteMetadata.giscus.lang}
        loading={siteMetadata.giscus.loading}
        strict={siteMetadata.giscus.strict === "1"}
      />
    </div>
  );
};

export default Comments;
