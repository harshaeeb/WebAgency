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
│   ├── components/
│   │   ├── Header.astro        (persistent click-to-call CTA)
│   │   ├── Hero.astro
│   │   ├── ServicesGrid.astro  (accepts a `compact` prop for homepage use)
│   │   ├── ReviewsWidget.astro       (renders link OR embed based on site.features.reviewsWidget)
│   │   ├── ContactForm.astro         (posts to /api/inquiry, progressive enhancement via fetch)
│   │   ├── BookingEmbed.astro        (renders nothing unless site.features.booking)
│   │   ├── ClickToCall.astro         (reusable mid-page CTA, separate from Header's)
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Base.astro          (LocalBusiness schema markup lives here, populated from site.ts)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services.astro              ← full services listing
│   │   ├── services/[slug].astro       ← one dedicated page per service, via getStaticPaths
│   │   └── contact.astro
│   └── styles/
│       └── global.css          (Tailwind import + the --brand CSS variable)
├── functions/
│   └── api/
│       └── inquiry.ts          ← form handling + email (every client) + SMS (if upsell active)
└── public/
    └── images/                 ← client-provided photos go here
```

## Per-client build steps

When given a new client's details, do the following in order:

1. Open `src/config/site.ts` and replace every value: `business`, `tagline`,
   `url` (the client's real production domain, e.g. `https://smithplumbing.com`),
   `phone`, `phoneDisplay`, `email`, `emailDomain`, `address`, `city`,
   `state`, `zip`, `serviceAreas`, `services` (name/slug/descriptions),
   `brandColor`, `yearsInBusiness`, `googleReviewLink`, `googleRating`,
   `googleReviewCount`.
   **`url` is now the single source of truth for the domain** — `astro.config.mjs`
   reads from it automatically, so you no longer need to update both files separately.
   `validateConfig()` will throw at build time if `url` is still the placeholder.
2. Set each flag in `features` based on what the client purchased:
   - `reviewsWidget: true` → also confirm the reviews widget embed snippet/ID is available, and wire it into the placeholder block in `ReviewsWidget.astro`.
   - `booking: true` → fill in `calLink` once the client's Cal.com account is set up.
   - `smsForwarding: true` → fill in `ownerCell` in E.164 format (e.g. `+19725550148`), and set the `TWILIO_*` environment variables in Cloudflare Pages.
3. `astro.config.mjs` now reads `site:` directly from `site.ts` — no separate update needed. Canonical URLs, sitemap, and og:image tags are all driven from `site.url`.
4. Each entry in `services` automatically gets its own page at `/services/[slug]` via `getStaticPaths` in `src/pages/services/[slug].astro` — you do not need to create pages manually. If the client serves multiple distinct towns with meaningfully different content, activate `src/pages/service-areas/[area].astro` (see instructions inside that file) rather than building from scratch.
5. Replace the placeholder copy in `about.astro` (marked with a `[Replace with...]` bracket) with the client's real story.
6. Place client-provided images in `public/images/` and reference them from `Hero.astro` and elsewhere — do not use stock photos unless explicitly provided. `Hero.astro` currently has a plain placeholder box for this reason.
7. Set environment variables in Cloudflare Pages project settings — never commit these to the repo:
   - `RESEND_API_KEY` (required): your Resend API key.
   - `RESEND_FROM_EMAIL` (optional): the verified sending address, e.g. `inquiries@smithplumbing.com`. Omit until the client's domain is verified in Resend — the function falls back to `onboarding@resend.dev`, which delivers to your Resend account's registered email and works without domain verification.
   - `TWILIO_*` vars only if `smsForwarding` is active.
8. Run the SEO checklist (below) on every page before considering the build done.
9. Preview locally with `npm run dev`, and run `npx astro check` to confirm no type errors before pushing.
10. Push to the client's git repository — Cloudflare Pages builds and deploys automatically on push.
11. Connect the custom domain in Cloudflare Pages.
12. If the booking upsell was purchased: set up the client's Cal.com account, connect their Google Calendar, configure event types per service, and drop the `calLink` into the config.
13. If the SMS upsell was purchased: register the Twilio number for 10DLC, set `ownerCell` in the config, and verify a test inquiry forwards correctly — including confirming the Cloudflare R2 (or similar) wiring for MMS photo attachments, noted as a follow-up step in `inquiry.ts`.
14. Set up or claim the client's Google Business Profile and submit the sitemap to Google Search Console.
15. **Cloudflare WAF rate limit**: In the Cloudflare dashboard for the client's zone, add a rate-limiting rule on `/api/inquiry` — recommended: 5 requests per minute per IP, action: block. This protects Resend and Twilio quotas from spam bursts without touching code.

## Local development

When starting the dev server during a build session, run it in the
background rather than blocking the session:

```
npm run dev &
```

Then use `npx astro check` and `npm run build` (which also runs in the
foreground and exits) to verify correctness without needing a long-running
process.

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
  the intentionally plain "[ Client photo goes here ]" placeholder in
  `Hero.astro` is deliberate; it's obvious filler rather than something
  that could be mistaken for a finished, generic-looking site.
