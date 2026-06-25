// src/types/env.d.ts
// Shared Cloudflare Pages environment variable types.

export interface Env {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
}
