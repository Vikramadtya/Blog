import { checkAdminAuth, errorResponse } from "@/lib/auth";
import { noteService } from "@/core";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  const rawPath = new URL(req.url).searchParams.get("path");
  if (!rawPath) return NextResponse.json({ success: false, error: "Missing path" }, { status: 400 });
  try {
    await noteService.deleteRaw(rawPath);
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
