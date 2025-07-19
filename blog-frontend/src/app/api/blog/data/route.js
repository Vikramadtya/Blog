import {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  getBlogsByType,
} from "./routeService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handles GET requests to fetch blog data.
 * Supports fetching by ID, slug, or type.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} - The response containing the blog data or an error message.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");

  try {
    let data;
    if (id) {
      data = await getBlogById(id);
    } else if (slug) {
      data = await getBlogBySlug(slug);
    } else if (type) {
      data = await getBlogsByType(type);
    } else {
      data = await getAllBlogs();
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching blog data.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
