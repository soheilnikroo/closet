export type ObjectStorage = {
  putObject: (key: string, body: Uint8Array, contentType: string) => Promise<void>;
  deleteObject: (key: string) => Promise<void>;
};
