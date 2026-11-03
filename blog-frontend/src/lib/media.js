/**
 * Image paths in content are plain relative paths (`../images/diagram.png`) so they render in any
 * markdown editor and on GitHub. The site serves everything under blog-datastore at /media/<path>;
 * these helpers translate between the two. Pure string logic, safe on server and client.
 */
export const MEDIA_ROUTE = "/media";
export const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

const EXTERNAL = /^([a-z][a-z0-9+.-]*:|\/|#)/i; // scheme:, //host, /root-absolute, #anchor

const segmentsOf = (p) => p.split("/").filter((s) => s && s !== ".");

/**
 * `baseDir` is the folder of the markdown file relative to the datastore root
 * (e.g. "notes/system-design" or "blogs"). Returns a /media URL, or `src` untouched when it is
 * not a relative image path (external URLs, legacy /notes-assets/... paths, anchors).
 */
export function resolveMediaUrl(baseDir, src) {
  if (typeof src !== "string" || !src || EXTERNAL.test(src)) return src;
  const [pathPart, suffix = ""] = src.split(/(?=[?#])/);
  const out = segmentsOf(baseDir || "");
  for (const segment of segmentsOf(pathPart)) {
    if (segment === "..") {
      if (out.length === 0) return src; // escapes the datastore
      out.pop();
    } else out.push(segment);
  }
  if (!IMAGE_EXTENSIONS.test(decodeURIComponentSafe(out[out.length - 1] ?? "")))
    return src;
  return `${MEDIA_ROUTE}/${out.join("/")}${suffix}`;
}

/** Relative link from a markdown file to an asset, both given relative to the datastore root. */
export function relativeMediaPath(fromFile, toFile) {
  const from = segmentsOf(fromFile).slice(0, -1);
  const to = segmentsOf(toFile);
  let i = 0;
  while (i < from.length && i < to.length - 1 && from[i] === to[i]) i++;
  const up = from.slice(i).map(() => "..");
  return [...(up.length ? up : ["."]), ...to.slice(i)]
    .map((s) =>
      s === ".." || s === "."
        ? s
        : encodeURIComponent(s).replace(/[()]/g, (c) =>
            c === "(" ? "%28" : "%29",
          ),
    )
    .join("/");
}

function decodeURIComponentSafe(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
