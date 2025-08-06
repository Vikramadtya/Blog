import { NextResponse } from "next/server";
import { getAuthors } from "./routeService";
import { errorResponse, logger, successResponse } from "../../lib/api-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handles GET requests to fetch authors data
 *
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} - The response containing the tag data or an error message.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Create a context string for logging
  const context = id ? `tag by id: ${id}` : "all tags";
  logger.info(`Received request to fetch ${context}`);

  try {
    let data = await getAuthors();

    if (!data || (Array.isArray(data) && data.length === 0)) {
      logger.warn(`No data found for: ${context}`);
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    logger.success(`Successfully fetched data for: ${context}`);
    return successResponse(data);
  } catch (error) {
    logger.error(`An error occurred while fetching ${context}:`, error);
    return errorResponse("An error occurred while fetching authors.", error);
  }
}
