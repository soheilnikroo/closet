import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { createLocalObjectStorage } from "@/infrastructure/storage/local-storage.js";

describe("createLocalObjectStorage", () => {
  let dir = "";

  afterEach(async () => {
    if (dir) {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("writes, reads, and deletes objects", async () => {
    dir = await mkdtemp(path.join(tmpdir(), "closet-storage-"));
    const storage = createLocalObjectStorage(dir);
    const key = "user/a.jpg";
    const bytes = new Uint8Array([1, 2, 3, 4]);

    await storage.putObject(key, bytes, "image/jpeg");
    expect(storage.resolvePath(key)).toContain(key);

    const loaded = await storage.getObject(key);
    expect(Array.from(loaded)).toEqual([1, 2, 3, 4]);

    await storage.deleteObject(key);
    await storage.deleteObject(key);
  });
});
