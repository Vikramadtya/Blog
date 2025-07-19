import { getAllTags } from "./routeService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handles GET requests to fetch all tags.
 * @returns {NextResponse} - The response containing the tags.
 */
export async function GET() {
  try {
    const tags = await getAllTags();
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching tags.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
