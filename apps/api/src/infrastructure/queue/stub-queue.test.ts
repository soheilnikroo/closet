import { describe, expect, it } from "vitest";

import { createStubJobQueue } from "@/infrastructure/queue/index.js";

describe("createStubJobQueue", () => {
  it("throws until configured", async () => {
    await expect(createStubJobQueue().enqueue("x", {})).rejects.toThrow(/not configured/);
  });
});
