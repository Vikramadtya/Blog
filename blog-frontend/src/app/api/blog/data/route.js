/**
 * API route handler for /api/blog/data.
 *
 * This route is now primarily used by CLIENT components at runtime:
 * - GET ?id=<blogId> → Fetches live metadata (likes/views) from Firebase
 * - POST → Increments likes or views via Firebase
 *
 * Static data (blog lists, tags, content) is resolved at build time
 * via localDatastore — no lambda invocations during SSG.
 */

import {
  getDynamicMetadataById,
  incrementMetadataField,
} from "../../../../lib/server/blog";
import { errorResponse, logger, successResponse } from "../../../../lib/server/api-utils";
import { VALID_INCREMENT_FIELDS } from "../../../../lib/constants";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handles GET requests to fetch live blog metadata (likes/views) from Firebase.
 * Used exclusively by client components at runtime.
 *
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse}
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  logger.info(`GET /api/blog/data — id=${id}`);

  if (!id) {
    return errorResponse("The 'id' parameter is required.", undefined, 400);
  }

  try {
    const data = await getDynamicMetadataById(id);
    logger.success("Successfully fetched dynamic blog metadata");
    return successResponse(data);
  } catch (error) {
    logger.error("Failed to fetch dynamic blog metadata:", error);
    return errorResponse(
      "An error occurred while fetching dynamic blog metadata.",
      error,
    );
  }
}

/**
 * Handles POST requests to increment a blog's likes or views count.
 *
 * @param {Request} request - The incoming Next.js request object.
 * @returns {NextResponse}
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON in request body.", undefined, 400);
  }

  const { id, field } = body;

  logger.info(`POST /api/blog/data — id=${id}, field=${field}`);

  if (!id || !field || !VALID_INCREMENT_FIELDS.includes(field)) {
    return errorResponse(
      `Invalid request. 'id' and a valid 'field' (${VALID_INCREMENT_FIELDS.join(" or ")}) are required.`,
      undefined,
      400,
    );
  }

  try {
    const updatedData = await incrementMetadataField(id, field);
    logger.success(`Incremented '${field}' for ID: ${id}`);
    return successResponse(updatedData);
  } catch (error) {
    logger.error(`Failed to increment '${field}' for ID: ${id}:`, error);
    return errorResponse("An error occurred while updating metadata.", error);
  }
}
