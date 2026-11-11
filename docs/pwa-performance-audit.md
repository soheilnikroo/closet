# Offline and performance audit — 11 November 2026

## Behavior

- The production service worker precaches the complete SPA route tree, route chunks, styles, icons and three locally bundled font subsets. Development mode intentionally does not install a service worker.
- Installed launches open Today. Closet and Saved are manifest shortcuts. Updates remain user-controlled; returning to the app or reconnecting checks for updates at most hourly.
- Successful, schema-validated GET responses are stored in account-and-API-scoped Cache Storage. No bearer tokens are persisted. Warm views initialize from memory; older snapshots return immediately and revalidate in the background. Explicit Refresh always asks the server and reports failure honestly.
- Two seconds after opening an authenticated screen, background preparation caches the core closet, profile, discovery, reference lists and the first ten collection details. Photos are cached when viewed, with authenticated fetches, lazy visibility loading and revoked object URLs.
- Sign-out/account changes and server authentication rejection clear the account's snapshots and images. Generation checks prevent late requests from restoring cleared data. Offline Clerk restarts can display the last account's local snapshots in read-only mode without fabricating a session or token. Reconnection returns to normal Clerk authentication.
- JSON snapshots expire after 30 days and are capped at 100 entries per account. Viewed photos are capped at 40 entries, at most 2 MiB each. Storage denial/eviction does not break online use. These are device-local copies, subject to browser storage policies.
- Offline editing/uploading, AI generation, new sign-in and server writes are not queued. They require a connection; the application does not claim unsuccessful changes were saved. Uncached pages/photos cannot be downloaded offline. A first online visit and completed service-worker installation are required.

## Validation

`pnpm check` passes formatting, lint (existing API warnings remain), type checking, 147 tests and unused-code checks. `pnpm build` and `pnpm --filter @closet/web pwa:audit` pass. Nine new offline regressions cover account separation, cache invalidation, sign-out races, offline writes, explicit refresh, warm reads, slow revalidation and denied storage.

The automated production audit verifies the manifest/icons, app-shell precache, every emitted JS/CSS/font asset, no Google Fonts dependency, a 450 KiB maximum JS chunk and 350 KiB total gzip JavaScript budget. Current build: 50 precached resources, about 1.10 MiB total uncompressed precache; 307.5 KiB total gzip JS across all route chunks (not all required on initial navigation).

Browser checks used the built SPA, local mock API/data and a desktop browser; mobile layout used a 390×844 viewport. Both local servers were then stopped. A full settings reload, closet search, saved-collection navigation and collection-detail reload continued working. Explicit Refresh failed while retaining clothes and search results. No physical-device/radio test or real Clerk account was available.

| Measured scenario during audit                   |    LCP |   INP |   CLS |    FCP |  TTFB |
| ------------------------------------------------ | -----: | ----: | ----: | -----: | ----: |
| Initial local production navigation              | 540 ms | 40 ms | 0.000 | 216 ms | 15 ms |
| Cached mobile-sized launch, both servers stopped |  92 ms | 24 ms | 0.000 |  76 ms |  2 ms |

These are individual lab observations, not field percentiles, Lighthouse scores, a low-end-device simulation or a guarantee for every network. They were recorded before the final small warm-view/prefetch refinements. Official Web Vitals diagnostics are available with `?performance=1`; they send no telemetry. INP needs interaction; unsupported metrics remain explicitly unmeasured. Production field measurements across real devices are still needed to establish 75th-percentile performance.

## Repeatable commands and deployment

```sh
pnpm check
pnpm build
pnpm --filter @closet/web pwa:audit
pnpm --filter @closet/web start
```

For a separate local API, set `API_PROXY_TARGET` when starting the preview. Serve `apps/web/build/client` over HTTPS (localhost is permitted for local testing), with SPA navigation fallback to `index.html`. Route `/v1/*` and `/health` to the API before the SPA fallback. Serve `sw.js`, `index.html` and `manifest.webmanifest` with revalidation/no-cache; fingerprinted `/assets/*` can use `public, max-age=31536000, immutable`. Keep service-worker URL and scope stable between deploys. Do not place private API responses in a public CDN cache.
