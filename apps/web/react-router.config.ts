import type { Config } from "@react-router/dev/config";

import { rebuildPwaServiceWorker } from "./scripts/fix-pwa-precache.mjs";

export default {
  ssr: false,
  appDirectory: "app",
  // SPA + PWA: load the full route tree with the shell so offline nav
  // does not depend on lazy /__manifest fetches.
  routeDiscovery: { mode: "initial" },
  async buildEnd() {
    await rebuildPwaServiceWorker();
  },
} satisfies Config;
