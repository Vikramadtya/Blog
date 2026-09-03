import { noteService } from "@/core";
import { NextResponse } from "next/server";
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const rawPath = searchParams.get("path");
  if (!rawPath) return NextResponse.json({ success: false, error: "Missing path" }, { status: 400 });
  try {
    await noteService.deleteRaw(rawPath);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}