import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
const root = new URL("../build/client/", import.meta.url);
const dir = root.pathname;
const manifest = JSON.parse(readFileSync(join(dir, "manifest.webmanifest"), "utf8"));
const html = readFileSync(join(dir, "index.html"), "utf8");
const sw = readFileSync(join(dir, "sw.js"), "utf8");
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "/today");
assert.equal(manifest.scope, "/");
assert(manifest.icons.some((icon) => icon.purpose === "maskable" && icon.sizes === "512x512"));
for (const icon of manifest.icons) {
  assert(statSync(join(dir, icon.src)).size > 0);
}
assert(sw.includes('url:"index.html"'), "App shell must be precached");
assert(!html.includes("fonts.googleapis.com"), "Fonts must not block on an external stylesheet");
const assets = readdirSync(join(dir, "assets"));
for (const file of assets.filter((name) => /\.(js|css|woff2)$/.test(name))) {
  assert(sw.includes(`assets/${file}`), `Offline asset missing from precache: ${file}`);
}
assert.equal(assets.filter((file) => file.endsWith(".woff2")).length, 3);
const js = assets
  .filter((file) => file.endsWith(".js"))
  .map((file) => {
    const content = readFileSync(join(dir, "assets", file));
    assert(content.length < 450 * 1024, `JS chunk exceeds 450 KiB budget: ${file}`);
    return { file, bytes: content.length, gzipBytes: gzipSync(content).length };
  });
const gzipTotal = js.reduce((sum, file) => sum + file.gzipBytes, 0);
assert(gzipTotal < 350 * 1024, "Total compressed JS exceeds 350 KiB budget");
process.stdout.write(
  JSON.stringify(
    {
      status: "passed",
      precachedAssetCount: assets.length,
      javascriptGzipKiB: +(gzipTotal / 1024).toFixed(1),
      largestChunks: js.toSorted((a, b) => b.bytes - a.bytes).slice(0, 3),
    },
    null,
    2,
  ) + "\n",
);
