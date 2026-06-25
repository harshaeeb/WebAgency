// scripts/generate-images.ts
//
// Build-time image generation: run this once per client build (not on
// every `npm run build`) to turn the *Prompt fields in site.ts into real
// image files under public/images/generated/. Zero runtime cost — images
// are generated once, committed (or left in place) as static files, and
// served exactly like any other static asset.
//
// USAGE:
//   npx tsx scripts/generate-images.ts
//
// PROVIDER: deliberately left swappable. Implement `generateImage()` below
// against whichever image API you choose (OpenAI, Stability, Flux,
// Ideogram, etc.) — every other part of this script (reading prompts,
// file naming, skip-if-exists, summary output) stays the same regardless
// of provider. See the stub and the README note at the bottom for what's
// needed to wire a real provider in.
//
// This script is NOT part of the Cloudflare Pages build (astro build) —
// it's a one-time, per-client setup step you run locally before pushing,
// same category of task as registering a Twilio number or setting up
// Cal.com. Keeping it out of the build means zero added build time and
// zero risk of an image API outage breaking a deploy.

import { site, type Service } from "../src/config/site";
import { writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.resolve(import.meta.dirname, "../public/images/generated");

interface ImageJob {
  /** Output filename, e.g. "hero.jpg" — must match the path referenced in site.ts */
  filename: string;
  /** The prompt to send to the image generation provider */
  prompt: string;
}

/**
 * Swap this implementation for your chosen provider. Must return raw image
 * bytes (Buffer) for the given prompt. Everything else in this script is
 * provider-agnostic.
 *
 * Example shape for a typical REST image API:
 *
 *   async function generateImage(prompt: string): Promise<Buffer> {
 *     const res = await fetch("https://api.<provider>.com/v1/images/generate", {
 *       method: "POST",
 *       headers: {
 *         Authorization: `Bearer ${process.env.IMAGE_API_KEY}`,
 *         "Content-Type": "application/json",
 *       },
 *       body: JSON.stringify({ prompt, size: "1024x768" }),
 *     });
 *     if (!res.ok) throw new Error(`Image API error (${res.status}): ${await res.text()}`);
 *     const { imageBase64 } = await res.json();
 *     return Buffer.from(imageBase64, "base64");
 *   }
 */
async function generateImage(prompt: string): Promise<Buffer> {
  throw new Error(
    "No image provider wired in yet. Implement generateImage() in " +
    "scripts/generate-images.ts against your chosen provider " +
    "(OpenAI, Stability, Flux, Ideogram, etc.) before running this script. " +
    `Prompt that would have been sent: "${prompt}"`
  );
}

function collectImageJobs(): ImageJob[] {
  const jobs: ImageJob[] = [];

  if (site.images?.hero && site.images?.heroPrompt) {
    jobs.push({ filename: filenameFromPath(site.images.hero), prompt: site.images.heroPrompt });
  }
  if (site.images?.about && site.images?.aboutPrompt) {
    jobs.push({ filename: filenameFromPath(site.images.about), prompt: site.images.aboutPrompt });
  }
  for (const service of site.services as Service[]) {
    if (service.image && service.imagePrompt) {
      jobs.push({ filename: filenameFromPath(service.image), prompt: service.imagePrompt });
    }
  }
  return jobs;
}

function filenameFromPath(imagePath: string): string {
  // site.ts stores paths like "/images/generated/hero.jpg" — extract just
  // the filename, since this script always writes into OUTPUT_DIR.
  return path.basename(imagePath);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const jobs = collectImageJobs();
  if (jobs.length === 0) {
    console.log("No image jobs found — check that site.ts has both an image path and an *Prompt field set for each image you want generated.");
    return;
  }

  console.log(`Found ${jobs.length} image(s) to generate for ${site.business}:\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const job of jobs) {
    const outputPath = path.join(OUTPUT_DIR, job.filename);

    if (await fileExists(outputPath)) {
      console.log(`  SKIP   ${job.filename} (already exists — delete it first to regenerate)`);
      skipped++;
      continue;
    }

    try {
      console.log(`  GEN    ${job.filename}`);
      console.log(`         prompt: "${job.prompt}"`);
      const imageBuffer = await generateImage(job.prompt);
      await writeFile(outputPath, imageBuffer);
      console.log(`         saved to ${outputPath}`);
      generated++;
    } catch (err) {
      console.error(`  FAIL   ${job.filename}: ${err instanceof Error ? err.message : err}`);
      failed++;
    }
  }

  console.log(`\nDone. ${generated} generated, ${skipped} skipped, ${failed} failed.`);
  if (failed > 0) {
    console.log("\nNo provider is wired in yet by default — see the comment above generateImage() in this file.");
    process.exitCode = 1;
  }
}

main();
