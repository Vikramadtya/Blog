import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";

const sha256 = (value) => createHash("sha256").update(value).digest();

/**
 * Admin routes are only reachable in development (enforced by src/middleware.js).
 * This is defence in depth: outside development a bearer ADMIN_SECRET is required.
 */
export function checkAdminAuth(req) {
  if (process.env.NODE_ENV === "development") return null;
  const secret = process.env.ADMIN_SECRET;
  const supplied = req.headers.get("Authorization") ?? "";
  if (
    !secret ||
    !timingSafeEqual(sha256(supplied), sha256(`Bearer ${secret}`))
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function errorResponse(error, fallbackStatus = 500) {
  const status =
    error?.status || (error?.code === "ENOENT" ? 404 : fallbackStatus);
  const message =
    status >= 500
      ? "Internal server error"
      : error.code === "ENOENT"
        ? "Not found"
        : error.message;
  if (status >= 500) console.error(error);
  return NextResponse.json({ success: false, error: message }, { status });
}
