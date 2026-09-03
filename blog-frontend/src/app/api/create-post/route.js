import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  // Only allow this endpoint in local development for security!
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in local development." },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();
    const { title, slug, summary, tags, type, previewImageSrc } = data;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 }
      );
    }

    const BLOGS_DIR = path.join(process.cwd(), "blog-datastore/blogs");
    const filePath = path.join(BLOGS_DIR, `${slug}.md`);

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
      id: uuidv4(),
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

    const content = `# ${title}\n\nStart typing here...`;
    const fileContent = matter.stringify(content, metadata);

    // Ensure directory exists
    await fs.mkdir(BLOGS_DIR, { recursive: true });
    await fs.writeFile(filePath, fileContent, "utf8");

    // Auto-sync tags
    try {
      await fetch(new URL("/api/admin/tags", req.url), { method: "POST" });
    } catch (e) {
      console.warn("Failed to auto-sync tags after creation", e);
    }

    return NextResponse.json({ success: true, filePath, metadata });

  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
