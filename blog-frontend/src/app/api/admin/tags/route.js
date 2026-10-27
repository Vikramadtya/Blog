import { checkAdminAuth, errorResponse } from "@/lib/auth";
import { NextResponse } from "next/server";
import { syncTags } from "@/lib/syncTags";

export async function POST(req) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;
  try {
    const tags = await syncTags();
    return NextResponse.json({ success: true, count: tags.length });
  } catch (error) {
    return errorResponse(error);
  }
}
