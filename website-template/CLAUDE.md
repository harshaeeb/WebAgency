# CLAUDE.md — Build Conventions for This Template

This repository is the master template for every client website. A new client
site starts as a copy of this repo. Read this file before making any changes.

## Golden rule

**All client-specific content lives in `src/config/site.ts` — nothing else.**
Never hard-code a business name, phone number, service, color, or address
directly into a component or page. Every component reads from `site.ts`.
If you find yourself typing a client's name into a `.astro` file, stop —
that value should come from the config import instead.

## Repository structure

```
website-template/
├── CLAUDE.md
├── src/
│   ├── config/
│   │   └── site.ts            ← the only file that changes per client
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── ServicesGrid.astro
│   │   ├── ReviewsWidget.astro      (renders link OR embed based on site.features.reviewsWidget)
│   │   ├── ContactForm.astro        (posts to /api/inquiry)
│   │   ├── BookingEmbed.astro       (renders only if site.features.booking)
│   │   ├── ClickToCall.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Base.astro               (LocalBusiness schema markup lives here, populated from site.ts)
│   └── pages/
│       ├── index.astro
│       ├── about.astro
│       ├── services.astro
│       ├── services/[service].astro      ← one dedicated page per service (see SEO checklist)
│       └── contact.astro
├── functions/
│   └── api/
│       └── inquiry.ts          ← form handling + email (every client) + SMS (if upsell active)
└── public/
    └── images/                 ← client-provided photos go here
```

## Per-client build steps

When given a new client's details, do the following in order:

1. Open `src/config/site.ts` and fill in: `business`, `phone`, `email`,
   `emailDomain`, `address`, `serviceAreas`, `services`, `brandColor`,
   `googleReviewLink`.
2. Set each flag in `features` based on what the client purchased:
   - `reviewsWidget: true` → also confirm the reviews widget embed snippet/ID is available.
   - `booking: true` → fill in `calLink` once the client's Cal.com account is set up.
   - `smsForwarding: true` → fill in `ownerCell` in E.164 format (e.g. `+19725550148`).
3. Generate a dedicated page for each entry in `services` and, if the client
   serves multiple distinct towns, a dedicated page per service area — never
   combine multiple services/areas onto one generic page. See the SEO
   checklist below for why.
4. Place client-provided images in `public/images/` and reference them from
   the relevant page/component — do not use stock photos unless explicitly
   provided.
5. Run the SEO checklist (below) on every page before considering the build done.
6. Preview locally with `astro dev`, then push to the client's git repo —
   Cloudflare Pages builds and deploys automatically on push.

## On-page SEO checklist (apply to every page, every build)

- **Title tag**: `[Service or Page] in [City] | [Business Name]`
  e.g. "Emergency Plumbing in Plano, TX | Smith Plumbing Co."
- **Meta description**: one or two plain-language sentences, no keyword stuffing.
- **One `<h1>` per page**, containing the page's main topic naturally.
- **Image alt text**: descriptive and locally relevant, e.g.
  `alt="completed roof repair in Plano, TX"`, never `alt="img1"`.
- **Clean URLs**: `/services/roof-repair`, not `/page?id=4827`. Astro's
  file-based routing handles this natively if pages are named sensibly.
- **LocalBusiness schema markup**: lives once in `Base.astro`, populated
  entirely from `site.ts` — confirm `business`, `address`, `phone`, and
  service area are all correctly reflected before launch.
- **NAP consistency**: the business name, address, and phone must appear in
  the *exact same format* everywhere on the site. `site.ts` is the single
  source of truth specifically to prevent mismatches here.
- **XML sitemap**: generated via Astro's sitemap integration; submit to
  Google Search Console once at launch.
- **Dedicated pages per service/area**: required, not optional — this is
  what lets a multi-service or multi-town client rank for multiple distinct
  searches instead of one generic one.

Full context on why these matter is in the project's SEO strategy notes —
ask if you need the reasoning, but the checklist above is what to *apply*.

## Feature implementation notes

- **Reviews**: default is a styled button linking to `site.googleReviewLink`.
  Only render the embedded widget component if `site.features.reviewsWidget`
  is true — the embed is a paid upsell, not a default.
- **Contact form**: always posts to `/api/inquiry` (the Cloudflare Function
  in `functions/api/inquiry.ts`). Do not wire the form to Formspree,
  Web3Forms, or any third-party form backend — this template intentionally
  self-handles form submission and email via Resend for every client,
  regardless of which upsells are active. See the function's inline
  comments for the full request flow.
- **Booking**: `BookingEmbed.astro` should render nothing at all if
  `site.features.booking` is false. When true, embed `site.calLink` either
  inline or as a popup trigger — Cal.com handles availability and Google
  Calendar sync entirely; no custom calendar logic belongs in this codebase.
- **SMS forwarding**: handled inside `inquiry.ts`. Do not build a separate
  endpoint for this — it must stay in the same function as the email send
  so a single form submission triggers both notifications when SMS is active.

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
