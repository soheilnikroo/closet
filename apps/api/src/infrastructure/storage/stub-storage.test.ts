import { describe, expect, it } from "vitest";

import { createStubObjectStorage } from "./index.js";

describe("createStubObjectStorage", () => {
  it("throws until configured", async () => {
    const storage = createStubObjectStorage();
    await expect(storage.putObject("a", new Uint8Array(), "image/jpeg")).rejects.toThrow(
      /not configured/,
    );
    await expect(storage.deleteObject("a")).rejects.toThrow(/not configured/);
  });
});
