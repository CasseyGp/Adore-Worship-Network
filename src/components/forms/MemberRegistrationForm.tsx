"use client";

import { useActionState, useState } from "react";
import { registerMember } from "@/server/actions/member-registration";
import {
  MAX_OUTREACH_ARMS,
  MOTIVATION_MAX,
  ROLE_OTHER,
  memberConsent,
  memberFormTitle,
  motivationQuestion,
  outreachArms,
  outreachIntro,
  outreachQuestion,
  roleOptions,
} from "@/content/outreach";
import type { FormState } from "@/lib/forms/types";
import { type MemberField, validateMemberRegistration } from "@/lib/forms/validation";
import { Arrow } from "@/components/ui/Button";
import { Checkbox, Field, FieldError, FormNotice, Honeypot, RequiredMark, SubmitButton, describe, inputClass, valueOf } from "./fields";
import { useClientValidation } from "./useClientValidation";

const initial: FormState<MemberField> = { status: "idle" };

function readForm(fd: FormData) {
  const s = (k: string) => String(fd.get(k) ?? "");
  return {
    fullName: s("fullName"),
    email: s("email"),
    phone: s("phone"),
    role: s("role"),
    roleOther: s("roleOther"),
    arms: fd.getAll("arms").map(String),
    motivation: s("motivation"),
    consent: fd.get("consent") === "on",
  };
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-sand-line pt-7 first:border-t-0 first:pt-0 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10">
      <h4 className="flex items-center gap-3 text-[0.95rem] font-bold text-navy md:flex-col md:items-start md:gap-2.5">
        <span className="display flex size-9 shrink-0 items-center justify-center rounded-full border border-teal-deep/30 text-lg text-teal-deep">{n}</span>
        {title}
      </h4>
      <div className="flex min-w-0 flex-col gap-5">{children}</div>
    </section>
  );
}

export function MemberRegistrationForm() {
  const [state, action, pending] = useActionState(registerMember, initial);
  const { clientErrors, onSubmit, clear } = useClientValidation<MemberField>((fd) => validateMemberRegistration(readForm(fd)), action);
  const errors = clientErrors ?? state.errors ?? {};
  const [arms, setArms] = useState<string[]>(() => (Array.isArray(state.values?.arms) ? state.values.arms : []));
  const [role, setRole] = useState(valueOf(state, "role") ?? "");
  const [motivationLength, setMotivationLength] = useState(valueOf(state, "motivation")?.length ?? 0);
  const [limitNotice, setLimitNotice] = useState(false);
  const full = arms.length >= MAX_OUTREACH_ARMS;

  if (state.status === "accepted") return <FormNotice state={state} />;

  function toggleArm(id: string) {
    clear("arms");
    if (arms.includes(id)) {
      setArms(arms.filter((a) => a !== id));
      setLimitNotice(false);
    } else if (full) {
      // Third choice: refuse and explain, rather than silently swapping.
      setLimitNotice(true);
    } else {
      setArms([...arms, id]);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-8" aria-labelledby="member-form-title">
      <Honeypot />
      <div>
        <h3 id="member-form-title" className="display text-[clamp(1.6rem,5.6vw,2.1rem)] leading-[1.1] text-navy">
          {memberFormTitle}
        </h3>
        <p className="mt-2 text-sm text-muted">
          Fields marked <RequiredMark /> are required.
        </p>
      </div>

      <Step n={1} title="Personal Details">
        <Field id="mb-fullName" label="Full Name" required error={errors.fullName}>
          <input id="mb-fullName" name="fullName" autoComplete="name" maxLength={120} defaultValue={valueOf(state, "fullName")} onChange={() => clear("fullName")} className={inputClass("light", !!errors.fullName)} {...describe("mb-fullName", errors.fullName)} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="mb-phone" label="Phone Number/WhatsApp Number" required error={errors.phone} hint="Include your country code if outside Nigeria, e.g. +234…">
            <input id="mb-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} defaultValue={valueOf(state, "phone")} onChange={() => clear("phone")} className={inputClass("light", !!errors.phone)} {...describe("mb-phone", errors.phone, true)} />
          </Field>
          <Field id="mb-email" label="Email address" required error={errors.email}>
            <input id="mb-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={254} defaultValue={valueOf(state, "email")} onChange={() => clear("email")} className={inputClass("light", !!errors.email)} {...describe("mb-email", errors.email)} />
          </Field>
        </div>
      </Step>

      <Step n={2} title="Primary Role/Skill">
        <Field id="mb-role" label="Primary Role/Skill" required error={errors.role}>
          <div className="relative">
            <select
              id="mb-role"
              name="role"
              value={role}
              onChange={(e) => {
                clear("role");
                clear("roleOther");
                setRole(e.target.value);
              }}
              className={`${inputClass("light", !!errors.role)} appearance-none pr-11`}
              {...describe("mb-role", errors.role)}
            >
              <option value="" disabled>
                Select your primary role or skill
              </option>
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-navy" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </Field>
        {role === ROLE_OTHER ? (
          <Field id="mb-roleOther" label="Please specify your role/skill" required error={errors.roleOther}>
            <input id="mb-roleOther" name="roleOther" maxLength={100} defaultValue={valueOf(state, "roleOther")} onChange={() => clear("roleOther")} className={inputClass("light", !!errors.roleOther)} {...describe("mb-roleOther", errors.roleOther)} />
          </Field>
        ) : null}
      </Step>

      <Step n={3} title="Outreach Arm Selection">
        <p className="text-[0.95rem] leading-relaxed text-slate">{outreachIntro}</p>
        <fieldset aria-describedby={`mb-arms-count${errors.arms ? " mb-arms-error" : ""}`} className="min-w-0">
          <legend className="text-[0.9rem] font-semibold leading-snug text-ink">
            {outreachQuestion}
            <RequiredMark />
          </legend>
          <p id="mb-arms-count" aria-live="polite" className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.85rem]">
            <span className={`rounded-pill px-3 py-1 font-semibold ${full ? "bg-navy text-ivory" : "bg-navy/5 text-navy"}`}>
              {arms.length} of {MAX_OUTREACH_ARMS} selected
            </span>
            {full ? (
              <span className={limitNotice ? "font-semibold text-amber-deep" : "text-muted"}>
                Maximum reached — deselect one to choose another.
              </span>
            ) : null}
          </p>

          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {outreachArms.map((arm) => {
              const checked = arms.includes(arm.id);
              const blocked = full && !checked;
              return (
                <li key={arm.id} className="flex">
                  <label
                    className={`relative flex w-full cursor-pointer items-start gap-3.5 rounded-[1rem] border px-4 py-3.5 transition-[background-color,border-color,opacity] duration-(--duration-quick) ease-flow has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-amber-deep ${
                      checked
                        ? "border-navy bg-navy text-ivory"
                        : blocked
                          ? "cursor-not-allowed border-sand-line bg-sand/40 text-ink/60"
                          : "border-sand-line bg-white text-ink hover:border-teal-deep/50"
                    }`}
                  >
                    {/* aria-disabled (not disabled) keeps blocked options reachable so their state is announced. */}
                    <input
                      type="checkbox"
                      name="arms"
                      value={arm.id}
                      checked={checked}
                      aria-disabled={blocked || undefined}
                      onChange={() => toggleArm(arm.id)}
                      className="peer sr-only"
                      {...(blocked ? { "aria-describedby": "mb-arms-count" } : {})}
                    />
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        checked ? "border-cyan bg-cyan text-navy" : "border-navy/30 bg-white"
                      }`}
                    >
                      {checked ? (
                        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3.5 8.5 3 3 6-7" />
                        </svg>
                      ) : null}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-[0.98rem] font-bold leading-snug">{arm.name}</span>
                      <span className={`text-[0.85rem] leading-relaxed ${checked ? "text-mist" : "text-muted"}`}>{arm.description}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="mt-3">
            <FieldError id="mb-arms-error" message={errors.arms} />
          </div>
        </fieldset>
      </Step>

      <Step n={4} title="Motivation">
        <Field
          id="mb-motivation"
          label={motivationQuestion}
          required
          error={errors.motivation}
          hint={
            <span className={motivationLength > MOTIVATION_MAX - 100 ? "font-semibold text-amber-deep" : ""}>
              {motivationLength.toLocaleString("en-NG")} / {MOTIVATION_MAX.toLocaleString("en-NG")} characters
            </span>
          }
        >
          <textarea
            id="mb-motivation"
            name="motivation"
            rows={5}
            maxLength={MOTIVATION_MAX}
            defaultValue={valueOf(state, "motivation")}
            onChange={(e) => {
              clear("motivation");
              setMotivationLength(e.target.value.length);
            }}
            className={`${inputClass("light", !!errors.motivation)} min-h-32 resize-y`}
            {...describe("mb-motivation", errors.motivation, true)}
          />
        </Field>
        <div className="flex flex-col gap-2">
          <Checkbox
            id="mb-consent"
            name="consent"
            requiredMark
            defaultChecked={valueOf(state, "consent") === "on"}
            error={errors.consent}
            onChange={() => clear("consent")}
            label={memberConsent}
          />
          <p className="pl-9 text-[0.85rem] text-muted">Your details are never shown publicly.</p>
        </div>
      </Step>

      <FormNotice state={clientErrors ? { status: "invalid", message: "Please check the highlighted fields." } : state} />

      <div>
        <SubmitButton variant="navy" pending={pending}>
          Submit my details <Arrow />
        </SubmitButton>
      </div>
    </form>
  );
}
