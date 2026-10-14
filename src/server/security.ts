import "server-only";
import { headers } from "next/headers";

/**
 * Lightweight abuse protection for public forms.
 *
 * - Honeypot: a visually hidden `website` field real visitors never fill.
 * - Rate limit: fixed window per IP + form, held in memory. On Vercel each serverless
 *   instance keeps its own window, so this is best-effort; add Vercel Firewall rate
 *   rules (or a shared store) if abuse appears.
 */

export const HONEYPOT_FIELD = "website";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

export type GuardResult = { ok: true } | { ok: false; message: string };

export async function guardSubmission(formData: FormData, form: string): Promise<GuardResult> {
  const trap = formData.get(HONEYPOT_FIELD);
  if (typeof trap === "string" && trap.trim() !== "") {
    return { ok: false, message: "We couldn’t process this submission. Please try again." };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const key = `${form}:${ip}`;
  const now = Date.now();

  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
  }

  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > MAX_PER_WINDOW) {
    return { ok: false, message: "Too many submissions in a short time. Please wait a few minutes and try again." };
  }
  return { ok: true };
}
