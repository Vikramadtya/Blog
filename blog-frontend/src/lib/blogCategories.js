export const CATEGORY_DEFINITIONS = {
  systems: {
    key: "systems",
    label: "Systems & Distributed Architecture",
    blurb: "Deep dives into system design trade-offs, scalability, CAP theorem, and distributed observability.",
    icon: "🏗️",
  },
  ai: {
    key: "ai",
    label: "AI & Spec-Driven Engineering",
    blurb: "Spec-driven development, LLM architectures, coding agents, and autonomous engineering workflows.",
    icon: "🧠",
  },
  tools: {
    key: "tools",
    label: "Linux & Developer Tooling",
    blurb: "Command-line mastery, kernel & process debugging, networking, and engineering utilities.",
    icon: "⚡",
  },
  algorithms: {
    key: "algorithms",
    label: "Algorithms & Interactive Systems",
    blurb: "Data structures, algorithm performance, sorting visualizers, and computational mechanics.",
    icon: "🧩",
  },
  general: {
    key: "general",
    label: "Engineering Notes & Practices",
    blurb: "Practical software design, architectural patterns, and production engineering lessons.",
    icon: "📝",
  },
};

/**
 * Assign a category key to a post based on its explicit category, tags, series, or slug.
 */
export function getPostCategoryKey(post) {
  if (post.category && CATEGORY_DEFINITIONS[post.category]) {
    return post.category;
  }

  const tags = (post.tags || []).map((t) =>
    (typeof t === "string" ? t : t.name || "").toLowerCase()
  );
  const text = `${post.slug} ${post.title} ${post.series || ""} ${tags.join(" ")}`.toLowerCase();

  if (
    text.includes("spec") ||
    text.includes("ai") ||
    text.includes("llm") ||
    text.includes("superpower") ||
    text.includes("agent")
  ) {
    return "ai";
  }

  if (
    text.includes("system") ||
    text.includes("cap") ||
    text.includes("observab") ||
    text.includes("distributed") ||
    text.includes("trace") ||
    text.includes("span") ||
    text.includes("url-shortener") ||
    text.includes("capacity")
  ) {
    return "systems";
  }

  if (
    text.includes("port") ||
    text.includes("tar") ||
    text.includes("linux") ||
    text.includes("unix") ||
    text.includes("command") ||
    text.includes("process")
  ) {
    return "tools";
  }

  if (
    text.includes("sort") ||
    text.includes("algorithm") ||
    text.includes("visualiz") ||
    text.includes("dsa") ||
    text.includes("tree") ||
    text.includes("graph")
  ) {
    return "algorithms";
  }

  return "general";
}

/**
 * Builds a structured, categorized dataset for the blog index and sidebar.
 */
export function buildBlogIndexData(allPosts) {
  // Map of slug -> post
  const postBySlug = new Map();
  allPosts.forEach((p) => {
    postBySlug.set(p.slug, p);
  });

  // Group sub-pages by parent series slug
  const childrenByParent = new Map();
  allPosts.forEach((p) => {
    if (p.series) {
      if (!childrenByParent.has(p.series)) {
        childrenByParent.set(p.series, []);
      }
      childrenByParent.get(p.series).push(p);
    }
  });

  // Sort children by seriesOrder
  childrenByParent.forEach((children) => {
    children.sort((a, b) => (Number(a.seriesOrder) || 0) - (Number(b.seriesOrder) || 0));
  });

  // Top-level posts (posts that are NOT sub-pages)
  const topLevelPosts = allPosts.filter((p) => !p.series);

  // Group into categories
  const categoriesMap = new Map();
  Object.keys(CATEGORY_DEFINITIONS).forEach((k) => {
    categoriesMap.set(k, {
      ...CATEGORY_DEFINITIONS[k],
      posts: [],
      series: new Map(), // seriesSlug -> { parent, parts }
      standalonePosts: [],
    });
  });

  topLevelPosts.forEach((post) => {
    const catKey = getPostCategoryKey(post);
    const catObj = categoriesMap.get(catKey) || categoriesMap.get("general");
    catObj.posts.push(post);

    const hasChildren = childrenByParent.has(post.slug);
    if (hasChildren) {
      const parts = childrenByParent.get(post.slug);
      catObj.series.set(post.slug, {
        parent: post,
        parts: [post, ...parts],
      });
    } else {
      catObj.standalonePosts.push(post);
    }
  });

  // Filter out empty categories
  const activeCategories = Array.from(categoriesMap.values())
    .filter((cat) => cat.posts.length > 0)
    .map((cat) => ({
      ...cat,
      seriesList: Array.from(cat.series.values()),
      totalPostsCount:
        cat.standalonePosts.length +
        Array.from(cat.series.values()).reduce(
          (acc, s) => acc + s.parts.length,
          0
        ),
    }));

  const totalPosts = allPosts.length;
  const totalSeries = Array.from(childrenByParent.keys()).length;

  return {
    allPosts,
    topLevelPosts,
    categories: activeCategories,
    totalPosts,
    totalSeries,
    childrenByParent,
  };
}
