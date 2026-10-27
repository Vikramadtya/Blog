import { checkAdminAuth, errorResponse } from "@/lib/auth";
import { noteService } from "@/core";
import { NextResponse } from "next/server";

export async function GET(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  const rawPath = new URL(req.url).searchParams.get("path");
  if (!rawPath) return NextResponse.json({ success: false, error: "Missing path" }, { status: 400 });
  try {
    const note = await noteService.getNoteRaw(rawPath);
    return NextResponse.json({ success: true, file: { path: note.path, content: note.content } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  try {
    const { path: notePath, content } = await req.json();
    if (!notePath || typeof content !== "string") {
      return NextResponse.json({ success: false, error: "Missing path or content" }, { status: 400 });
    }
    await noteService.saveNoteRaw(notePath, content);
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
