/**
 * Centralized error types for the application.
 * Provides typed error codes and a custom Error subclass so that
 * route handlers can map errors to the correct HTTP status codes.
 */

/**
 * Frozen enum of application-level error codes.
 * Each code corresponds to a category of failure that the route layer
 * can translate into an appropriate HTTP status.
 */
export const ErrorCode = Object.freeze({
  NOT_FOUND: "NOT_FOUND",
  VALIDATION: "VALIDATION_ERROR",
  FILESYSTEM: "FILESYSTEM_ERROR",
  FIREBASE: "FIREBASE_ERROR",
  NETWORK: "NETWORK_ERROR",
  PARSE: "PARSE_ERROR",
  INTERNAL: "INTERNAL_ERROR",
});

/**
 * Maps an ErrorCode to the most appropriate HTTP status code.
 * Falls back to 500 for unknown codes.
 */
export const ERROR_CODE_TO_HTTP_STATUS = Object.freeze({
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.VALIDATION]: 400,
  [ErrorCode.FILESYSTEM]: 500,
  [ErrorCode.FIREBASE]: 502,
  [ErrorCode.NETWORK]: 502,
  [ErrorCode.PARSE]: 500,
  [ErrorCode.INTERNAL]: 500,
});

/**
 * Custom application error with a typed error code and optional cause.
 *
 * @example
 *   throw new AppError("Blog not found", ErrorCode.NOT_FOUND);
 *   throw new AppError("Failed to read file", ErrorCode.FILESYSTEM, originalError);
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human-readable description of the error.
   * @param {string} code - One of the ErrorCode enum values.
   * @param {Error} [cause] - The original error that triggered this failure.
   */
  constructor(message, code = ErrorCode.INTERNAL, cause) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.cause = cause;
  }

  /**
   * Returns the HTTP status code associated with this error's code.
   * @returns {number}
   */
  get httpStatus() {
    return ERROR_CODE_TO_HTTP_STATUS[this.code] ?? 500;
  }
}
