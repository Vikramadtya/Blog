import { notify } from "./routeService";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Handles POST requests for user notifications.
 * @param {Request} request - The incoming request.
 * @returns {NextResponse} - The response indicating the outcome.
 */
export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 },
      );
    }
    await notify(email);
    return NextResponse.json({ message: "Subscription successful." });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred during notification.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
