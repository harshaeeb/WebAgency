// src/config/site.ts
//
// The single source of truth for everything client-specific.
// Every component and page reads from this file — never hard-code a
// client's name, phone, services, or colors directly into a component.
// To build a new client site: copy this file, fill in their details,
// and toggle the features they purchased. Nothing else should need to change.
//
// brandColor drives the entire visual palette: src/utils/palette.ts derives
// a full tonal scale (50-950) from this single hex value at build time, so
// changing one value here re-themes the whole site (see Base.astro).
//
// images.* and each service's `image` field point at static files under
// public/images/generated/ — see scripts/generate-images.ts for the
// build-time pipeline that produces them from the *Prompt fields below.
//
// This file currently contains a realistic DEMO business (a plumbing
// company) so the template is fully demo-ready out of the box — replace
// every value below with the real client's details when starting a build.

export interface Service {
  name: string;
  slug: string;          // used in the URL: /services/[slug]
  shortDescription: string; // one sentence, shown on the services grid
  description: string;      // longer paragraph, shown on the service's own page
  image?: string;            // path under /images/generated/, e.g. "/images/generated/drain-cleaning.jpg"
  imagePrompt?: string;      // the prompt used to generate `image` — kept here so it can be
                              // regenerated or tweaked later without losing the original intent
}

export interface SiteImages {
  hero: string;        // homepage hero background/photo
  heroPrompt?: string; // prompt used to generate `hero`, kept for regeneration/tweaking
  about: string;        // about-page photo
  aboutPrompt?: string;
}

export interface SiteConfig {
  business: string;
  tagline: string;
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
  images: SiteImages;
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
  phone: "+19725550148",
  phoneDisplay: "(972) 555-0148",
  email: "smith@smithplumbing.com",
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
      image: "/images/generated/emergency-plumbing.jpg",
      imagePrompt:
        "A clean, professional photo of a uniformed plumber working under a kitchen sink with a flashlight, warm natural lighting, modern American home interior, no visible text or logos, photorealistic",
    },
    {
      name: "Water Heaters",
      slug: "water-heaters",
      shortDescription: "Repair, replacement, and installation for tank and tankless water heaters.",
      description:
        "From a pilot light that won't stay lit to a full replacement, we work on both traditional tank and modern tankless water heaters. We'll give you a straight answer on whether a repair makes sense or if it's time to replace, and we carry units in stock for same-week installs.",
      image: "/images/generated/water-heaters.jpg",
      imagePrompt:
        "A clean, professional photo of a modern tankless water heater freshly installed on a garage wall, neat copper piping, bright even lighting, no visible text or logos, photorealistic",
    },
    {
      name: "Drain Cleaning",
      slug: "drain-cleaning",
      shortDescription: "Slow or clogged drains cleared the right way — no harsh chemicals needed.",
      description:
        "Slow drains are usually a warning sign, not just an inconvenience. We use professional-grade equipment to clear clogs at the source rather than masking the problem, and we'll let you know if there's a larger issue worth keeping an eye on.",
      image: "/images/generated/drain-cleaning.jpg",
      imagePrompt:
        "A clean, professional photo of a plumber's drain snake/auger equipment neatly arranged beside a bathroom sink, tidy modern bathroom, bright lighting, no visible text or logos, photorealistic",
    },
  ],

  images: {
    hero: "/images/generated/hero.jpg",
    heroPrompt:
      "A bright, clean, professional photo of a friendly uniformed plumber and a modern service van in front of a suburban Texas home, daytime, warm and trustworthy mood, no visible text or logos, photorealistic, wide shot suitable for a website hero section",
    about: "/images/generated/about.jpg",
    aboutPrompt:
      "A bright, professional photo of a small local plumbing business team standing together in front of their shop or van, friendly and approachable, daytime, no visible text or logos, photorealistic",
  },

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
