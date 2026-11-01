export type ObjectStorage = {
  putObject: (key: string, body: Uint8Array, contentType: string) => Promise<void>;
  deleteObject: (key: string) => Promise<void>;
};

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
