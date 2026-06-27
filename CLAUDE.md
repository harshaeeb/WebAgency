# CLAUDE.md

## What this repo is

A website agency's master template plus its business documents. The
agency builds and hosts websites for blue-collar trade businesses (HVAC,
plumbing, electrical, roofing, etc.) in the North Dallas metroplex.
Revenue model: a one-time build fee plus a recurring monthly care plan.
The technical architecture is deliberately optimized to keep recurring
cost near $0 for every client except the SMS upsell, which has real
per-message cost and is always priced separately.

```
WebAgency/
├── CLAUDE.md                    ← this file
├── docs/                        ← business documents (reference material, not code)
│   ├── Website_Development_Hosting_Strategy.docx
│   ├── Website_Services_Agreement_Template.docx
│   ├── Cold_Outreach_Templates.docx
│   └── Local_Website_Business_Financial_Model.xlsx
└── website-template/             ← the actual Astro project
```

**One client = one repo.** A new client site starts as a copy of
`website-template/`, not a branch or folder inside this repo.

## Golden rule

**All client-specific content lives in `website-template/src/config/site.ts`
— nothing else.** Never hard-code a business name, phone number, service,
color, or address directly into a component or page.

## Git workflow

- **Branch:** Always commit directly to `main`
- **GitHub ops:** Use `mcp__github__push_files` (no local git remote configured in the dev environment)
- Run `npm run build` and `npx astro check` inside `website-template/` before every push

## Current state — verified, not assumed

`website-template/` is a complete, tested, building project:

- All pages and components implemented: Home, About, Services (with per-service static pages), Contact
- `npm run build` (7 pages) and `npx astro check` (0 errors) both pass
- Upsell toggles (`features.reviewsWidget`, `features.booking`) tested
- Image fallback behavior tested (missing file → placeholder, real file → renders)

## Repository structure (website-template/)

```
website-template/
├── astro.config.mjs
├── src/
│   ├── config/
│   │   └── site.ts             ← THE ONLY FILE THAT CHANGES PER CLIENT
│   ├── utils/
│   │   ├── palette.ts          ← OKLCH color scale from site.brandColor
│   │   └── resolveImage.ts     ← filesystem-checks image paths at build time
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── TrustBar.astro
│   │   ├── ServicesGrid.astro
│   │   ├── ReviewsWidget.astro
│   │   ├── ContactForm.astro
│   │   ├── BookingEmbed.astro
│   │   ├── ClickToCall.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Base.astro          ← LocalBusiness schema + brand CSS vars
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services.astro
│   │   ├── services/[slug].astro
│   │   └── contact.astro
│   └── styles/
│       └── global.css
├── functions/
│   └── api/
│       └── inquiry.ts          ← Cloudflare Function: email + optional SMS
└── public/
    └── images/               ← manually uploaded client photos
```

## Current design system (redesigned June 2026)

### Component overview

| Component | Design |
|-----------|--------|
| **Header** | `bg-white/95 backdrop-blur-md` glassmorphism, mobile hamburger nav, logo initial badge, animated underline on nav links |
| **Hero** | Split layout, `font-black` headline at `text-5xl lg:text-[3.4rem]`, pulsing phone CTA (`cta-ping`), avatar stack social proof, two floating badges (Licensed & 24/7 Emergency) |
| **TrustBar** | `bg-slate-900` dark strip, 4 stats (years, rating, licensed, cities) with colored icon badges in dark pill containers |
| **ServicesGrid** | Brand gradient card headers with centered service icon (when no photo), `card-lift` hover, numbered corner badge, arrow CTA in card footer |
| **ReviewsWidget** | `bg-slate-900` section with radial brand glow, large rating display, testimonial cards from `site.testimonials` |
| **ContactForm** | `bg-slate-50` inputs → white on focus, dashed file upload zone, send icon on submit button |
| **ClickToCall** | `cta-ping` pulse ring animation, bold shadow |
| **Footer** | Gradient accent top line, icon badge contact links (hover → brand bg), pill Google rating chip, service area pills |

### CSS utilities (global.css)

- `card-lift` — `translateY(-5px)` + layered brand shadow on hover (transition 220ms spring)
- `cta-ping` — pulsing ring animation (`@keyframes cta-ping`) for phone CTAs; apply to a sibling `<span>` inside a `relative` wrapper
- `hero-pattern` — dot-grid background (`radial-gradient` 28px repeat)
- `round-sm/md/lg/full` — sets `--radius` CSS var used by all `rounded-[var(--radius)]` classes
- `[data-reveal]` — scroll-reveal fade-up (spring easing `cubic-bezier(0.16,1,0.3,1)`)
- `[data-reveal-stagger]` — staggered fade-up for children, up to 8 items (delays: 0.05s → 0.61s)

### site.ts interfaces

```ts
SiteConfig      // top-level config object
Service         // name, slug, shortDescription, description, image?
SiteImages      // hero?, about?
Testimonial     // name, role?, text, rating?   ← added June 2026
SiteTheme       // headerStyle, heroLayout, heroPattern, footerStyle, showTrustBar, roundness
```

`site.testimonials` (optional `Testimonial[]`) feeds the ReviewsWidget cards.

## Brand color & palette system

`src/utils/palette.ts` derives an 11-step OKLCH tonal scale (50–950) from the
single `site.brandColor` hex. `Base.astro` injects `--brand-50` through
`--brand-950` plus semantic aliases (`--brand`, `--brand-dark`, etc.) as CSS
custom properties on every page.

Always reference via Tailwind arbitrary syntax: `bg-[var(--brand-50)]`,
`text-[var(--brand-700)]`. Never hard-code hex values.

## Image uploads

No AI image generation. Every image is manually uploaded to `public/images/`.
Always pass image paths through `resolveImage()` — never read `site.images.*`
directly in a component, or a missing file silently breaks.

## Known issues fixed

- **`businessStory` property** — removed from `site.ts` (was not in `SiteConfig`
  interface, missing trailing comma; caused TS build failure and Cloudflare
  deployment to break). Fix: delete the line entirely.

## Per-client build steps

1. Replace every value in `site.ts` (business, phone, email, address, services, brandColor, etc.)
2. Set `features` flags based on what the client purchased
3. Drop client photos into `public/images/` and set matching paths in `site.ts`
4. Replace placeholder copy in `about.astro` (`[Replace with...]` block)
5. Set `RESEND_API_KEY` (and `TWILIO_*` if SMS active) in Cloudflare Pages env vars — never commit
6. Run `npm run build` + `npx astro check` — both must be clean
7. Push to client repo → Cloudflare auto-deploys
8. Connect custom domain in Cloudflare Pages
9. Submit sitemap to Google Search Console

## What NOT to do

- Don't introduce a database
- Don't add a CMS unless explicitly sold as an add-on
- Don't hard-code hex values — always use `--brand-*` CSS vars
- Don't read `site.images.*` directly — always use `resolveImage()`
- Don't commit synthetic/placeholder images to `public/images/`
- Don't wire the contact form to any third-party backend (Formspree, Web3Forms, etc.)
- Don't push to any branch other than `main`
