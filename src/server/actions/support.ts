"use server";

import { randomUUID } from "node:crypto";
import { supportConfig } from "@/content/support";
import type { FormState } from "@/lib/forms/types";
import { type SupportField, parseAmount, validateSupport } from "@/lib/forms/validation";
import { createCheckout } from "@/server/integrations/flutterwave";
import { formString } from "./shared";

export async function startSupportCheckout(
  _prev: FormState<SupportField>,
  formData: FormData,
): Promise<FormState<SupportField>> {
  const rawAmount = formString(formData, "amount", 20);
  const input = {
    amount: parseAmount(rawAmount),
    fullName: formString(formData, "fullName"),
    email: formString(formData, "email"),
  };
  const values = { amount: rawAmount, fullName: input.fullName, email: input.email };

  const errors = validateSupport(input);
  if (Object.keys(errors).length) {
    return { status: "invalid", errors, values, message: "Please check the highlighted fields." };
  }

  const result = await createCheckout({
    amount: input.amount,
    currency: supportConfig.currency,
    email: input.email,
    name: input.fullName,
    txRef: `adore-${randomUUID()}`,
  });

  if (!result.ok) {
    if (result.reason === "failed") {
      return { status: "error", values, message: "We couldn’t open the secure checkout. Please try again shortly." };
    }
    return {
      status: "unavailable",
      values,
      message: "Online giving isn’t open yet. No payment has been taken and no card details were requested.",
    };
  }

  // Payment is not complete here — the receipt is shown only after server-side verification.
  return { status: "accepted", redirectUrl: result.data.link, message: "Opening secure checkout…" };
}
