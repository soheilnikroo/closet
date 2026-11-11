import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearSnapshots,
  readSnapshot,
  snapshotGeneration,
  snapshotScope,
  writeSnapshot,
} from "@/shared/lib/offline/snapshot-cache.js";
import { createMockApiClient } from "@/shared/testing/mock-api.js";

import { createApiClient } from "./create-api-client.js";
const account = "offline-test";
const scope = snapshotScope("", account);
const fixture = createMockApiClient();
const token = vi.fn().mockResolvedValue("token");
const transport = vi.fn<typeof fetch>();
function client(options: { offlineOnly?: boolean; offlineAccount?: string } = {}) {
  return createApiClient({
    baseUrl: "",
    getToken: token,
    fetchImpl: transport,
    offlineAccount: account,
    ...options,
  });
}
beforeEach(async () => {
  await clearSnapshots(scope);
  vi.clearAllMocks();
});
afterEach(() => {
  vi.useRealTimers();
});
describe("offline API snapshots", () => {
  it("returns a visited page offline without contacting auth or the API", async () => {
    const me = await fixture.getMe();
    transport.mockResolvedValue(new Response(JSON.stringify(me)));
    await client().getMe();
    token.mockClear();
    transport.mockClear();
    expect(await client({ offlineOnly: true }).getMe()).toEqual(me);
    expect(token).not.toHaveBeenCalled();
    expect(transport).not.toHaveBeenCalled();
  });
  it("does not expose one account's snapshots to another", async () => {
    transport.mockResolvedValue(new Response(JSON.stringify(await fixture.getMe())));
    await client().getMe();
    await expect(
      client({ offlineOnly: true, offlineAccount: "different-account" }).getMe(),
    ).rejects.toThrow("connection");
  });
  it("serves warm navigation locally but explicit refresh requests fresh data", async () => {
    const me = await fixture.getMe();
    transport.mockImplementation(async () => new Response(JSON.stringify(me)));
    await client().getMe();
    await client().getMe();
    expect(transport).toHaveBeenCalledTimes(1);
    await client().fresh().getMe();
    expect(transport).toHaveBeenCalledTimes(2);
    await expect(client({ offlineOnly: true }).fresh().getMe()).rejects.toThrow("connection");
  });
  it("does not pretend an offline mutation succeeded", async () => {
    await expect(client({ offlineOnly: true }).updateMe({ displayName: "Ada" })).rejects.toThrow(
      "connection",
    );
    expect(transport).not.toHaveBeenCalled();
  });
  it("invalidates warm data after a successful write", async () => {
    const me = await fixture.getMe();
    transport.mockImplementation(async () => new Response(JSON.stringify(me)));
    const api = client();
    await api.getMe();
    await api.updateMe({ displayName: "Ada" });
    await api.getMe();
    expect(transport).toHaveBeenCalledTimes(3);
  });
  it("falls back on network failure but clears private snapshots on auth rejection", async () => {
    const me = await fixture.getMe();
    transport.mockImplementation(async () => new Response(JSON.stringify(me)));
    await client().getMe();
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 61_000);
    transport.mockRejectedValue(new TypeError("Failed to fetch"));
    expect(await client().getMe()).toEqual(me);
    transport.mockResolvedValue(new Response("{}", { status: 401 }));
    await expect(client().fresh().getMe()).rejects.toThrow("401");
    await expect(client({ offlineOnly: true }).getMe()).rejects.toThrow("connection");
  });
  it("does not let an in-flight response restore a signed-out account's cache", async () => {
    const generation = snapshotGeneration(scope);
    await clearSnapshots(scope);
    await writeSnapshot(scope, "/v1/users/me", await fixture.getMe(), generation);
    expect(await readSnapshot(scope, "/v1/users/me")).toBeNull();
  });
});

describe("slow and unavailable storage", () => {
  it("renders an older snapshot immediately while a slow connection revalidates", async () => {
    const me = await fixture.getMe();
    transport.mockResolvedValue(new Response(JSON.stringify(me)));
    await client().getMe();
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 61_000);
    const deferred = Promise.withResolvers<Response>();
    transport.mockReturnValue(deferred.promise);
    expect(await client().getMe()).toEqual(me);
    expect(client().cached("/v1/users/me", (value) => value)).toEqual(me);
    deferred.resolve(new Response(JSON.stringify(me)));
  });
  it("keeps online reads usable when persistent storage is denied", async () => {
    vi.stubGlobal("caches", { open: vi.fn().mockRejectedValue(new Error("Storage denied")) });
    try {
      const me = await fixture.getMe();
      transport.mockResolvedValue(new Response(JSON.stringify(me)));
      expect(await client().getMe()).toEqual(me);
      expect(await client({ offlineOnly: true }).getMe()).toEqual(me);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
