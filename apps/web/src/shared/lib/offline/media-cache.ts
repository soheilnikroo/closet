import { snapshotGeneration } from "./snapshot-cache.js";

export async function garmentBlob(
  scope: string,
  url: string,
  getToken: () => Promise<string | null>,
  offlineOnly: boolean,
): Promise<Blob> {
  const generation = snapshotGeneration(scope);
  let cache: Cache | undefined;
  try {
    if (typeof caches !== "undefined") {
      cache = await caches.open(`${scope}-images`);
    }
    const saved = await cache?.match(url);
    if (saved) {
      return await saved.blob();
    }
  } catch {
    /* Continue online if storage is unavailable. */
  }
  if (offlineOnly || !navigator.onLine) {
    throw new Error("Image is not saved offline yet");
  }
  const token = await getToken();
  if (!token) {
    throw new Error("Sign in to load this image");
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) {
    throw new Error("Image unavailable");
  }
  const blob = await response.blob();
  if (!blob.type.startsWith("image/") || blob.type === "image/svg+xml") {
    throw new Error("Unsupported image");
  }
  if (cache && blob.size <= 2 * 1024 * 1024 && generation === snapshotGeneration(scope)) {
    try {
      await cache.put(url, new Response(blob));
      if (generation !== snapshotGeneration(scope)) {
        await cache.delete(url);
        return blob;
      }
      const keys = await cache.keys();
      await Promise.all(
        keys.slice(0, Math.max(0, keys.length - 40)).map((entry) => cache?.delete(entry)),
      );
    } catch {
      /* Storage pressure should not hide a downloaded photo. */
    }
  }
  return blob;
}
