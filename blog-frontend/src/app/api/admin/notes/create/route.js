import { checkAdminAuth, errorResponse } from "@/lib/auth";
import { noteService } from "@/core";
import { NextResponse } from "next/server";
export async function POST(request) {
  const authError = checkAdminAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { type, name, parentPath } = body;
    if (!type || !name) return NextResponse.json({ success: false, error: "Missing type or name" }, { status: 400 });

    if (type === "book") {
      const targetPath = await noteService.createBook(name);
      return NextResponse.json({ success: true, targetPath });
    } else if (type === "category") {
      const targetPath = parentPath ? `${parentPath}/${name}` : name;
      await noteService.createCategory(targetPath);
      return NextResponse.json({ success: true, targetPath });
    } else if (type === "note") {
      const filename = name.endsWith(".md") ? name : `${name}.md`;
      const targetPath = parentPath ? `${parentPath}/${filename}` : filename;
      const initialContent = `---
title: ${name.replace(".md", "")}
---

# ${name.replace(".md", "")}

Start writing...`;
      await noteService.saveNoteRaw(targetPath, initialContent);
      return NextResponse.json({ success: true, targetPath });
    }
    
    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}