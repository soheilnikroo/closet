/**
 * React Router Framework SPA emits index.html after vite-plugin-pwa's generateSW
 * hook, so rebuild the Workbox SW against the final build/client tree.
 *
 * Invoked from react-router.config.ts `buildEnd` (and manually via this script).
 *
 * @see https://github.com/vite-pwa/vite-plugin-pwa/issues/809
 */
import { existsSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { generateSW } from "workbox-build";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = join(root, "build/client");

export async function rebuildPwaServiceWorker() {
  const indexPath = join(clientDir, "index.html");

  if (!existsSync(indexPath)) {
    throw new Error("[pwa] index.html is missing; refusing to ship an incomplete offline shell");
  }

  // Drop SW artifacts from the earlier (pre-index.html) vite-plugin-pwa pass.
  for (const name of readdirSync(clientDir)) {
    if (name === "sw.js" || /^workbox-.*\.js$/.test(name)) {
      unlinkSync(join(clientDir, name));
    }
  }

  const { count, size, warnings } = await generateSW({
    globDirectory: clientDir,
    globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2,webmanifest}"],
    globIgnores: ["sw.js", "workbox-*.js"],
    swDest: join(clientDir, "sw.js"),
    navigateFallback: "index.html",
    navigateFallbackDenylist: [/^\/v1\//, /^\/health(?:\/|$)/],
    cleanupOutdatedCaches: true,
    // Matches vite-plugin-pwa registerType: "prompt"
    skipWaiting: false,
    clientsClaim: true,
    // Never cache API JSON globally: private data lives in account-scoped snapshots.
    maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
  });

  for (const warning of warnings) {
    throw new Error(`[pwa] incomplete precache: ${warning}`);
  }

  process.stdout.write(
    `[pwa] rebuilt service worker — ${String(count)} precached files (${(size / 1024).toFixed(2)} KiB)\n`,
  );
}

const invokedDirectly =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  await rebuildPwaServiceWorker();
}
