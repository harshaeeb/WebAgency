// src/utils/resolveImage.ts
//
// Confirms that a path set in site.ts (e.g. site.images.hero) actually
// points at a real file in public/ before a component trusts it and
// renders an <img> tag. Without this check, a path that's set but whose
// file hasn't been uploaded yet (a very normal in-progress state for a
// new client build) would render a broken image icon instead of the
// intended placeholder box — the fallback logic in each component only
// works correctly if "no image" and "image path is wrong/missing" are
// treated the same way.
//
// This runs at build time only (Node has full filesystem access while
// Astro is building static pages) — it adds no runtime cost and never
// executes in the browser.
//
// IMPORTANT: this resolves PUBLIC_DIR from process.cwd(), not from
// import.meta.dirname/this module's own file location. Astro/Vite bundle
// this file into dist/.prerender/chunks/ (or similar) at build time, so a
// path relative to the *compiled* module's location does not point back
// at the real src/ tree — it was verified directly (via a temporary debug
// log during a real `npm run build`) that import.meta.dirname resolves to
// a transient build chunk directory, not src/utils/. process.cwd() is
// reliable here because Astro always runs the build with the project root
// as the working directory.
import { existsSync } from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");

/**
 * Returns the given image path if it both is set and actually exists
 * under public/, otherwise returns undefined so the calling component's
 * `image ? ... : <placeholder>` check falls through to the placeholder.
 */
export function resolveImage(imagePath: string | undefined): string | undefined {
  if (!imagePath) return undefined;
  const fileOnDisk = path.join(PUBLIC_DIR, imagePath);
  return existsSync(fileOnDisk) ? imagePath : undefined;
}
