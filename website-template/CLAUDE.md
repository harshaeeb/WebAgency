# CLAUDE.md — Build Conventions for This Template

This repository is the master template for every client website. A new client
site starts as a copy of this repo. Read this file before making any changes.

## Golden rule

**All client-specific content lives in `src/config/site.ts` — nothing else.**
Never hard-code a business name, phone number, service, color, or address
directly into a component or page. Every component reads from `site.ts`.
If you find yourself typing a client's name into a `.astro` file, stop —
that value should come from the config import instead.

The repo currently contains a realistic demo business ("Smith Plumbing
Co.") filled into `site.ts` so the template is demo-ready out of the box.
Replace every value in that file with the real client's details when
starting a build — do not edit any other file to do so.

## Repository structure (as actually built)

```
website-template/
├── CLAUDE.md
├── astro.config.mjs            ← set `site:` to the client's real domain before launch
├── src/
│   ├── config/
│   │   └── site.ts             ← the only file that changes per client
│   ├── utils/
│   │   ├── palette.ts          ← derives the full brand color scale from site.brandColor
│   │   └── resolveImage.ts     ← confirms an image path in site.ts actually exists on disk
│   ├── components/
│   │   ├── Header.astro        (persistent click-to-call CTA)
│   │   ├── Hero.astro          (gradient brand wash + hero image, falls back to placeholder)
│   │   ├── ServicesGrid.astro  (accepts `compact` and `hideHeading` props; per-service images)
│   │   ├── ReviewsWidget.astro       (renders link OR embed based on site.features.reviewsWidget)
│   │   ├── ContactForm.astro         (posts to /api/inquiry, progressive enhancement via fetch)
│   │   ├── BookingEmbed.astro        (renders nothing unless site.features.booking)
│   │   ├── ClickToCall.astro         (reusable mid-page CTA, separate from Header's)
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Base.astro          (LocalBusiness schema markup + generated brand CSS vars, both from site.ts)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro                 ← two-column layout with site.images.about
│   │   ├── services.astro              ← full services listing
│   │   ├── services/[slug].astro       ← one dedicated page per service, via getStaticPaths
│   │   └── contact.astro
│   └── styles/
│       └── global.css          (Tailwind import + static fallback brand vars)
├── functions/
│   └── api/
│       └── inquiry.ts          ← form handling + email (every client) + SMS (if upsell active)
└── public/
    └── images/                 ← manually uploaded client photos go here directly, empty by default
```

There is no build step or script involved in images — every image is a
file manually placed under `public/images/`, referenced by its path in
`site.ts`. See "Image uploads" below.

## Per-client build steps

When given a new client's details, do the following in order:

1. Open `src/config/site.ts` and replace every value: `business`, `tagline`,
   `phone`, `phoneDisplay`, `email`, `emailDomain`, `address`, `city`,
   `state`, `zip`, `serviceAreas`, `services` (name/slug/descriptions),
   `brandColor`, `yearsInBusiness`, `googleReviewLink`, `googleRating`,
   `googleReviewCount`.
2. Set `brandColor` to the client's actual brand color (a single hex value)
   — `src/utils/palette.ts` derives the entire visual palette from this one
   value at build time. No other file needs to change to re-theme the site.
   See "Brand color & palette system" below before touching any component
   styling directly.
3. Gather client photos (their own, or licensed stock if they have none)
   and drop them into `public/images/` — there is no AI generation step
   and no `generated/` subfolder distinction; every image is a manually
   placed file. Set the matching path in `site.ts` (`images.hero`,
   `images.about`, each service's `image`), e.g. `"/images/hero.jpg"`.
   Leave a field unset if no photo is available yet — every component
   automatically falls back to a labeled placeholder box, checked against
   the actual filesystem at build time (see "Image uploads" below), so an
   unset or wrong path never produces a broken image icon.
4. Set each flag in `features` based on what the client purchased:
   - `reviewsWidget: true` → also confirm the reviews widget embed snippet/ID is available, and wire it into the placeholder block in `ReviewsWidget.astro`.
   - `booking: true` → fill in `calLink` once the client's Cal.com account is set up.
   - `smsForwarding: true` → fill in `ownerCell` in E.164 format (e.g. `+19725550148`), and set the `TWILIO_*` environment variables in Cloudflare Pages.
5. Update `astro.config.mjs`'s `site:` value to the client's real production domain — the sitemap and canonical URLs depend on this being correct.
6. Each entry in `services` automatically gets its own page at `/services/[slug]` via `getStaticPaths` in `src/pages/services/[slug].astro` — you do not need to create pages manually. If the client serves multiple distinct towns with meaningfully different content, extend this same pattern for service-area pages.
7. Replace the placeholder copy in `about.astro` (marked with a `[Replace with...]` bracket) with the client's real story.
8. Set the `RESEND_API_KEY` (and `TWILIO_*` if SMS is active) as environment variables in the Cloudflare Pages project settings — never commit these to the repo.
9. Run the SEO checklist (below) on every page before considering the build done.
10. Preview locally with `npm run dev`, and run `npx astro check` to confirm no type errors before pushing.
11. Push to the client's git repository — Cloudflare Pages builds and deploys automatically on push.
12. Connect the custom domain in Cloudflare Pages.
13. If the booking upsell was purchased: set up the client's Cal.com account, connect their Google Calendar, configure event types per service, and drop the `calLink` into the config.
14. If the SMS upsell was purchased: register the Twilio number for 10DLC, set `ownerCell` in the config, and verify a test inquiry forwards correctly — including confirming the Cloudflare R2 (or similar) wiring for MMS photo attachments, noted as a follow-up step in `inquiry.ts`.
15. Set up or claim the client's Google Business Profile and submit the sitemap to Google Search Console.

## Local development

When starting the dev server during a build session, run it in the
background rather than blocking the session:

```
npm run dev &
```

Then use `npx astro check` and `npm run build` (which also runs in the
foreground and exits) to verify correctness without needing a long-running
process.

## Brand color & palette system

`src/utils/palette.ts` derives an 11-step OKLCH tonal scale (50 through
950) from the single `site.brandColor` hex value, at build time, with zero
external dependencies beyond the `culori` color library used for correct
hex↔OKLCH conversion. `Base.astro` calls `generateBrandCssVars()` and
injects the result as CSS custom properties (`--brand-50` through
`--brand-950`, plus semantic aliases `--brand`, `--brand-dark`,
`--brand-surface`, `--brand-surface-strong`) on every page.

**Why OKLCH, not RGB/hex math**: shifting lightness in OKLCH keeps hue and
saturation looking visually correct at every step. The same math done in
plain RGB tends to produce muddy or unevenly-spaced shades, especially on
saturated brand colors — this is also why Tailwind v4 itself moved its own
default palette to OKLCH. The lightness and chroma curves in `palette.ts`
were visually verified against several test hues (blue, red, green,
orange) before being set as the defaults — see the comments in that file
if you need to retune the curve for an unusual brand color.

**Using the palette in components**: reference the CSS variables directly
via Tailwind's arbitrary-value syntax, e.g. `bg-[var(--brand-50)]`,
`text-[var(--brand-700)]`, `shadow-[var(--brand-100)]`. Do not hard-code a
hex value or a Tailwind named color (like `bg-blue-50`) anywhere a brand
color should appear — always use the generated variable so the palette
stays a one-config-value change.

**Changing a client's brand color**: edit only `site.brandColor` in
`site.ts`. Every page re-themes automatically on the next build — no
component needs to change.

## Image uploads

There is no AI image generation anywhere in this template or its build
pipeline — every image is a real file, manually uploaded to
`public/images/`, sourced either from the client directly or from
licensed stock. This was a deliberate decision; an earlier version of this
template included a build-time AI generation script, which was removed in
favor of manual uploads only.

`site.ts` has an `images` block (`hero`, `about`) and a per-service
`image` field. Each is a plain string path, e.g. `"/images/hero.jpg"`,
pointing at a file under `public/images/`. To add a photo: drop the file
into `public/images/`, then set the matching field in `site.ts` to its
path. To remove one (or before a photo is ready), leave the field unset.

**Every component checks the filesystem at build time, not just whether
the config value is set.** `src/utils/resolveImage.ts` calls
`existsSync()` against the actual file before any component trusts an
image path — this matters because a path can be set in `site.ts` before
the corresponding file has actually been uploaded (a very normal
in-progress state), and without this check that would render a broken
image icon instead of the intended placeholder. `Hero.astro`,
`ServicesGrid.astro`, `about.astro`, and `services/[slug].astro` all call
`resolveImage()` rather than checking `site.images.hero` (etc.) directly —
**do not bypass this utility** by reading an image path straight from
`site.ts` in a new component; always route it through `resolveImage()`
first, or a missing file will silently break instead of falling back.

One real bug this caught during development: a naive implementation
resolved `public/` relative to the utility module's own file location
(`import.meta.dirname`) — but Astro/Vite bundle that module into a
transient build chunk directory at actual build time, so the relative
path pointed at the wrong place entirely and every image silently failed
to resolve, even when the file genuinely existed. The fix was anchoring
to `process.cwd()` instead, which Astro always sets to the project root
during a build. If you ever touch `resolveImage.ts`, re-verify this with
an actual `npm run build` (not just `astro check`) before trusting it —
the bug was invisible to the type checker and only showed up by checking
the real rendered output.

**Components handle the "no image yet" case gracefully** — every
placeholder is a labeled, brand-tinted box, not a generic broken-image
icon and not stock photography. This means you can build and preview a
client's full site, including layout and copy, before any real photos
exist.

**Don't commit synthetic/placeholder test images** to `public/images/` —
if no real photo exists yet, leave the relevant `site.ts` field unset
(a `.gitkeep` preserves the empty directory in git) so the intentional
placeholder boxes render instead. A fake-but-plausible-looking image is
worse than an obvious placeholder, per the "don't use stock photography
in placeholders" rule below.

## On-page SEO checklist (apply to every page, every build)

- **Title tag**: `[Service or Page] in [City] | [Business Name]`
  e.g. "Emergency Plumbing in Plano, TX | Smith Plumbing Co." — see how
  `services/[slug].astro` and the other pages construct `title` from `site.ts`.
- **Meta description**: one or two plain-language sentences, no keyword stuffing.
- **One `<h1>` per page**, containing the page's main topic naturally.
- **Image alt text**: descriptive and locally relevant, e.g.
  `alt="completed roof repair in Plano, TX"`, never `alt="img1"`.
- **Clean URLs**: `/services/roof-repair`, not `/page?id=4827`. Astro's
  file-based routing handles this natively if pages/slugs are named sensibly.
- **LocalBusiness schema markup**: lives once in `Base.astro`, populated
  entirely from `site.ts` — confirm `business`, `address`, `phone`, and
  service area are all correctly reflected before launch.
- **NAP consistency**: the business name, address, and phone must appear in
  the *exact same format* everywhere on the site. `site.ts` is the single
  source of truth specifically to prevent mismatches here.
- **XML sitemap**: generated automatically by `@astrojs/sitemap` at build
  time, provided `astro.config.mjs`'s `site:` is set correctly. Submit to
  Google Search Console once at launch.
- **Dedicated pages per service/area**: required, not optional — this is
  what lets a multi-service or multi-town client rank for multiple distinct
  searches instead of one generic one. Already automatic for services via
  `getStaticPaths`; replicate the pattern for service areas if needed.

## Feature implementation notes

- **Reviews**: default is a styled button linking to `site.googleReviewLink`.
  Only the embedded widget block in `ReviewsWidget.astro` renders if
  `site.features.reviewsWidget` is true — the embed is a paid upsell, not a
  default, and the actual third-party snippet still needs to be wired into
  the placeholder block when this is sold.
- **Contact form**: always posts to `/api/inquiry` (the Cloudflare Function
  in `functions/api/inquiry.ts`). Do not wire the form to Formspree,
  Web3Forms, or any third-party form backend — this template intentionally
  self-handles form submission and email via Resend for every client,
  regardless of which upsells are active.
- **Booking**: `BookingEmbed.astro` renders nothing if `site.features.booking`
  is false. When true, it embeds `site.calLink` via Cal.com's official embed
  snippet — Cal.com handles availability and Google Calendar sync entirely;
  no custom calendar logic belongs in this codebase.
- **SMS forwarding**: handled inside `inquiry.ts`. Do not build a separate
  endpoint for this — it must stay in the same function as the email send
  so a single form submission triggers both notifications when SMS is active.
  Note the inline comment in `inquiry.ts` about MMS photo attachments
  needing a public URL (Cloudflare R2 or similar) — this is a real follow-up
  wiring step, not yet implemented, for when the first SMS-upsell client
  with photo leads goes live.

## What NOT to do

- Don't introduce a database. This is a static site by design — Cloudflare
  Pages Functions exist only to handle the form submission, not to store
  data.
- Don't add a client-facing CMS (Decap, Sveltia, or otherwise) unless
  explicitly told the client purchased that as a separate add-on. The
  default model routes all edits through the agency.
- Don't promise or imply search ranking outcomes anywhere in site copy —
  the agency's SEO service offering is explicit that rankings/timelines are
  never guaranteed.
- Don't use stock photography in placeholders meant for client review —
  the labeled placeholder boxes that components fall back to (e.g.
  "[ Hero image goes here ]") are deliberate; obvious filler is safer than
  something that could be mistaken for a finished, generic-looking site.
- Don't hard-code a hex value or a Tailwind named color anywhere a brand
  color should appear — always reference the generated `--brand-*` CSS
  variables (see "Brand color & palette system" above) so the palette
  stays a one-config-value change.
- Don't commit synthetic or placeholder test images to `public/images/`
  — leave the directory empty (or omit the relevant `site.ts` field) until
  a real client photo exists; the components' built-in fallback handles
  the empty case.
- Don't read an image path straight from `site.ts` in a new component —
  always pass it through `resolveImage()` (`src/utils/resolveImage.ts`)
  first, so a path that's set but not yet uploaded falls back to the
  placeholder instead of a broken image icon.
- Don't add any AI image generation back into this template without a
  deliberate decision to do so — manual upload is the current, intentional
  convention, not a placeholder for a future automated pipeline.
