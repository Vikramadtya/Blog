/**
 * Base Application Error
 */
export class AppError extends Error {
  constructor(message, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error for bad inputs
 */
export class ValidationError extends AppError {
  constructor(message) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

/**
 * Not Found Error when an entity doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(resource, identifier) {
    super(`${resource} '${identifier}' not found`, "NOT_FOUND", 404);
  }
}

/**
 * Infrastructure Error for file system or database failures
 */
export class InfrastructureError extends AppError {
  constructor(message, originalError) {
    super(message, "INFRASTRUCTURE_ERROR", 500);
    this.originalError = originalError;
  }
}
