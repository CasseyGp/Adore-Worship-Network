import "server-only";
import type { TransferDetails } from "@/content/support";

/**
 * Bank-transfer details for voluntary giving.
 *
 * Env (server, read at build/render):
 *   GIVING_BANK_NAME, GIVING_ACCOUNT_NAME, GIVING_ACCOUNT_NUMBER
 *   GIVING_DETAILS_VERIFIED=true   — set only after the organisers have confirmed the account.
 *
 * Until all four are present the giving panel shows that details are awaiting confirmation
 * and offers no account number to copy. Nothing here is a placeholder that could be mistaken
 * for a real account.
 */
export function getTransferDetails(): TransferDetails | null {
  const bankName = process.env.GIVING_BANK_NAME?.trim();
  const accountName = process.env.GIVING_ACCOUNT_NAME?.trim();
  const accountNumber = process.env.GIVING_ACCOUNT_NUMBER?.replace(/\s/g, "");
  const verified = process.env.GIVING_DETAILS_VERIFIED === "true";
  if (!verified || !bankName || !accountName || !accountNumber || !/^\d{10}$/.test(accountNumber)) return null;
  return { bankName, accountName, accountNumber };
}
