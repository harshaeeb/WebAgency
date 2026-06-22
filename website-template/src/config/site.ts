// src/config/site.ts
//
// The single source of truth for everything client-specific.
// Every component and page reads from this file — never hard-code a
// client's name, phone, services, or colors directly into a component.
// To build a new client site: copy this file, fill in their details,
// and toggle the features they purchased. Nothing else should need to change.

export interface SiteConfig {
  business: string;
  phone: string;
  email: string;
  emailDomain?: string; // domain used in the "from" address for Resend, e.g. "smithplumbing.com"
  address: string;       // keep this EXACT format identical everywhere (NAP consistency, SEO)
  serviceAreas: string[];
  services: string[];
  brandColor: string;
  googleReviewLink: string;

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
  phone: "+1-972-555-0148",
  email: "smith@smithplumbing.com",
  emailDomain: "smithplumbing.com",
  address: "123 Main St, Frisco, TX 75034",
  serviceAreas: ["Frisco", "Plano", "McKinney"],
  services: ["Emergency Plumbing", "Water Heaters", "Drain Cleaning"],
  brandColor: "#1F6FEB",
  googleReviewLink: "https://g.page/r/REPLACE_ME/review",

  features: {
    reviewsWidget: false,
    booking: false,
    smsForwarding: false,
  },

  calLink: "",
  ownerCell: "",
};
