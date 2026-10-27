import { checkAdminAuth, errorResponse } from "@/lib/auth";
import { noteService } from "@/core";
import { NextResponse } from "next/server";

export async function GET(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  try {
    return NextResponse.json({ success: true, tree: await noteService.getAdminRawTree() });
  } catch (error) {
    return errorResponse(error);
  }
}
