// src/config/site.ts
//
// The single source of truth for everything client-specific.
// Every component and page reads from this file — never hard-code a
// client's name, phone, services, or colors directly into a component.
// To build a new client site: copy this file, fill in their details,
// and toggle the features they purchased. Nothing else should need to change.

export interface Service {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  image?: string;
}

export interface SiteImages {
  hero?: string;
  about?: string;
}

export interface Testimonial {
  name: string;
  role?: string;   // e.g. "Homeowner, Frisco TX"
  text: string;
  rating?: number; // defaults to 5
}

export interface SiteTheme {
  headerStyle?: "white" | "brand";
  heroLayout?: "split" | "centered";
  heroPattern?: boolean;
  footerStyle?: "dark" | "brand";
  showTrustBar?: boolean;
  roundness?: "sm" | "md" | "lg" | "full";
}

export interface SiteConfig {
  business: string;
  tagline: string;
  heroEyebrow?: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  emailDomain: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  serviceAreas: string[];
  services: Service[];
  testimonials?: Testimonial[];
  images: SiteImages;
  brandColor: string;
  yearsInBusiness: number;
  googleReviewLink: string;
  googleRating: number;
  googleReviewCount: number;
  footerTagline?: string;
  theme?: SiteTheme;
  features: {
    reviewsWidget: boolean;
    booking: boolean;
    smsForwarding: boolean;
  };
  calLink: string;
  ownerCell: string;
}

export const site: SiteConfig = {
  business: "Smith Plumbing Co.",
  tagline: "Fast, honest plumbing for Frisco and the North Dallas area",
  heroEyebrow: "Serving Frisco & North Dallas Since 2012",
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

  testimonials: [
    {
      name: "Jennifer M.",
      role: "Homeowner, Frisco TX",
      text: "Smith Plumbing showed up within 2 hours on a Saturday. Fixed a burst pipe quickly and the price was exactly what they quoted. No surprises — highly recommend.",
      rating: 5,
    },
    {
      name: "Carlos R.",
      role: "Property Manager, Plano TX",
      text: "We use Smith Plumbing for all our rental properties. Reliable, fair pricing, and they always keep us in the loop. Best plumber in North Dallas.",
      rating: 5,
    },
    {
      name: "Sarah T.",
      role: "Homeowner, McKinney TX",
      text: "Finally found a plumber I trust. No upselling, no hidden fees. Just honest work done right the first time. Won't call anyone else.",
      rating: 5,
    },
  ],

  images: {
    hero: "/images/hero.jpg",
  },

  brandColor: "#1a6fd4",
  yearsInBusiness: 12,
  googleReviewLink: "https://g.page/r/REPLACE_ME/review",
  googleRating: 4.9,
  googleReviewCount: 87,

  theme: {
    headerStyle: "white",
    heroLayout: "split",
    heroPattern: true,
    footerStyle: "dark",
    showTrustBar: true,
    roundness: "md",
  },

  features: {
    reviewsWidget: false,
    booking: false,
    smsForwarding: false,
  },

  calLink: "",
  ownerCell: "",
};
