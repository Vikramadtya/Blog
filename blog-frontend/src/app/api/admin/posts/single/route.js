import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const BLOGS_DIR = path.join(process.cwd(), "blog-datastore/blogs");

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  if (!filename) return NextResponse.json({ error: "Filename is required" }, { status: 400 });

  try {
    const filePath = path.join(BLOGS_DIR, filename);
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);

    // Format tags array to comma-separated string for editing
    const tagsString = Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || "");

    return NextResponse.json({
      metadata: { ...data, tags: tagsString },
      content
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in local development." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { filename, metadata, content } = body;
    
    if (!filename) return NextResponse.json({ error: "Filename is required" }, { status: 400 });

    const filePath = path.join(BLOGS_DIR, filename);

    // Make sure we preserve existing metadata that wasn't edited
    let existingData = {};
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      existingData = matter(fileContent).data;
    } catch (e) {
      // File might be new or unreadable, that's fine
    }

    // Process tags string back to array
    const tagsArray = typeof metadata.tags === "string" 
      ? metadata.tags.split(",").map(t => t.trim()).filter(Boolean)
      : metadata.tags;

    const newMetadata = {
      ...existingData,
      ...metadata,
      tags: tagsArray,
      updatedAt: new Date().toISOString()
    };

    const fileContent = matter.stringify(content, newMetadata);
    await fs.writeFile(filePath, fileContent, "utf8");

    // Auto-sync tags just in case tags were modified
    try {
      await fetch(new URL("/api/admin/tags", req.url), { method: "POST" });
    } catch (e) {
      console.warn("Failed to auto-sync tags after edit", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
