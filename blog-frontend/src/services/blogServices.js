export const getBlogToc = (content) => {
  return content
    .split("\n")
    .filter((line) => line.match(/#{1,6}.+/g))
    .map((heading) => {
      return {
        heading: heading,
        slug: heading
          .replace(/\#/g, "")
          .trim()
          .toLowerCase()
          .replace(/\?/g, "")
          .replace(/\ /g, "-"),
      };
    });
};
