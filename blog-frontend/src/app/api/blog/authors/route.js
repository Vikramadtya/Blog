import { getAuthors } from "./routeService";
import { errorResponse, logger, successResponse } from "../../lib/api-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handles GET requests to fetch authors data.
 *
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse}
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Create a context string for logging
  const context = id ? `author by id: ${id}` : "all authors";
  logger.info(`Received request to fetch ${context}`);

  try {
    const data = await getAuthors();

    if (!data || (Array.isArray(data) && data.length === 0)) {
      logger.warn(`No authors found`);
      return errorResponse("Authors not found", undefined, 404);
    }

    logger.success(`Successfully fetched ${context}`);
    return successResponse(data);
  } catch (error) {
    logger.error(`An error occurred while fetching ${context}:`, error);
    return errorResponse("An error occurred while fetching authors.", error);
  }
}
