import { checkAdminAuth } from "@/lib/auth";
import { BLOGS_DIR, resolveBlogFile } from "@/lib/paths";
import { NextResponse } from "next/server";
import { syncTags } from "@/lib/syncTags";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export async function POST(req) {
  // Only allow this endpoint in local development for security!
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const data = await req.json();
    const { title, slug, summary, tags, type, previewImageSrc, series, seriesOrder } = data;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 }
      );
    }

    const filePath = resolveBlogFile(`${slug}.md`);

    // Check if it already exists
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { error: `A blog post with the slug "${slug}" already exists.` },
        { status: 409 }
      );
    } catch {
      // File doesn't exist, we can proceed
    }

    // Process tags
    const tagsArray = typeof tags === "string" 
      ? tags.split(",").map(t => t.trim()).filter(Boolean)
      : (tags || ["blog"]);

    const metadata = {
      id: crypto.randomUUID(),
      title,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tagsArray,
      publish: false,
      type: type || "blog",
      summary: summary || "",
      previewImageSrc: previewImageSrc || ""
    };

    // Only add series fields when actually provided — undefined/empty values crash js-yaml
    if (series) {
      metadata.series = series;
      metadata.seriesOrder = seriesOrder ? Number(seriesOrder) : 1;
    }

    const content = `# ${title}\n\nStart typing here...`;
    const fileContent = matter.stringify(content, metadata);

    // Ensure directory exists
    await fs.mkdir(BLOGS_DIR, { recursive: true });
    await fs.writeFile(filePath, fileContent, "utf8");

    // Auto-sync tags
    await syncTags().catch((e) => console.warn("Failed to auto-sync tags after creation", e));

    return NextResponse.json({ success: true, filePath, metadata });

  } catch (error) {
    if (error.status === 400) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
