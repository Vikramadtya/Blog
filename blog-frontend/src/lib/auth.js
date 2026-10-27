import { NextResponse } from "next/server";

/**
 * Admin routes are only reachable in development (enforced by src/middleware.js).
 * This is defence in depth: outside development a bearer ADMIN_SECRET is required.
 */
export function checkAdminAuth(req) {
  if (process.env.NODE_ENV === "development") return null;
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers.get("Authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return null;
}

export function errorResponse(error, fallbackStatus = 500) {
  const status = error?.status || fallbackStatus;
  const message = status >= 500 ? "Internal server error" : error.message;
  if (status >= 500) console.error(error);
  return NextResponse.json({ success: false, error: message }, { status });
}
