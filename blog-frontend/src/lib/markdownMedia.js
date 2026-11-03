import { visit } from "unist-util-visit";
import { resolveMediaUrl } from "./media.js";

/** remark plugin: point relative image paths at the /media route (see lib/media.js). */
export function remarkMedia({ baseDir = "" } = {}) {
  return (tree) => {
    visit(tree, "image", (node) => {
      node.url = resolveMediaUrl(baseDir, node.url);
    });
  };
}
