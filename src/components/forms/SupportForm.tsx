"use client";

import { useActionState, useEffect, useState } from "react";
import { startSupportCheckout } from "@/server/actions/support";
import { supportConfig } from "@/content/support";
import type { FormState } from "@/lib/forms/types";
import { type SupportField, parseAmount, validateSupport } from "@/lib/forms/validation";
import { Field, FormNotice, SubmitButton, describe, inputClass, valueOf } from "./fields";
import { useClientValidation } from "./useClientValidation";

const initial: FormState<SupportField> = { status: "idle" };
const fmt = (n: number) => n.toLocaleString("en-NG");

export function SupportForm() {
  const [state, action, pending] = useActionState(startSupportCheckout, initial);
  const { clientErrors, onSubmit, clear } = useClientValidation<SupportField>((fd) =>
    validateSupport({
      amount: parseAmount(String(fd.get("amount") ?? "")),
      fullName: String(fd.get("fullName") ?? ""),
      email: String(fd.get("email") ?? ""),
    }),
    action,
  );
  const errors = clientErrors ?? state.errors ?? {};
  const [amount, setAmount] = useState(valueOf(state, "amount") ?? "");
  const { presetAmounts, currencySymbol } = supportConfig;

  // Hand off to Flutterwave's hosted checkout only when the server returns a verified link.
  useEffect(() => {
    if (state.status === "accepted" && state.redirectUrl) window.location.assign(state.redirectUrl);
  }, [state]);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6" aria-label="Voluntary support">
      {presetAmounts.length > 0 ? (
        <fieldset>
          <legend className="text-[0.9rem] font-semibold text-ivory">Choose an amount ({supportConfig.currency})</legend>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {presetAmounts.map((p) => {
              const on = parseAmount(amount) === p;
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    clear("amount");
                    setAmount(String(p));
                  }}
                  className={`min-h-14 rounded-field border text-[0.95rem] font-semibold transition-colors ${
                    on ? "border-ivory bg-ivory text-navy" : "border-ivory/25 text-ivory hover:border-ivory/60"
                  }`}
                >
                  {currencySymbol}
                  {fmt(p)}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <Field id="sp-amount" surface="dark" label={presetAmounts.length ? "Or enter your own amount" : `Amount (${supportConfig.currency})`} required error={errors.amount}>
        <div className="relative">
          <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-amber">
            {currencySymbol}
          </span>
          <input
            id="sp-amount"
            name="amount"
            inputMode="numeric"
            autoComplete="transaction-amount"
            placeholder="0"
            value={amount}
            onChange={(e) => {
              clear("amount");
              setAmount(e.target.value.replace(/[^\d,]/g, ""));
            }}
            className={`${inputClass("dark", !!errors.amount)} pl-10 text-lg font-semibold`}
            {...describe("sp-amount", errors.amount)}
          />
        </div>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="sp-name" surface="dark" label="Name" required error={errors.fullName}>
          <input id="sp-name" name="fullName" autoComplete="name" defaultValue={valueOf(state, "fullName")} onChange={() => clear("fullName")} className={inputClass("dark", !!errors.fullName)} {...describe("sp-name", errors.fullName)} />
        </Field>
        <Field id="sp-email" surface="dark" label="Email for your receipt" required error={errors.email}>
          <input id="sp-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} defaultValue={valueOf(state, "email")} onChange={() => clear("email")} className={inputClass("dark", !!errors.email)} {...describe("sp-email", errors.email)} />
        </Field>
      </div>

      <FormNotice surface="dark" state={clientErrors ? { status: "invalid", message: "Please check the highlighted fields." } : state} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SubmitButton pending={pending}>
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="7" width="10" height="7" rx="1.5" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
          </svg>
          Continue to secure checkout
        </SubmitButton>
      </div>
      <p className="text-[0.85rem] leading-relaxed text-mist-dim">
        You’ll complete payment on Flutterwave’s secure checkout — card details are never entered on this site. A receipt appears only after your payment is verified.
      </p>
    </form>
  );
}
