/** Upload an image through the dev-only admin endpoint; resolves to the public URL or throws. */
/**
 * Uploads into blog-datastore/images. Pass `from` (the markdown file being edited, relative to the
 * datastore, e.g. "notes/system-design/DNS.md") to get back a relative link for that file;
 * without it you get the site URL (use that for frontmatter such as cover images).
 */
export async function uploadImage(file, from) {
  const body = new FormData();
  body.append("file", file);
  if (from) body.append("from", from);
  const res = await fetch("/api/admin/upload-image", { method: "POST", body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.relative ?? data.url;
}
