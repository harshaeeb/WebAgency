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
    ├── src/
    │   ├── config/site.ts                          ← per-client config (the only file that changes per client)
    │   ├── utils/palette.ts                         ← derives the full brand color scale from one hex value
    │   ├── utils/resolveImage.ts                    ← confirms an image path in site.ts exists before rendering it
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
an image slot — manually uploaded files under `public/images/`, no AI
generation involved. Every component resolves its image path through
`src/utils/resolveImage.ts`, which checks the filesystem at build time, so
a path that's set in `site.ts` before the photo is actually uploaded falls
back to a labeled placeholder box instead of a broken image icon.

Verified before this commit, from a true clean `npm ci` checkout: `npm run
build` (all 7 pages, including 3 dynamic service pages, build cleanly) and
`npx astro check` (0 errors, 0 warnings). Both upsell toggles
(`reviewsWidget`, `booking`) were tested by temporarily enabling them and
confirming the conditional components render correctly, then reverted to
their default `false` state. The image fallback behavior was also tested
directly: a missing file correctly shows the placeholder, and a real
uploaded file correctly renders — this caught and fixed a real bug where
the path-resolution logic broke silently under Astro's build bundling.

Known follow-up: MMS photo attachments via Twilio require the photo to be
hosted at a public URL (e.g., Cloudflare R2) rather than sent as raw
base64, flagged inline in `inquiry.ts`, needed when the first SMS-upsell
client with photo leads goes live.

## Architecture summary

- **Framework**: Astro (static output) + Tailwind CSS — portable,
  low-maintenance, fast Claude Code builds.
- **Hosting**: Cloudflare Pages free tier, including serverless Functions.
- **Build model**: one master template repo, cloned and customized per
  client via `site.ts`.
- **Visual design**: one brand hex value drives the entire palette via
  build-time OKLCH derivation — see `src/utils/palette.ts`. Images are
  manually uploaded files under `public/images/` (no AI generation), with
  every reference resolved through `src/utils/resolveImage.ts` so a
  missing file falls back to a placeholder rather than breaking — keeping
  runtime cost at $0.
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
```

