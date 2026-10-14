/**
 * Validation shared by client (instant feedback) and server (source of truth).
 * Pure functions only — safe to import from either side.
 */
import { MAX_OUTREACH_ARMS, MOTIVATION_MAX, ROLE_OTHER, outreachArms, roleOptions } from "@/content/outreach";
import { supportConfig } from "@/content/support";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s().-]{7,20}$/;

type Errors<F extends string> = Partial<Record<F, string>>;

function required(v: string | undefined, label: string) {
  return v && v.trim() ? undefined : `Please enter your ${label}.`;
}

function contactErrors(v: { fullName?: string; email?: string; phone?: string }) {
  const e: Errors<"fullName" | "email" | "phone"> = {};
  e.fullName = required(v.fullName, "full name");
  if (!e.fullName && v.fullName!.trim().length < 2) e.fullName = "Please enter your full name.";
  e.email = required(v.email, "email address");
  if (!e.email && !EMAIL.test(v.email!.trim())) e.email = "Please enter a valid email address, like name@example.com.";
  e.phone = required(v.phone, "phone number");
  if (!e.phone && !PHONE.test(v.phone!.trim())) e.phone = "Please enter a valid phone number, including country code if outside Nigeria.";
  return e;
}

function clean<F extends string>(e: Errors<F>): Errors<F> {
  return Object.fromEntries(Object.entries(e).filter(([, m]) => m)) as Errors<F>;
}

/* ---------------- Event registration ---------------- */

export type EventField = "fullName" | "email" | "phone" | "consent" | "updates";

export interface EventRegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  consent: boolean;
  updates: boolean;
}

export function validateEventRegistration(v: EventRegistrationInput): Errors<EventField> {
  const e: Errors<EventField> = contactErrors(v);
  if (!v.consent) e.consent = "Please confirm we may use these details to process your registration.";
  return clean(e);
}

/* ---------------- Member registration & outreach ---------------- */

export type MemberField = "fullName" | "email" | "phone" | "role" | "roleOther" | "arms" | "motivation" | "consent";

export interface MemberRegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  roleOther: string;
  arms: string[];
  motivation: string;
  consent: boolean;
}

export function validateMemberRegistration(v: MemberRegistrationInput): Errors<MemberField> {
  const e: Errors<MemberField> = contactErrors(v);

  if (!v.role) e.role = "Please choose your primary role or skill.";
  else if (!roleOptions.some((r) => r.value === v.role)) e.role = "Please choose a role from the list.";
  else if (v.role === ROLE_OTHER) {
    const other = v.roleOther.trim();
    if (!other) e.roleOther = "Please tell us your role or skill.";
    else if (other.length > 100) e.roleOther = "Please keep this under 100 characters.";
  }

  const validIds = new Set(outreachArms.map((a) => a.id));
  const arms = [...new Set(v.arms)];
  if (arms.length === 0) e.arms = `Please choose at least one outreach (up to ${MAX_OUTREACH_ARMS}).`;
  else if (arms.length > MAX_OUTREACH_ARMS) e.arms = `Please choose no more than ${MAX_OUTREACH_ARMS} outreach options.`;
  else if (arms.some((a) => !validIds.has(a))) e.arms = "Please choose from the listed outreach options.";

  const m = v.motivation.trim();
  if (!m) e.motivation = "Please tell us why you feel led to serve.";
  else if (m.length < 10) e.motivation = "Please share a little more — a sentence or two is perfect.";
  else if (m.length > MOTIVATION_MAX) e.motivation = `Please keep your answer to ${MOTIVATION_MAX.toLocaleString("en-NG")} characters or fewer.`;

  if (!v.consent) e.consent = "Please confirm we may store and use these details to contact you about serving.";
  return clean(e);
}

/* ---------------- Voluntary giving ---------------- */

export type GivingField = "amount" | "fullName" | "email";

export interface GivingInput {
  amount: number;
  fullName: string;
  /** optional — lets the team reply about the gift */
  email: string;
}

export function validateGiving(v: GivingInput): Errors<GivingField> {
  const e: Errors<GivingField> = {};
  const { minAmount, maxAmount, currencySymbol } = supportConfig;
  if (!Number.isFinite(v.amount) || v.amount <= 0) e.amount = "Please enter an amount.";
  else if (!Number.isInteger(v.amount)) e.amount = "Please enter a whole number of Naira.";
  else if (v.amount < minAmount) e.amount = `The minimum is ${currencySymbol}${minAmount.toLocaleString("en-NG")}.`;
  else if (v.amount > maxAmount) e.amount = `For gifts above ${currencySymbol}${maxAmount.toLocaleString("en-NG")}, please contact the team directly.`;
  e.fullName = required(v.fullName, "name");
  if (!e.fullName && v.fullName.trim().length > 120) e.fullName = "Please keep your name under 120 characters.";
  if (v.email.trim() && !EMAIL.test(v.email.trim())) e.email = "Please enter a valid email address, like name@example.com.";
  return clean(e);
}

/** Kept for the (not yet implemented) Flutterwave card checkout. */
export type SupportField = GivingField;
export const validateSupport = (v: GivingInput & { email: string }) => {
  const e = validateGiving(v);
  if (!v.email.trim()) e.email = "Please enter your email address.";
  return e;
};

export function parseAmount(raw: string): number {
  return Number(raw.replace(/[^\d.]/g, ""));
}
