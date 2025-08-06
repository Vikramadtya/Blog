import { getBlogMetadataByType, getBlogMetadataWithTagId } from "./apiServices";

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

export async function getTagToBlogMap(tags) {
  const tagToMetadataBlog = {};
  for (const tag of tags) {
    tagToMetadataBlog[tag.id] = await getBlogMetadataWithTagId(tag.id);
  }
  return tagToMetadataBlog;
}
