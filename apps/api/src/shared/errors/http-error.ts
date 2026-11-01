import type { ApiErrorCode } from "@closet/shared";

export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: ApiErrorCode;
  readonly details: unknown;

  constructor(statusCode: number, code: ApiErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details ?? undefined;
  }
}

export function unauthorized(message = "Authentication required"): HttpError {
  return new HttpError(401, "unauthorized", message);
}

export function forbidden(message = "Forbidden"): HttpError {
  return new HttpError(403, "forbidden", message);
}

export function notFound(message = "Resource not found"): HttpError {
  return new HttpError(404, "not_found", message);
}

export function serviceUnavailable(message = "Service unavailable"): HttpError {
  return new HttpError(503, "service_unavailable", message);
}

export function validationError(message = "Validation failed", details?: unknown): HttpError {
  return new HttpError(400, "validation_error", message, details);
}

export function conflict(message = "Conflict"): HttpError {
  return new HttpError(409, "conflict", message);
}

export function wardrobeTooLimited(
  message = "Wardrobe is too limited for this recommendation",
): HttpError {
  return new HttpError(422, "wardrobe_too_limited", message);
}

export function mediaProcessingFailed(message = "Media processing failed"): HttpError {
  return new HttpError(422, "media_processing_failed", message);
}

export function mediaNotReady(message = "Media is not ready yet"): HttpError {
  return new HttpError(409, "media_not_ready", message);
}
