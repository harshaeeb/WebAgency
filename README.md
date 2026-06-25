# WebAgency

Business and technical foundation for a local website-and-care-plan agency
serving blue-collar trade businesses (HVAC, plumbing, electrical, roofing,
and similar) across Frisco, Plano, McKinney, Allen, The Colony, and Prosper, TX.

## Repo contents

```
WebAgency/
├── docs/                                          ← business documents (Word/Excel)
│   ├── Website_Development_Hosting_Strategy.docx  ← full technical architecture & cost strategy
│   ├── Website_Services_Agreement_Template.docx   ← client contract template
│   ├── Cold_Outreach_Templates.docx                ← call/email/text/social outreach scripts
│   └── Local_Website_Business_Financial_Model.xlsx ← pricing, projections, lead tracker, search queries
└── website-template/                              ← the master Astro template, cloned per client
    ├── CLAUDE.md                                   ← build conventions for Claude Code
    ├── .env.example                                 ← required environment variables (Resend/Twilio)
    ├── scripts/generate-images.ts                  ← build-time AI image generation (provider not yet wired in)
    ├── src/
    │   ├── config/site.ts                          ← per-client config (the only file that changes per client)
    │   ├── utils/palette.ts                         ← derives the full brand color scale from one hex value
    │   ├── components/                              ← Header, Hero, ServicesGrid, ReviewsWidget,
    │   │                                               ContactForm, BookingEmbed, ClickToCall, Footer
    │   ├── layouts/Base.astro                       ← LocalBusiness schema + generated brand CSS variables
    │   └── pages/                                   ← Home, About, Services (+ per-service via
    │                                                    getStaticPaths), Contact
    └── functions/api/inquiry.ts                    ← unified form + email (Resend) + SMS (Twilio, upsell) handler
```

## Status

`website-template/` is a complete, building, type-checked Astro + Tailwind
project — not just a scaffold. It currently contains a realistic demo
business ("Smith Plumbing Co.") filled into `site.ts` so it's fully
demo-ready out of the box: clone it, run `npm install && npm run dev`, and
a real site renders immediately. To start a new client build, follow the
per-client steps in `CLAUDE.md` — in short, every change happens in
`src/config/site.ts` and nowhere else.

The visual design is driven by a single brand color: `site.brandColor`
expands into a full tonal palette at build time (`src/utils/palette.ts`,
using OKLCH for perceptually correct shading), producing gradients, tinted
section backgrounds, and layered card depth throughout — not just one flat
accent color repeated everywhere. Hero, About, and each service also have
an image slot wired up for build-time AI image generation
(`npm run generate-images`); no provider is wired in yet, so every
component falls back to a labeled placeholder box until one is.

Verified before this commit, from a true clean `npm ci` checkout: `npm run
build` (all 7 pages, including 3 dynamic service pages, build cleanly) and
`npx astro check` (0 errors, 0 warnings). Both upsell toggles
(`reviewsWidget`, `booking`) were tested by temporarily enabling them and
confirming the conditional components render correctly, then reverted to
their default `false` state.

Known follow-ups: (1) no image generation provider is wired in yet — see
`scripts/generate-images.ts`; (2) MMS photo attachments via Twilio require
the photo to be hosted at a public URL (e.g., Cloudflare R2) rather than
sent as raw base64, flagged inline in `inquiry.ts`, needed when the first
SMS-upsell client with photo leads goes live.

## Architecture summary

- **Framework**: Astro (static output) + Tailwind CSS — portable,
  low-maintenance, fast Claude Code builds.
- **Hosting**: Cloudflare Pages free tier, including serverless Functions.
- **Build model**: one master template repo, cloned and customized per
  client via `site.ts`.
- **Visual design**: one brand hex value drives the entire palette via
  build-time OKLCH derivation — see `src/utils/palette.ts`. Images are
  generated once per client at build time (not on every deploy) via
  `scripts/generate-images.ts`, keeping runtime cost at $0.
- **Forms & email**: handled by a self-coded Cloudflare Pages Function
  calling Resend's API directly — no third-party form backend
  (Formspree/Web3Forms) is used. Every client site uses the same code path.
- **Booking** (upsell): Cal.com free tier, native Google Calendar sync,
  embedded via Cal.com's official embed snippet.
- **SMS lead forwarding** (upsell): same Cloudflare Function, calls Twilio —
  the only layer with real recurring usage cost, always priced as a
  pass-through or premium tier rather than bundled.

Full reasoning, cost tables, and the per-client build workflow are in
`docs/Website_Development_Hosting_Strategy.docx`.

## Getting started locally

```bash
cd website-template
npm install
npm run dev              # preview at http://localhost:4321
npx astro check           # type-check before committing
npm run build              # production build, outputs to dist/
npm run generate-images    # build-time image generation (once a provider is wired in)
```

