import { describe, expect, it } from "vitest";

import {
  conflict,
  forbidden,
  mediaNotReady,
  mediaProcessingFailed,
  notFound,
  serviceUnavailable,
  unauthorized,
  validationError,
  wardrobeTooLimited,
} from "@/shared/errors/http-error.js";

describe("http errors", () => {
  it("builds typed errors", () => {
    expect(unauthorized().statusCode).toBe(401);
    expect(forbidden().code).toBe("forbidden");
    expect(notFound().statusCode).toBe(404);
    expect(validationError("bad", { field: "x" }).details).toEqual({ field: "x" });
    expect(conflict().statusCode).toBe(409);
    expect(serviceUnavailable().statusCode).toBe(503);
    expect(wardrobeTooLimited().code).toBe("wardrobe_too_limited");
    expect(mediaProcessingFailed().statusCode).toBe(422);
    expect(mediaNotReady().code).toBe("media_not_ready");
  });
});
