"use client";

import { useActionState } from "react";
import { registerForEvent } from "@/server/actions/event-registration";
import type { FormState } from "@/lib/forms/types";
import { type EventField, validateEventRegistration } from "@/lib/forms/validation";
import { Arrow } from "@/components/ui/Button";
import { Checkbox, Field, FormNotice, Honeypot, RequiredMark, SubmitButton, describe, inputClass, valueOf } from "./fields";
import { useClientValidation } from "./useClientValidation";

const initial: FormState<EventField> = { status: "idle" };

export function EventRegistrationForm() {
  const [state, action, pending] = useActionState(registerForEvent, initial);
  const { clientErrors, onSubmit, clear } = useClientValidation<EventField>(
    (fd) =>
    validateEventRegistration({
      fullName: String(fd.get("fullName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      consent: fd.get("consent") === "on",
      updates: fd.get("updates") === "on",
    }),
    action,
  );
  const errors = clientErrors ?? state.errors ?? {};

  if (state.status === "accepted") {
    return <FormNotice state={state} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-6" aria-labelledby="register-form-title">
      <Honeypot />
      <div>
        <h3 id="register-form-title" className="display text-[2.1rem] leading-none text-navy">
          Reserve your place
        </h3>
        <p className="mt-2 text-sm text-muted">
          Fields marked <RequiredMark /> are required.
        </p>
      </div>

      <Field id="ev-fullName" label="Full name" required error={errors.fullName}>
        <input
          id="ev-fullName"
          name="fullName"
          autoComplete="name"
          defaultValue={valueOf(state, "fullName")}
          onChange={() => clear("fullName")}
          className={inputClass("light", !!errors.fullName)}
          {...describe("ev-fullName", errors.fullName)}
        />
      </Field>
      <Field id="ev-email" label="Email address" required error={errors.email}>
        <input
          id="ev-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          defaultValue={valueOf(state, "email")}
          onChange={() => clear("email")}
          className={inputClass("light", !!errors.email)}
          {...describe("ev-email", errors.email)}
        />
      </Field>
      <Field id="ev-phone" label="Phone number" required error={errors.phone}>
        <input
          id="ev-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={valueOf(state, "phone")}
          onChange={() => clear("phone")}
          className={inputClass("light", !!errors.phone)}
          {...describe("ev-phone", errors.phone)}
        />
      </Field>

      <p className="rounded-field bg-sand/70 px-4 py-3 text-[0.85rem] leading-relaxed text-slate">
        Please don’t include health, therapy, or medical information here. This form is used only to manage your registration.
      </p>

      <div className="flex flex-col gap-4">
        <Checkbox
          id="ev-consent"
          name="consent"
          requiredMark
          defaultChecked={valueOf(state, "consent") === "on"}
          error={errors.consent}
          onChange={() => clear("consent")}
          label="I agree that Adore Worship Movement may use these details to process my registration and contact me about this event."
        />
        <Checkbox id="ev-updates" name="updates" defaultChecked={valueOf(state, "updates") === "on"} label="Optional: send me future updates from Adore Worship Movement." />
      </div>

      <FormNotice state={clientErrors ? { status: "invalid", message: "Please check the highlighted fields." } : state} />

      <SubmitButton variant="navy" pending={pending}>
        Reserve my place <Arrow />
      </SubmitButton>
    </form>
  );
}
