import { noteService } from "@/core";
import { NextResponse } from "next/server";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawPath = searchParams.get("path");
  if (!rawPath) return NextResponse.json({ success: false, error: "Missing path" }, { status: 400 });
  try {
    const note = await noteService.getNoteRaw(rawPath);
    return NextResponse.json({ success: true, file: { path: note.path, content: note.content } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
}