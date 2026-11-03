import { checkAdminAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { DATASTORE_DIR } from "@/lib/paths";
import { relativeMediaPath } from "@/lib/media";
import { createHash } from "crypto";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);
// SVGs are served from our own origin, so anything that can run script is rejected
const UNSAFE_SVG = /<script|<foreignObject|\son\w+\s*=|javascript:/i;

export async function POST(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use PNG, JPEG, GIF, WebP, AVIF or SVG." },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (
      file.type === "image/svg+xml" &&
      UNSAFE_SVG.test(buffer.toString("utf8"))
    ) {
      return NextResponse.json(
        { error: "SVG contains scripts or event handlers." },
        { status: 400 },
      );
    }

    // Content-addressed name: uploading the same image twice reuses the existing file
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 12);
    const filename = `${hash}-${originalName}`;

    // Images live in blog-datastore/images so they travel with the content
    const imagesDir = path.join(DATASTORE_DIR, "images");
    await fs.mkdir(imagesDir, { recursive: true });
    await fs.writeFile(path.join(imagesDir, filename), buffer);

    const assetPath = `images/${filename}`;
    const url = `/media/${assetPath.split("/").map(encodeURIComponent).join("/")}`;

    // When the caller says which file it is editing, also return the link to put in that file:
    // a relative path works in any markdown editor as well as on the site.
    const from = formData.get("from");
    const relative =
      typeof from === "string" && from.endsWith(".md") && !from.includes("..")
        ? relativeMediaPath(from, assetPath)
        : null;

    return NextResponse.json({ success: true, url, relative });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: "Failed to upload image." },
      { status: 500 },
    );
  }
}
