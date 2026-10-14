"use client";

import { useFormStatus } from "react-dom";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { FormState } from "@/lib/forms/types";
import { buttonClass, type ButtonVariant } from "@/components/ui/Button";

/** Forms render on two surfaces: ivory cards ("light") and night panels ("dark"). */
export type Surface = "light" | "dark";

const labelTone: Record<Surface, string> = { light: "text-ink", dark: "text-ivory" };
const hintTone: Record<Surface, string> = { light: "text-muted", dark: "text-mist-dim" };
const errorTone: Record<Surface, string> = { light: "text-error", dark: "text-error-soft" };

export const inputClass = (surface: Surface, invalid: boolean) =>
  [
    "block w-full min-h-13 rounded-field border px-4 py-3 text-base transition-[border-color,box-shadow,background-color] duration-(--duration-quick)",
    "focus:outline-none focus-visible:outline-none",
    surface === "light"
      ? "bg-white text-ink placeholder:text-muted/70 border-sand-line focus:border-teal-deep focus:shadow-[0_0_0_3px_rgb(15_106_99/0.18)]"
      : "bg-ivory/5 text-ivory placeholder:text-mist-dim/70 border-ivory/20 focus:border-cyan focus:shadow-[0_0_0_3px_rgb(95_224_211/0.2)]",
    invalid ? (surface === "light" ? "border-error!" : "border-error-soft!") : "",
  ].join(" ");

interface FieldProps {
  id: string;
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  surface?: Surface;
  children: ReactNode;
}

export function Field({ id, label, required, hint, error, surface = "light", children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={`text-[0.9rem] font-semibold ${labelTone[surface]}`}>
        {label}
        {required ? <RequiredMark surface={surface} /> : <span className={`ml-1.5 font-normal ${hintTone[surface]}`}>(optional)</span>}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className={`text-[0.85rem] leading-snug ${hintTone[surface]}`}>
          {hint}
        </p>
      ) : null}
      <FieldError id={`${id}-error`} message={error} surface={surface} />
    </div>
  );
}

export function RequiredMark({ surface = "light" }: { surface?: Surface }) {
  return (
    <>
      <span aria-hidden="true" className={`ml-1 ${surface === "light" ? "text-amber-deep" : "text-amber"}`}>
        *
      </span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

export function FieldError({ id, message, surface = "light" }: { id: string; message?: string; surface?: Surface }) {
  if (!message) return null;
  return (
    <p id={id} className={`flex items-start gap-2 text-[0.85rem] font-medium ${errorTone[surface]}`}>
      <svg viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0" aria-hidden="true" fill="currentColor">
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 4.75h1.5v4.5h-1.5v-4.5Zm0 6h1.5v1.5h-1.5v-1.5Z" />
      </svg>
      {message}
    </p>
  );
}

/** aria wiring for an input given its id, error and hint presence. */
export function describe(id: string, error?: string, hint?: boolean) {
  const ids = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return { "aria-invalid": error ? true : undefined, "aria-describedby": ids || undefined } as const;
}

interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  id: string;
  label: ReactNode;
  error?: string;
  surface?: Surface;
  requiredMark?: boolean;
}

export function Checkbox({ id, label, error, surface = "light", requiredMark, ...props }: CheckboxProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={`flex cursor-pointer items-start gap-3.5 text-[0.92rem] leading-relaxed ${surface === "light" ? "text-slate" : "text-mist"}`}>
        <input
          id={id}
          type="checkbox"
          className={`mt-0.5 size-5.5 shrink-0 cursor-pointer rounded-md ${surface === "light" ? "accent-teal-deep" : "accent-cyan"}`}
          {...describe(id, error)}
          {...props}
        />
        <span>
          {label}
          {requiredMark ? <RequiredMark surface={surface} /> : null}
        </span>
      </label>
      <FieldError id={`${id}-error`} message={error} surface={surface} />
    </div>
  );
}

interface SubmitButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  /** pass `isPending` from useActionState when the form submits via startTransition */
  pending?: boolean;
}

export function SubmitButton({ children, variant = "primary", className = "", pending: pendingProp }: SubmitButtonProps) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button type="submit" className={buttonClass(variant, `w-full sm:w-auto ${className}`)} disabled={pending} aria-disabled={pending}>
      {pending ? (
        <>
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          Sending…
        </>
      ) : (
        children
      )}
    </button>
  );
}

const noticeTone: Record<Exclude<FormState["status"], "idle">, { light: string; dark: string; title: string }> = {
  invalid: { light: "border-error/30 bg-error/5 text-error", dark: "border-error-soft/40 bg-error-soft/10 text-error-soft", title: "Almost there" },
  error: { light: "border-error/30 bg-error/5 text-error", dark: "border-error-soft/40 bg-error-soft/10 text-error-soft", title: "Something went wrong" },
  unavailable: { light: "border-amber-deep/30 bg-amber/10 text-ink", dark: "border-amber/40 bg-amber/10 text-ivory", title: "Not open online yet" },
  accepted: { light: "border-teal-deep/30 bg-teal/10 text-ink", dark: "border-cyan/40 bg-cyan/10 text-ivory", title: "Received" },
};

/** Live region announcing the server's response. */
export function FormNotice({ state, surface = "light" }: { state: FormState; surface?: Surface }) {
  return (
    <div aria-live="polite" role="status">
      {state.status !== "idle" && state.message ? (
        <div className={`rounded-field border px-4 py-3.5 text-[0.92rem] leading-relaxed ${noticeTone[state.status][surface]}`}>
          <p className="font-semibold">{noticeTone[state.status].title}</p>
          <p className="mt-0.5 opacity-90">{state.message}</p>
        </div>
      ) : null}
    </div>
  );
}

export function valueOf(state: FormState, key: string): string | undefined {
  const v = state.values?.[key];
  return typeof v === "string" ? v : undefined;
}

/** Spam trap: hidden from people and assistive tech; bots that fill every field are rejected on the server. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
