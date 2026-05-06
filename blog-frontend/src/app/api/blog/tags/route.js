import { getTags } from "./routeService";
import { errorResponse, logger, successResponse } from "../../lib/api-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handles GET requests to fetch tag data.
 * Supports fetching all tags, or a single tag by ID
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
    const data = id ? await getTags({ key: "id", value: id }) : await getTags();

    if (!data || (Array.isArray(data) && data.length === 0)) {
      logger.warn(`No data found for: ${context}`);
      return errorResponse(`Invalid request 'id' (${id})`, undefined, 404);
    }

    logger.success(`Successfully fetched data for: ${context}`);
    return successResponse(data);
  } catch (error) {
    logger.error(`An error occurred while fetching ${context}:`, error);
    return errorResponse("An error occurred while fetching tags.", error);
  }
}
