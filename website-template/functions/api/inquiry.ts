// functions/api/inquiry.ts
//
// Single endpoint for every client site's contact form.
// - Validates the submission and handles an optional photo attachment
// - Always sends an email notification to the business owner via Resend
// - If features.smsForwarding is true in site.ts, also forwards the lead
//   (including the photo, as an MMS) to the owner's cell via Twilio
//
// This replaces third-party form backends (Formspree/Web3Forms) entirely.
// One implementation path is used by every client, whether or not the
// SMS upsell is active — see Section 3.3 of the Website Development &
// Hosting Strategy document for the reasoning.

import { site } from "../../src/config/site";

interface Env {
  RESEND_API_KEY: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const formData = await request.formData();

    const name = (formData.get("name") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();
    const photo = formData.get("photo"); // File | null

    // --- Basic validation ---
    if (!name || !message || (!phone && !email)) {
      return jsonResponse(
        { ok: false, error: "Please provide your name, a message, and a phone or email." },
        400
      );
    }

    // Optional: read the photo into a base64 string for email/MMS use.
    let photoBase64: string | null = null;
    let photoContentType: string | null = null;
    let photoFilename: string | null = null;
    if (photo instanceof File && photo.size > 0) {
      // Cap attachment size — keep MMS cost predictable and avoid huge emails.
      const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
      if (photo.size > MAX_BYTES) {
        return jsonResponse({ ok: false, error: "Photo is too large (max 5MB)." }, 400);
      }
      const buf = await photo.arrayBuffer();
      photoBase64 = arrayBufferToBase64(buf);
      photoContentType = photo.type || "application/octet-stream";
      photoFilename = photo.name || "attachment";
    }

    // --- 1. Always send the email notification via Resend ---
    await sendEmailViaResend(env, {
      name, phone, email, message,
      photoBase64, photoContentType, photoFilename,
    });

    // --- 2. If the SMS upsell is active for this client, also text the owner ---
    if (site.features?.smsForwarding && site.ownerCell) {
      await sendSmsViaTwilio(env, {
        name, phone, message,
        // MMS media must be a publicly reachable URL in production —
        // see the note in sendSmsViaTwilio() below for the recommended approach.
        mediaUrl: null,
      });
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error("inquiry.ts error:", err);
    return jsonResponse({ ok: false, error: "Something went wrong. Please call us directly." }, 500);
  }
};

// ---------------------------------------------------------------------------
// Email via Resend
// ---------------------------------------------------------------------------
async function sendEmailViaResend(
  env: Env,
  data: {
    name: string; phone: string; email: string; message: string;
    photoBase64: string | null; photoContentType: string | null; photoFilename: string | null;
  }
) {
  const attachments = data.photoBase64
    ? [{ filename: data.photoFilename ?? "photo.jpg", content: data.photoBase64 }]
    : undefined;

  const body: Record<string, unknown> = {
    from: `${site.business} Website <inquiries@${site.emailDomain ?? "yourdomain.com"}>`,
    to: [site.email],
    subject: `New inquiry from ${data.name} \u2014 ${site.business}`,
    text: [
      `Name: ${data.name}`,
      `Phone: ${data.phone || "(not provided)"}`,
      `Email: ${data.email || "(not provided)"}`,
      "",
      "Message:",
      data.message,
    ].join("\n"),
  };
  if (attachments) body.attachments = attachments;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend API error (${res.status}): ${errText}`);
  }
}

// ---------------------------------------------------------------------------
// SMS / MMS via Twilio (only runs when features.smsForwarding is true)
// ---------------------------------------------------------------------------
async function sendSmsViaTwilio(
  env: Env,
  data: { name: string; phone: string; message: string; mediaUrl: string | null }
) {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
    console.warn("Twilio env vars missing; skipping SMS forward.");
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`;
  const params = new URLSearchParams({
    To: site.ownerCell,
    From: env.TWILIO_FROM_NUMBER,
    Body: `New lead from ${data.name} (${data.phone || "no phone given"}): ${data.message}`.slice(0, 1500),
  });
  // NOTE on MMS photo attachments: Twilio's MediaUrl must be a public URL it can
  // fetch — a base64 blob from the form can't be attached directly. The common
  // pattern is to upload the photo to Cloudflare R2 (or similar object storage)
  // first, then pass that object's public URL here as MediaUrl. Left as a
  // follow-up wiring step once a client's SMS upsell is being finalized, since
  // it adds one more piece (object storage) only when a lead photo is present.
  if (data.mediaUrl) params.set("MediaUrl", data.mediaUrl);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Twilio API error (${res.status}): ${errText}`);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
