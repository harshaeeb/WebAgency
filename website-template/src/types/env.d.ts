// src/types/env.d.ts
// Shared Cloudflare Pages environment variable types.
// Import this interface in any Cloudflare Function instead of redeclaring it.

export interface Env {
  RESEND_API_KEY: string;
  // Optional verified sending address, e.g. "inquiries@smithplumbing.com".
  // If omitted, falls back to Resend's shared onboarding@resend.dev address,
  // which works without domain verification but only delivers to the Resend
  // account's registered email. Set this once the client's domain is verified
  // in the Resend dashboard.
  RESEND_FROM_EMAIL?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
}
