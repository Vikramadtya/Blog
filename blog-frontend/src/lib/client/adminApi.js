/** Upload an image through the dev-only admin endpoint; resolves to the public URL or throws. */
export async function uploadImage(file) {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/upload-image", { method: "POST", body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}
