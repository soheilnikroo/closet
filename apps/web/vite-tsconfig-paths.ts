import fs from "node:fs";
import path from "node:path";

import type { Plugin } from "vite";

const EXTENSIONS = [".tsx", ".ts", ".jsx", ".js", ".css"] as const;

function resolveFile(candidate: string): string | null {
  const candidates = [candidate];

  if (candidate.endsWith(".js")) {
    candidates.push(candidate.slice(0, -3));
  }

  for (const base of candidates) {
    if (fs.existsSync(base) && fs.statSync(base).isFile()) {
      return base;
    }

    for (const extension of EXTENSIONS) {
      const withExtension = `${base}${extension}`;
      if (fs.existsSync(withExtension) && fs.statSync(withExtension).isFile()) {
        return withExtension;
      }
    }

    if (fs.existsSync(base) && fs.statSync(base).isDirectory()) {
      for (const extension of EXTENSIONS) {
        const indexFile = path.join(base, `index${extension}`);
        if (fs.existsSync(indexFile) && fs.statSync(indexFile).isFile()) {
          return indexFile;
        }
      }
    }
  }

  return null;
}

/**
 * Minimal path alias plugin so we avoid an extra dependency.
 * Maps `@/*` → `src/*` and `~/*` → project root.
 */
export default function tsconfigPaths(): Plugin {
  const srcRoot = path.resolve(import.meta.dirname, "src");
  const projectRoot = path.resolve(import.meta.dirname);

  return {
    name: "closet-tsconfig-paths",
    enforce: "pre",
    resolveId(source) {
      const queryIndex = source.indexOf("?");
      const id = queryIndex === -1 ? source : source.slice(0, queryIndex);
      const query = queryIndex === -1 ? "" : source.slice(queryIndex);

      let absolute: string | null = null;

      if (id.startsWith("@/")) {
        absolute = path.join(srcRoot, id.slice(2));
      } else if (id.startsWith("~/")) {
        absolute = path.join(projectRoot, id.slice(2));
      }

      if (!absolute) {
        return null;
      }

      const resolved = resolveFile(absolute);
      return resolved ? `${resolved}${query}` : null;
    },
  };
}
