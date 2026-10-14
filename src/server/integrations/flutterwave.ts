import "server-only";
import type { IntegrationResult } from "./types";

/**
 * Flutterwave boundary — voluntary support payments.
 *
 * Env (server only — never prefix with NEXT_PUBLIC_):
 *   FLUTTERWAVE_SECRET_KEY     used to create hosted checkout links + verify transactions
 *   FLUTTERWAVE_WEBHOOK_HASH   "secret hash" configured in the Flutterwave dashboard
 *   SITE_URL                   absolute origin used for the post-payment redirect
 *
 * Intended flow:
 *   1. `createCheckout` → POST /v3/payments, returns hosted link → client redirects.
 *   2. Flutterwave redirects to /support/complete?tx_ref=…&transaction_id=…
 *   3. Server calls `verifyTransaction` (GET /v3/transactions/:id/verify) and only
 *      then shows a receipt. A webhook route (verifying `verif-hash`) records the
 *      final state independently of the browser.
 * Nothing here is faked: until implemented, every call reports not_configured.
 */

export interface CheckoutRequest {
  amount: number;
  currency: "NGN";
  email: string;
  name: string;
  txRef: string;
}

export function isFlutterwaveConfigured() {
  return Boolean(process.env.FLUTTERWAVE_SECRET_KEY && process.env.SITE_URL);
}

export async function createCheckout(req: CheckoutRequest): Promise<IntegrationResult<{ link: string }>> {
  if (!isFlutterwaveConfigured()) return { ok: false, reason: "not_configured" };
  void req;
  // TODO(integration): create a hosted payment link with Authorization: Bearer FLUTTERWAVE_SECRET_KEY.
  return { ok: false, reason: "not_implemented" };
}

export async function verifyTransaction(
  transactionId: string,
): Promise<IntegrationResult<{ status: "successful" | "failed" | "pending"; amount: number; txRef: string }>> {
  if (!isFlutterwaveConfigured()) return { ok: false, reason: "not_configured" };
  void transactionId;
  // TODO(integration): verify amount, currency and tx_ref match what we issued before trusting it.
  return { ok: false, reason: "not_implemented" };
}
