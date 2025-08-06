import {
  getAllBlogWithTag,
  getBlogs,
  incrementMetadataField,
} from "./routeService";
import { NextResponse } from "next/server";

import { getDocumentById } from "../../lib/commons";
import datastore from "../../lib/datastore-info";
import { errorResponse, logger, successResponse } from "../../lib/api-utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handles GET requests to fetch blog data.
 * Supports fetching by ID, slug, or type.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} - The response containing the blog data or an error message.
 */
export async function GET(request) {
  logger.info(`Received request to get data`);

  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");
  const ids = searchParams.get("ids");
  const tag = searchParams.get("tag");

  logger.info(
    `Received request with params: id=${id}, slug=${slug}, type=${type}, ids=${ids}`,
  );

  try {
    let data;
    if (id) {
      data = await getDocumentById(
        id,
        datastore.blog.converter,
        datastore.blog.name,
        datastore.blog.type,
      );
    } else if (tag) {
      logger.info(`Fetching blogs by tag: ${tag}`);
      data = await getAllBlogWithTag({ key: "tag", value: tag });
    } else if (slug) {
      logger.info(`Fetching blogs by slug: ${slug}`);
      data = await getBlogs({ key: "slug", value: slug });
    } else if (type) {
      logger.info(`Fetching blogs by type: ${type}`);
      data = await getBlogs({ key: "type", value: type });
    } else if (ids) {
      logger.info(`Fetching blogs by ID: ${ids}`);
      data = await getBlogs({ key: "id", value: ids.split(",") });
    } else {
      logger.info("Fetching all blogs");
      data = await getBlogs();
    }
    logger.success("Successfully fetched blog data.");
    return successResponse(data);
  } catch (error) {
    logger.error("An error occurred while fetching blog data:", error);
    return errorResponse("An error occurred while fetching blog data.", error);
  }
}

/**
 * Handles POST requests to increment a specific metadata field (e.g., "likes" or "views").
 *
 * @param {Request} request - The incoming Next.js request object.
 * @returns {NextResponse} - The JSON response.
 */
export async function POST(request) {
  logger.info(`Received request to increment data`);

  const body = await request.json();

  try {
    let id = body.id;
    let field = body.field;

    const validFields = ["likes", "views"];

    logger.info(
      `Received request to increment '${field}' for document ID: ${id}`,
    );

    if (!id || !field || !validFields.includes(field)) {
      logger.warn("Invalid request body received:", { id, field });
      return errorResponse(
        `Invalid request. 'id' and a valid 'field' (${validFields.join(" or ")}) are required.`,
        undefined,
        400,
      );
    }

    const updatedData = await incrementMetadataField(id, field);

    logger.success(`Successfully incremented '${field}' for ID: ${id}`);
    return successResponse(updatedData);
  } catch (error) {
    logger.error(
      `Failed to increment '${body.field}' for ID: ${body.id}:`,
      error,
    );
    return errorResponse("An error occurred while updating metadata.", error);
  }
}
