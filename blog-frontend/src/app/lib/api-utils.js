import { NextResponse } from "next/server";

// A simple server-side logger
const logger = {
  info: (message, ...args) => console.log(`[API INFO] ${message}`, ...args),
  error: (message, ...args) => console.error(`[API ERROR] ${message}`, ...args),
};

/**
 * Sends a success JSON response using NextResponse.
 * @param {any} data - The payload to send.
 * @param {number} [status=200] - The HTTP status code.
 * @returns {NextResponse}
 */
export function successResponse(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Sends an error JSON response using NextResponse.
 * @param {string} message - The error message.
 * @param {number} [status=500] - The HTTP status code.
 * @returns {NextResponse}
 */
export function errorResponse(message, status = 500) {
  logger.error(message);
  return NextResponse.json({ success: false, error: { message } }, { status });
}
