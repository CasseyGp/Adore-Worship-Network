import "server-only";
import type { IntegrationResult } from "./types";

/**
 * Transactional email — sent through Resend's HTTP API (https://resend.com), no SDK needed.
 *
 * Env (server only — never prefix with NEXT_PUBLIC_):
 *   EMAIL_API_KEY            Resend API key (re_…)
 *   EMAIL_FROM               sender on a domain verified in Resend, e.g. "Adore Worship Movement <forms@your-domain>"
 *   EMAIL_ADMIN_RECIPIENTS   optional comma-separated override; defaults to DEFAULT_RECIPIENT
 *   EMAIL_API_URL            optional; points at a local mock when testing (defaults to Resend)
 *
 * The visitor's address is only ever used as Reply-To — never as the sender.
 */

const DEFAULT_RECIPIENT = "adoreglobalnetwork@gmail.com";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface EmailMessage {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export function isEmailConfigured() {
  return Boolean(process.env.EMAIL_API_KEY && process.env.EMAIL_FROM);
}

/** Organiser inbox(es). Configured on the server only — never taken from form input. */
export function adminRecipients(): string[] {
  const list = (process.env.EMAIL_ADMIN_RECIPIENTS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : [DEFAULT_RECIPIENT];
}

export async function sendEmail(message: EmailMessage): Promise<IntegrationResult> {
  if (!isEmailConfigured()) return { ok: false, reason: "not_configured" };

  try {
    const res = await fetch(process.env.EMAIL_API_URL || RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: message.to,
        subject: message.subject.replace(/[\r\n]+/g, " "),
        text: message.text,
        html: message.html,
        reply_to: message.replyTo,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!res.ok) {
      // Log status only — never the payload, which contains visitor details.
      console.error(`[email] provider rejected send: HTTP ${res.status}`);
      return { ok: false, reason: "failed", detail: `HTTP ${res.status}` };
    }
    return { ok: true, data: undefined };
  } catch (err) {
    console.error(`[email] provider request failed: ${err instanceof Error ? err.name : "unknown"}`);
    return { ok: false, reason: "failed" };
  }
}
