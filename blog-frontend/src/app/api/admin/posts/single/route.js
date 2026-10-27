import { checkAdminAuth } from "@/lib/auth";
import { BLOGS_DIR, resolveBlogFile } from "@/lib/paths";
import { NextResponse } from "next/server";
import { syncTags } from "@/lib/syncTags";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";


export async function GET(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  if (!filename) return NextResponse.json({ error: "Filename is required" }, { status: 400 });

  try {
    const filePath = resolveBlogFile(filename);
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
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { filename, metadata, content } = body;
    
    if (!filename) return NextResponse.json({ error: "Filename is required" }, { status: 400 });

    const filePath = resolveBlogFile(filename);

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

    // Cast seriesOrder to number; remove series fields if empty to avoid YAML undefined errors
    if (metadata.seriesOrder) {
      metadata.seriesOrder = Number(metadata.seriesOrder);
    } else {
      delete metadata.seriesOrder;
    }
    if (!metadata.series) {
      delete metadata.series;
    }

    const newMetadata = {
      ...existingData,
      ...metadata,
      tags: tagsArray,
      updatedAt: new Date().toISOString()
    };

    // Remove any undefined values that would crash js-yaml
    Object.keys(newMetadata).forEach(k => newMetadata[k] === undefined && delete newMetadata[k]);

    const fileContent = matter.stringify(content, newMetadata);
    await fs.writeFile(filePath, fileContent, "utf8");

    // Auto-sync tags just in case tags were modified
    await syncTags().catch((e) => console.warn("Failed to auto-sync tags after edit", e));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
