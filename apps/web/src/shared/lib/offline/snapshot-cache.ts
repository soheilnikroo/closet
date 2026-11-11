/** Private snapshots are partitioned by API origin and authenticated account, never by token. */
const prefix = "closet-snapshots-v1-";
const memory = new Map<string, Map<string, { savedAt: number; payload: unknown }>>();
const generations = new Map<string, number>();
const maxEntries = 100;
const maxAge = 30 * 24 * 60 * 60 * 1000;
export const offlineMessage =
  "This needs a connection. Your saved closet is still available offline.";
export function snapshotScope(baseUrl: string, account: string) {
  return `${prefix}${encodeURIComponent(baseUrl || "same-origin")}-${encodeURIComponent(account)}`;
}
function key(path: string) {
  return `https://closet-snapshot.invalid${path}`;
}
async function storage(scope: string) {
  try {
    return typeof caches === "undefined" ? null : await caches.open(scope);
  } catch {
    return null;
  }
}
export async function readSnapshot(scope: string, path: string) {
  let entry = memory.get(scope)?.get(path);
  if (!entry) {
    try {
      const response = await (await storage(scope))?.match(key(path));
      if (response) {
        entry = {
          savedAt: Number(response.headers.get("x-saved-at")),
          payload: await response.json(),
        };
      }
    } catch {
      /* Storage can be unavailable or evicted. */
    }
  }
  if (!entry || !Number.isFinite(entry.savedAt) || Date.now() - entry.savedAt > maxAge) {
    return null;
  }
  let bucket = memory.get(scope);
  if (!bucket) {
    bucket = new Map();
    memory.set(scope, bucket);
  }
  bucket.set(path, entry);
  return entry;
}
export async function writeSnapshot(
  scope: string,
  path: string,
  payload: unknown,
  generation: number,
) {
  if (generation !== snapshotGeneration(scope)) {
    return;
  }
  const savedAt = Date.now();
  let bucket = memory.get(scope);
  if (!bucket) {
    bucket = new Map();
    memory.set(scope, bucket);
  }
  bucket.delete(path);
  bucket.set(path, { savedAt, payload });
  const oldest = bucket.keys().next().value;
  if (bucket.size > maxEntries && oldest) {
    bucket.delete(oldest);
  }
  try {
    const cache = await storage(scope);
    if (!cache || generation !== snapshotGeneration(scope)) {
      return;
    }
    await cache.put(
      key(path),
      new Response(JSON.stringify(payload), {
        headers: { "Content-Type": "application/json", "x-saved-at": String(savedAt) },
      }),
    );
    if (generation !== snapshotGeneration(scope)) {
      await cache.delete(key(path));
      return;
    }
    const keys = await cache.keys();
    await Promise.all(
      keys.slice(0, Math.max(0, keys.length - maxEntries)).map((request) => cache.delete(request)),
    );
  } catch {
    /* Quota errors must not break an online request. */
  }
}
export function snapshotGeneration(scope: string) {
  return generations.get(scope) ?? 0;
}
export async function clearSnapshots(scope: string) {
  generations.set(scope, snapshotGeneration(scope) + 1);
  memory.delete(scope);
  try {
    if (typeof caches !== "undefined") {
      await Promise.all([caches.delete(scope), caches.delete(`${scope}-images`)]);
    }
  } catch {
    /* Best effort. */
  }
}
const dirtyScopes = new Map<string, number>();
export function invalidateSnapshots(scope: string) {
  dirtyScopes.set(scope, Date.now());
  generations.set(scope, snapshotGeneration(scope) + 1);
}
export function snapshotsDirty(scope: string, savedAt: number) {
  return savedAt <= (dirtyScopes.get(scope) ?? 0);
}

export function peekSnapshot(scope: string, path: string): unknown {
  const entry = memory.get(scope)?.get(path);
  return entry && Date.now() - entry.savedAt <= maxAge ? entry.payload : undefined;
}
