import type { ObjectStorage } from "@/infrastructure/storage/object-storage.types.js";

export type { ObjectStorage } from "@/infrastructure/storage/object-storage.types.js";

export function createStubObjectStorage(): ObjectStorage {
  return {
    async putObject() {
      throw new Error("Object storage is not configured yet");
    },
    async deleteObject() {
      throw new Error("Object storage is not configured yet");
    },
  };
}

export {
  createLocalObjectStorage,
  type LocalObjectStorage,
} from "@/infrastructure/storage/local-storage.js";
