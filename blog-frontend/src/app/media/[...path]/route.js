import fs from "fs/promises";
import { NextResponse } from "next/server";
import { DATASTORE_DIR, resolveInside } from "@/lib/paths";
import { IMAGE_EXTENSIONS } from "@/lib/media";

const CONTENT_TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
};

/** Serves images that live inside blog-datastore (referenced from markdown by relative path). */
export async function GET(_req, { params }) {
  const { path: segments } = await params;
  const relative = segments.map(decodeURIComponent).join("/");
  if (!IMAGE_EXTENSIONS.test(relative))
    return new NextResponse(null, { status: 404 });

  try {
    const file = resolveInside(DATASTORE_DIR, relative);
    const body = await fs.readFile(file);
    const ext = file.split(".").pop().toLowerCase();
    return new NextResponse(body, {
      headers: {
        "Content-Type": CONTENT_TYPES[ext],
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
        // SVGs opened directly must not be able to run script
        "Content-Security-Policy":
          "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
