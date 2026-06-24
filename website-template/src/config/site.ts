// src/config/site.ts
//
// The single source of truth for everything client-specific.
// Every component and page reads from this file — never hard-code a
// client's name, phone, services, or colors directly into a component.
// To build a new client site: copy this file, fill in their details,
// and toggle the features they purchased. Nothing else should need to change.
//
// This file currently contains a realistic DEMO business (a plumbing
// company) so the template is fully demo-ready out of the box — replace
// every value below with the real client's details when starting a build.

export interface Service {
  name: string;
  slug: string;          // used in the URL: /services/[slug]
  shortDescription: string; // one sentence, shown on the services grid
  description: string;      // longer paragraph, shown on the service's own page
}

export interface SiteConfig {
  business: string;
  tagline: string;
  url: string;         // production domain, e.g. "https://smithplumbing.com" — must match astro.config.mjs `site:`
  phone: string;
  phoneDisplay: string;  // human-friendly formatting, e.g. "(972) 555-0148"
  email: string;
  emailDomain: string;   // domain used in the "from" address for Resend, e.g. "smithplumbing.com"
  address: string;       // keep this EXACT format identical everywhere (NAP consistency, SEO)
  city: string;
  state: string;
  zip: string;
  serviceAreas: string[];
  services: Service[];
  brandColor: string;
  yearsInBusiness: number;
  googleReviewLink: string;
  googleRating: number;
  googleReviewCount: number;

  features: {
    reviewsWidget: boolean;  // upsell: live embedded Google reviews widget
    booking: boolean;        // upsell: Cal.com appointment booking
    smsForwarding: boolean;  // upsell: forward inquiries to owner's cell via Twilio
  };

  calLink: string;    // Cal.com booking link — fill in only when features.booking is true
  ownerCell: string;  // owner's cell in E.164 format (e.g. "+19725550148") — fill in only when features.smsForwarding is true
}

export const site: SiteConfig = {
  business: "Smith Plumbing Co.",
  tagline: "Fast, honest plumbing for Frisco and the North Dallas area",
  url: "https://smithplumbing.com",
  phone: "+19453960311",
  phoneDisplay: "(945) ",
  email: "harsha.eeb@gmail.com",
  emailDomain: "smithplumbing.com",
  address: "123 Main St, Frisco, TX 75034",
  city: "Frisco",
  state: "TX",
  zip: "75034",
  serviceAreas: ["Frisco", "Plano", "McKinney", "Allen", "The Colony", "Prosper"],

  services: [
    {
      name: "Emergency Plumbing",
      slug: "emergency-plumbing",
      shortDescription: "Burst pipe or major leak? We answer the phone and show up fast, day or night.",
      description:
        "Plumbing emergencies don't wait for business hours, and neither do we. Whether it's a burst pipe, a sudden leak, or a backed-up line, our team responds quickly to stop the damage and get your home or business back to normal. We carry the parts and tools to fix most emergencies on the first visit.",
    },
    {
      name: "Water Heaters",
      slug: "water-heaters",
      shortDescription: "Repair, replacement, and installation for tank and tankless water heaters.",
      description:
        "From a pilot light that won't stay lit to a full replacement, we work on both traditional tank and modern tankless water heaters. We'll give you a straight answer on whether a repair makes sense or if it's time to replace, and we carry units in stock for same-week installs.",
    },
    {
      name: "Drain Cleaning",
      slug: "drain-cleaning",
      shortDescription: "Slow or clogged drains cleared the right way — no harsh chemicals needed.",
      description:
        "Slow drains are usually a warning sign, not just an inconvenience. We use professional-grade equipment to clear clogs at the source rather than masking the problem, and we'll let you know if there's a larger issue worth keeping an eye on.",
    },
  ],

  brandColor: "#1F6FEB",
  yearsInBusiness: 12,
  googleReviewLink: "https://g.page/r/REPLACE_ME/review",
  googleRating: 4.9,
  googleReviewCount: 87,

  features: {
    reviewsWidget: false,
    booking: false,
    smsForwarding: false,
  },

  calLink: "",
  ownerCell: "",
};

// Called from Base.astro at build time. Throws immediately if required fields
// are missing or still set to template placeholder values, so a misconfigured
// client build fails loudly during development rather than silently in prod.
export function validateConfig(config: SiteConfig): void {
  const PLACEHOLDER_URL = "https://example.com";
  const required: Array<keyof SiteConfig> = [
    "business", "tagline", "url", "phone", "phoneDisplay",
    "email", "emailDomain", "address", "city", "state", "zip",
  ];
  for (const key of required) {
    const value = config[key];
    if (!value || (typeof value === "string" && value.trim() === "")) {
      throw new Error(`[site.ts] Missing required field: "${key}". Fill it in before building.`);
    }
  }
  if (config.url === PLACEHOLDER_URL) {
    throw new Error(
      `[site.ts] "url" is still set to "${PLACEHOLDER_URL}". ` +
      "Update it to the client's real domain and match astro.config.mjs."
    );
  }
  if (config.services.length === 0) {
    throw new Error(`[site.ts] "services" array is empty. Add at least one service.`);
  }
  if (config.features.booking && !config.calLink) {
    throw new Error(`[site.ts] features.booking is true but "calLink" is empty.`);
  }
  if (config.features.smsForwarding && !config.ownerCell) {
    throw new Error(`[site.ts] features.smsForwarding is true but "ownerCell" is empty.`);
  }
}
