import { noteService } from "@/core";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const tree = await noteService.getAdminRawTree();
    return NextResponse.json({ success: true, tree });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}