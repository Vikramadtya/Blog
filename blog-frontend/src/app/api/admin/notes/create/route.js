import { noteService } from "@/core";
import { NextResponse } from "next/server";
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, name, parentPath } = body;
    if (!type || !name) return NextResponse.json({ success: false, error: "Missing type or name" }, { status: 400 });

    if (type === "book") {
      await noteService.createBook(name);
      return NextResponse.json({ success: true, targetPath: name });
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
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}