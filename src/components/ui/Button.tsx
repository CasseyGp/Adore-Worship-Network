import type { ComponentPropsWithoutRef } from "react";

export type ButtonVariant = "primary" | "ivory" | "ghost-dark" | "ghost-light" | "navy";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-pill px-6 text-[0.95rem] font-semibold tracking-[0.01em] " +
  "transition-[background-color,color,box-shadow,transform,border-color] duration-(--duration-quick) ease-flow " +
  "hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-amber text-navy hover:bg-amber-soft shadow-[0_14px_30px_-16px_rgb(240_184_92/0.8)]",
  ivory: "bg-ivory text-navy hover:bg-white",
  navy: "bg-navy text-ivory hover:bg-ocean",
  "ghost-dark": "border border-ivory/25 text-ivory hover:border-ivory/60 hover:bg-ivory/5",
  "ghost-light": "border border-navy/20 text-navy hover:border-navy/50 hover:bg-navy/5",
};

export function buttonClass(variant: ButtonVariant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

type LinkProps = ComponentPropsWithoutRef<"a"> & { variant?: ButtonVariant };

export function ButtonLink({ variant = "primary", className = "", ...props }: LinkProps) {
  return <a className={buttonClass(variant, className)} {...props} />;
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`size-4 shrink-0 ${className}`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
