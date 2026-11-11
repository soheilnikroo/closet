import type { ManifestOptions } from "vite-plugin-pwa";

/** Shared web app manifest — used by VitePWA and kept in sync with root theme-color. */
export const pwaManifest = {
  id: "/",
  name: "Closet",
  short_name: "Closet",
  description: "Your personal AI stylist and digital closet",
  theme_color: "#f9fbf6",
  background_color: "#f9fbf6",
  display: "standalone",
  orientation: "portrait-primary",
  start_url: "/",
  scope: "/",
  lang: "en-GB",
  categories: ["lifestyle", "utilities"],
  icons: [
    {
      src: "pwa-64x64.png",
      sizes: "64x64",
      type: "image/png",
    },
    {
      src: "pwa-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "pwa-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "maskable-icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
} as const satisfies Partial<ManifestOptions>;

export const pwaIncludeAssets = [
  "favicon.ico",
  "favicon.svg",
  "apple-touch-icon-180x180.png",
  "pwa-64x64.png",
  "pwa-192x192.png",
  "pwa-512x512.png",
  "maskable-icon-512x512.png",
] as const;

/** Paths the service worker must never hijack (API + health). */
export const pwaNavigateFallbackDenylist = [/^\/v1\//, /^\/health(?:\/|$)/];
