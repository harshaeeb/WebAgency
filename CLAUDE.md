# CLAUDE.md — Repository Root

This repo has two parts:

- `docs/` — business documents (contract template, financial model,
  outreach scripts, and the full technical strategy doc). Reference
  material, not code. Read `docs/Website_Development_Hosting_Strategy.docx`
  for the reasoning behind every architectural decision below if you need
  the "why," not just the "what."
- `website-template/` — the actual Astro project. **This is almost
  certainly what you're here to work on.** It has its own `CLAUDE.md` with
  detailed build conventions, a per-client build checklist, and an SEO
  checklist — read `website-template/CLAUDE.md` before making any changes
  there.

## Quick orientation

This is a website agency's master template, cloned and customized per
client (one client = one repo, started as a copy of `website-template/`).
The business targets blue-collar trade businesses (HVAC, plumbing,
electrical, roofing, etc.) in the North Dallas metroplex. Revenue model is
a one-time build fee plus a recurring monthly care plan; the architecture
is deliberately optimized to keep recurring cost near $0 except for the
SMS upsell, which has real per-message cost and is always priced
separately — see Section 4 of the strategy doc for the full cost table.

## Current state (as of this handoff)

`website-template/` is a complete, tested, building project — not a
scaffold:

- All pages and components are implemented and working: Home, About,
  Services (with one dedicated static page per service via
  `getStaticPaths`), Contact.
- The visual design uses a build-time-generated brand palette: a single
  `site.brandColor` hex value is expanded into a full 11-step OKLCH tonal
  scale (`src/utils/palette.ts`) and injected as CSS variables in every
  page, driving gradients, tinted section backgrounds, and card depth
  throughout — not just a single flat accent color.
- Hero, About, and each service have an image slot (`site.images.hero`,
  `site.images.about`, `service.image`) paired with a `*Prompt` field for
  build-time AI image generation (`scripts/generate-images.ts`, run via
  `npm run generate-images`). No image provider is wired in yet — see
  "Known gaps" below — but every component gracefully falls back to a
  labeled, on-brand placeholder box when no image exists, so the site is
  fully previewable without any images generated.
- `npm run build` passes (7 pages built) and `npx astro check` passes with
  0 errors, 0 warnings, as of this commit — verified from a true clean
  `npm ci` checkout, not just the working directory.
- `src/config/site.ts` is filled in with a realistic demo business ("Smith
  Plumbing Co.") so the project runs and looks complete out of the box —
  replace every value in that one file to start a real client build.
- Both upsell toggles (`features.reviewsWidget`, `features.booking`) were
  manually tested by temporarily setting them to `true`, confirming the
  conditional components render, then reverted to their correct default
  (`false`).

## Known gaps — not bugs, just not built yet

- **No AI image provider wired in.** `scripts/generate-images.ts` has the
  full pipeline built (reads prompts from `site.ts`, file naming,
  skip-if-exists, summary reporting) but `generateImage()` itself throws a
  clear error until a real provider (OpenAI, Stability, Flux, Ideogram,
  etc.) is implemented against it — left as an open decision rather than
  guessed at. Every component already handles the "no image yet" case via
  a labeled placeholder fallback, so this isn't blocking — the site is
  fully previewable and demo-able without it.
- **MMS photo attachments in `functions/api/inquiry.ts`**: Twilio's
  `MediaUrl` parameter needs a public URL; the form currently reads the
  photo as base64, which can't be passed directly. The fix is uploading
  the photo to object storage (Cloudflare R2 is the natural choice given
  the rest of the stack) before calling Twilio, then passing that URL.
  This only matters once SMS forwarding is actually sold to a client whose
  leads include photos — not needed for the base build.
- **Reviews widget embed**: `ReviewsWidget.astro` has a placeholder block
  for the upsell case (`features.reviewsWidget: true`) — no specific
  third-party reviews-widget provider has been chosen yet, so there's no
  real embed snippet wired in. Pick a provider and wire its snippet into
  that block when the upsell is first sold.
- **`npm audit` flags a moderate-severity vulnerability** in `yaml`, a
  transitive dependency of `@astrojs/check` (dev-only editor tooling, not
  part of the production build or any deployed site). Not fixed
  deliberately — the available fix is a breaking downgrade of
  `@astrojs/check` for a dev-tool-only, non-runtime issue. Revisit if a
  non-breaking fix becomes available upstream.
- **No real client has been onboarded yet.** Everything here is the
  template and demo content; there's no second repo yet representing an
  actual client site.

## Working in this repo with Claude Code

- If you're building a feature or fixing something in the template itself,
  work in `website-template/` and follow its `CLAUDE.md`.
- If you're starting a new client build, that's normally a **separate
  repo** (a clone of `website-template/`), not a change to this repo — see
  "Per-client build steps" in `website-template/CLAUDE.md`.
- Run `npm run build` and `npx astro check` from inside `website-template/`
  before considering any change done — both were clean as of this commit,
  so a new failure is almost certainly from the change just made, not
  pre-existing.
