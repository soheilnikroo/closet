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
