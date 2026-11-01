import path from "node:path";

import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import { pwaIncludeAssets, pwaManifest } from "./pwa.manifest.ts";
import tsconfigPaths from "./vite-tsconfig-paths.ts";
import { apiProxy } from "./vite.proxy.ts";

const rootEnvDir = path.resolve(import.meta.dirname, "../..");

export default defineConfig({
  envDir: rootEnvDir,
  clearScreen: false,
  plugins: [
    tailwindcss(),
    reactRouter(),
    // Official RR + React Compiler path: Babel sidecar (do not add @vitejs/plugin-react()).
    babel({
      include: /\.[jt]sx?$/,
      presets: [reactCompilerPreset()],
    }),
    tsconfigPaths(),
    // Manifest + virtual:pwa-register. Final SW is built in react-router buildEnd
    // (scripts/fix-pwa-precache.mjs) after SPA index.html exists — see #809.
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      outDir: "build/client",
      includeAssets: [...pwaIncludeAssets],
      manifest: { ...pwaManifest },
      workbox: {
        // Skip asset globbing here — RR emits index.html after this hook.
        // Post-build rebuild does the real precache.
        globPatterns: [],
        navigateFallback: null,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "@clerk/clerk-react",
      "i18next",
      "react-i18next",
      "motion",
      "workbox-window",
    ],
  },
  build: {
    target: "es2022",
    cssCodeSplit: true,
    modulePreload: true,
    // Faster CI logs; gzip sizes are still available via `vite-bundle-visualizer` if needed
    reportCompressedSize: false,
    sourcemap: false,
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy: apiProxy,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
    proxy: apiProxy,
  },
});
