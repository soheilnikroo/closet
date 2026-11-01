import { mkdir, unlink, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

import type { ObjectStorage } from "@/infrastructure/storage/object-storage.types.js";

export type LocalObjectStorage = ObjectStorage & {
  getObject: (key: string) => Promise<Uint8Array>;
  resolvePath: (key: string) => string;
};

export function createLocalObjectStorage(baseDir: string): LocalObjectStorage {
  const root = path.resolve(baseDir);

  async function ensureDir(key: string): Promise<string> {
    const fullPath = path.join(root, key);
    await mkdir(path.dirname(fullPath), { recursive: true });
    return fullPath;
  }

  return {
    resolvePath(key) {
      return path.join(root, key);
    },

    async getObject(key) {
      const fullPath = path.join(root, key);
      const buffer = await readFile(fullPath);
      return new Uint8Array(buffer);
    },

    async putObject(key, body, _contentType) {
      const fullPath = await ensureDir(key);
      await writeFile(fullPath, body);
    },

    async deleteObject(key) {
      const fullPath = path.join(root, key);
      try {
        await unlink(fullPath);
      } catch {
        // ignore missing files
      }
    },
  };
}
