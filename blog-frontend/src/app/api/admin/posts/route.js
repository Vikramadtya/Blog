import { checkAdminAuth } from "@/lib/auth";
import { BLOGS_DIR, resolveBlogFile } from "@/lib/paths";
import { NextResponse } from "next/server";
import { syncTags } from "@/lib/syncTags";
import { calculateReadingTime } from "@/lib/readingTime";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";


export async function GET(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
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
          series: data.series || null,
          seriesOrder: data.seriesOrder || 0,
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
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const { filename, publish } = await req.json();
    if (!filename) return NextResponse.json({ error: "Filename is required" }, { status: 400 });

    const filePath = resolveBlogFile(filename);
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
    await syncTags().catch((e) => console.warn("Failed to auto-sync tags after update", e));

    return NextResponse.json({ success: true, readingTime: data.readingTime });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    if (!filename) return NextResponse.json({ error: "Filename is required" }, { status: 400 });

    const filePath = resolveBlogFile(filename);
    await fs.unlink(filePath);
    
    await syncTags().catch((e) => console.warn("Failed to auto-sync tags after deletion", e));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
