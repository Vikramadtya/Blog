import { NextResponse } from "next/server";
import { consola } from "consola";
import { AppError } from "./errors";

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
 *
 * If the error is an AppError, the HTTP status is derived from its error code.
 * Otherwise, falls back to the provided status (default 500).
 *
 * @param {string} message - The error message.
 * @param {Error} [error] - The original error object.
 * @param {number} [status=500] - Fallback HTTP status code.
 * @returns {NextResponse}
 */
export function errorResponse(message, error, status = 500) {
  logger.error(message);

  const httpStatus = error instanceof AppError ? error.httpStatus : status;

  return NextResponse.json(
    {
      success: false,
      message,
      ...(process.env.NODE_ENV !== "production" &&
        error && {
          error: error.message,
          code: error instanceof AppError ? error.code : undefined,
        }),
    },
    { status: httpStatus },
  );
}
