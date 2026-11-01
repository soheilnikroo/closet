import { describe, expect, it } from "vitest";

import { expandWebCorsOrigins } from "@/shared/http/cors-origins.js";

describe("expandWebCorsOrigins", () => {
  it("adds 127.0.0.1 twin for localhost", () => {
    expect(expandWebCorsOrigins("http://localhost:5173")).toEqual([
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ]);
  });

  it("adds localhost twin for 127.0.0.1", () => {
    expect(expandWebCorsOrigins("http://127.0.0.1:5173")).toEqual([
      "http://127.0.0.1:5173",
      "http://localhost:5173",
    ]);
  });

  it("leaves non-loopback origins unchanged", () => {
    expect(expandWebCorsOrigins("https://closet.example")).toBe("https://closet.example");
  });
});
