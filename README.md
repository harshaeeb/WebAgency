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
    ├── src/config/site.ts                          ← per-client config schema (the only file that changes per client)
    └── functions/api/inquiry.ts                    ← unified form + email (Resend) + SMS (Twilio, upsell) handler
```

## Architecture summary

- **Framework**: Astro (static output) — portable, low-maintenance, fast Claude Code builds.
- **Hosting**: Cloudflare Pages free tier, including serverless Functions.
- **Build model**: one master template repo, cloned and customized per client via `site.ts`.
- **Forms & email**: handled by a self-coded Cloudflare Pages Function calling
  Resend's API directly — no third-party form backend (Formspree/Web3Forms)
  is used. Every client site uses the same code path.
- **Booking** (upsell): Cal.com free tier, native Google Calendar sync.
- **SMS lead forwarding** (upsell): same Cloudflare Function, calls Twilio —
  the only layer with real recurring usage cost, always priced as a
  pass-through or premium tier rather than bundled.

Full reasoning, cost tables, and the per-client build workflow are in
`docs/Website_Development_Hosting_Strategy.docx`.

## Status

This repo currently contains the planning documents and the template
scaffold (config schema + the inquiry function). The full Astro component
set (`Header.astro`, `Hero.astro`, etc.) referenced in `CLAUDE.md` is the
next build step, intended to be done with Claude Code using this repo's
conventions.
