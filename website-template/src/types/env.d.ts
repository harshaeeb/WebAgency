// src/types/env.d.ts
// Shared Cloudflare Pages environment variable types.
// Import this interface in any Cloudflare Function instead of redeclaring it.

export interface Env {
  RESEND_API_KEY: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
}
