import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const BLOGS_DIR = path.join(process.cwd(), "blog-datastore/blogs");

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export async function GET() {
  try {
    const files = (await fs.readdir(BLOGS_DIR)).filter(f => f.endsWith(".md"));
    const posts = await Promise.all(
      files.map(async (file) => {
        const fileContent = await fs.readFile(path.join(BLOGS_DIR, file), "utf8");
        const { data } = matter(fileContent);
        return {
          filename: file,
          title: data.title || "Untitled",
          slug: data.slug || file.replace(".md", ""),
          publish: !!data.publish,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          type: data.type || "blog",
          readingTime: data.readingTime || "1 min read",
        };
      })
    );

    // Sort by createdAt descending
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in local development." }, { status: 403 });
  }

  try {
    const { filename, publish } = await req.json();
    if (!filename) return NextResponse.json({ error: "Filename is required" }, { status: 400 });

    const filePath = path.join(BLOGS_DIR, filename);
    const fileContent = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(fileContent);

    data.publish = publish;
    data.updatedAt = new Date().toISOString();
    
    // Auto-calculate reading time when publishing
    if (publish) {
      data.readingTime = calculateReadingTime(content);
    }

    const updatedFileContent = matter.stringify(content, data);
    await fs.writeFile(filePath, updatedFileContent, "utf8");

    // We don't await the tag sync here to keep the response fast,
    // the frontend can call /api/admin/tags independently, 
    // or we can just fetch it internally.
    try {
      await fetch(new URL("/api/admin/tags", req.url), { method: "POST" });
    } catch (e) {
      console.warn("Failed to auto-sync tags after update", e);
    }

    return NextResponse.json({ success: true, readingTime: data.readingTime });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in local development." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    if (!filename) return NextResponse.json({ error: "Filename is required" }, { status: 400 });

    const filePath = path.join(BLOGS_DIR, filename);
    await fs.unlink(filePath);
    
    try {
      await fetch(new URL("/api/admin/tags", req.url), { method: "POST" });
    } catch (e) {
      console.warn("Failed to auto-sync tags after deletion", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
