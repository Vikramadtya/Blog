import { NextResponse } from "next/server";
import { consola } from "consola";

// A simple server-side logger
export const logger = {
  info: (message) => consola.info(`[API BACKEND INFO] ${message}`),
  error: (message) => consola.error(`[API BACKEND ERROR] ${message}`),
  debug: (message) => consola.debug(`[API BACKEND DEBUG] ${message}`),
  success: (message) => consola.success(`[API BACKEND SUCCESS] ${message}`),
  warn: (message) => consola.warn(`[API BACKEND WARN] ${message}`),
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
export function errorResponse(message, error, status = 500) {
  logger.error(message);
  return NextResponse.json(
    {
      success: false,
      message: { message },
      error:
        process.env.NODE_ENV !== "production" && error
          ? error.message
          : undefined,
    },
    { status },
  );
}
