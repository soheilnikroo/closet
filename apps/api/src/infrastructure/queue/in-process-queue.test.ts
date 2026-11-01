import { describe, expect, it, vi } from "vitest";

import { createInProcessJobQueue } from "@/infrastructure/queue/in-process-queue.js";

describe("createInProcessJobQueue", () => {
  it("runs registered handlers", async () => {
    const queue = createInProcessJobQueue();
    const handler = vi.fn().mockResolvedValue(undefined);
    queue.register("demo", handler);

    const id = await queue.enqueue("demo", { hello: "world" });
    expect(id).toMatch(/^job_/);

    await vi.waitFor(() => {
      expect(handler).toHaveBeenCalledWith({ hello: "world" });
    });
  });

  it("throws when handler is missing", async () => {
    const queue = createInProcessJobQueue();
    await expect(queue.enqueue("missing", {})).rejects.toThrow(/No handler/);
  });
});
