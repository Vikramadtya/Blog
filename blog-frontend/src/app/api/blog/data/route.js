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
  getBlogs,
  getDynamicMetadataById,
  incrementMetadataField,
} from "./routeService";
import { errorResponse, logger, successResponse } from "../../lib/api-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Valid fields that can be incremented via POST. */
const VALID_INCREMENT_FIELDS = ["likes", "views"];

/**
 * Handles GET requests to fetch blog data.
 *
 * - `?id=<blogId>` → Returns live Firebase data (likes/views) for client components
 * - All other queries → Returns filesystem data via localDatastore
 *
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse}
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");
  const ids = searchParams.get("ids");
  const tag = searchParams.get("tag");

  logger.info(
    `GET /api/blog/data — id=${id}, slug=${slug}, type=${type}, ids=${ids}, tag=${tag}`,
  );

  try {
    let data;

    if (id) {
      // Client components fetch dynamic metadata (likes/views) from Firebase
      data = await getDynamicMetadataById(id);
    } else {
      // All other queries go through localDatastore
      let filter;
      if (tag) {
        filter = { key: "tag", value: tag };
      } else if (slug) {
        filter = { key: "slug", value: slug };
      } else if (type) {
        filter = { key: "type", value: type };
      } else if (ids) {
        filter = { key: "id", value: ids.split(",") };
      }

      data = await getBlogs(filter);
    }

    logger.success("Successfully fetched blog data");
    return successResponse(data);
  } catch (error) {
    logger.error("Failed to fetch blog data:", error);
    return errorResponse("An error occurred while fetching blog data.", error);
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
