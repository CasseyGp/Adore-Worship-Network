"use server";

import { supportConfig } from "@/content/support";
import type { FormState } from "@/lib/forms/types";
import { type GivingField, parseAmount, validateGiving } from "@/lib/forms/validation";
import { getTransferDetails } from "@/server/giving";
import { adminRecipients, sendEmail } from "@/server/integrations/email";
import { renderNotification } from "@/server/email-template";
import { guardSubmission } from "@/server/security";
import { formString, unavailableMessage } from "./shared";

/**
 * Optional "I've made my transfer" notice. It tells the team to look out for a transfer —
 * it does NOT confirm payment. Gifts stay unconfirmed until the team sees the funds arrive.
 */
export async function notifyTransfer(_prev: FormState<GivingField>, formData: FormData): Promise<FormState<GivingField>> {
  const rawAmount = formString(formData, "amount", 20);
  const input = {
    amount: parseAmount(rawAmount),
    fullName: formString(formData, "fullName", 120),
    email: formString(formData, "email", 254),
  };
  const values = { amount: rawAmount, fullName: input.fullName, email: input.email };

  const guard = await guardSubmission(formData, "giving");
  if (!guard.ok) return { status: "error", values, message: guard.message };

  const errors = validateGiving(input);
  if (Object.keys(errors).length) return { status: "invalid", errors, values, message: "Please check the highlighted fields." };

  const account = getTransferDetails();
  if (!account) return { status: "unavailable", values, message: "Giving by transfer isn’t open yet, so there is nothing to report." };

  const amount = `${supportConfig.currencySymbol}${input.amount.toLocaleString("en-NG")} (${supportConfig.currency})`;
  const { text, html } = renderNotification({
    kind: "Giving — transfer notice (unverified)",
    title: `${input.fullName} reports a transfer of ${amount}`,
    rows: [
      { label: "Contributor", value: input.fullName },
      { label: "Amount stated", value: amount },
      { label: "Email", value: input.email || "Not provided" },
      { label: "Paid to", value: `${account.accountName} — ${account.bankName} ${account.accountNumber}` },
    ],
    note: "The visitor reports making a bank transfer. This is NOT a payment confirmation — please check the account before acknowledging the gift.",
  });

  const result = await sendEmail({
    to: adminRecipients(),
    subject: `[Giving — unverified] ${amount} from ${input.fullName}`,
    replyTo: input.email || undefined,
    text,
    html,
  });

  if (!result.ok) {
    if (result.reason === "failed") return { status: "error", values, message: "We couldn’t notify the team just now. Please try again shortly." };
    return { status: "unavailable", values, message: unavailableMessage("Transfer notification") };
  }

  return {
    status: "accepted",
    values,
    message: "Thank you — the team has been told to look out for your transfer. Your gift will be confirmed once it is received in the account.",
  };
}
