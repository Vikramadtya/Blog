import { NextResponse } from "next/server";
import { addSubscription, validateEmail } from "./routeService";
import { errorResponse, logger, successResponse } from "../../lib/api-utils"; // Assuming this is your service function

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handles POST requests to subscribe a user for notifications.
 *
 * @param {Request} request - The incoming Next.js request object.
 * @returns {NextResponse} - The JSON response.
 */
export async function POST(request) {
  const body = await request.json();

  try {
    let email = body.email;

    logger.info(
      `Received notification subscription request for email: ${email}`,
    );

    if (!email || typeof email !== "string" || !validateEmail(email)) {
      logger.warn("Invalid email format received:", email);
      return errorResponse(
        "A valid email address is required.",
        undefined,
        400,
      );
    }

    await addSubscription(email);

    logger.success(`Successfully processed subscription for: ${email}`);
    return successResponse({
      message: "Thank you for subscribing! You're on the list.",
    });
  } catch (error) {
    logger.error(`Failed to process subscription for '${body.email}':`, error);
    return errorResponse(
      "An unexpected error occurred. Please try again later.",
      error,
    );
  }
}
