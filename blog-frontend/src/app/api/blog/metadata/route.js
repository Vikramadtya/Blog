import {
  getMetaData,
  getMetaDataById,
  incrementMetadataField,
} from "./routeService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handles GET requests for blog metadata.
 * @param {Request} request - The incoming request.
 * @returns {NextResponse} - The response containing the metadata.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const data = id ? await getMetaDataById(id) : await getMetaData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while fetching metadata.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * Handles POST requests to increment metadata fields (likes or views).
 * @param {Request} request - The incoming request.
 * @returns {NextResponse} - The response containing the updated metadata.
 */
export async function POST(request) {
  try {
    const { id, field } = await request.json(); // Expecting `field` to be "likes" or "views"
    if (!id || !field || !["likes", "views"].includes(field)) {
      return NextResponse.json(
        { message: "Invalid request body." },
        { status: 400 },
      );
    }
    const updatedData = await incrementMetadataField(id, field);
    return NextResponse.json(updatedData);
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while updating metadata.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
