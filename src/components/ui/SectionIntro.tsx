import type { ReactNode } from "react";

interface SectionIntroProps {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  tone?: "light" | "dark";
  align?: "start" | "center";
  className?: string;
}

/** Eyebrow + display headline + lead copy. `tone` = background the intro sits on. */
export function SectionIntro({ id, eyebrow, title, children, tone = "dark", align = "start", className = "" }: SectionIntroProps) {
  const dark = tone === "dark";
  return (
    <div className={`reveal flex flex-col gap-5 ${align === "center" ? "items-center text-center" : ""} ${className}`}>
      <p className={`eyebrow flex items-center gap-3 ${dark ? "text-cyan" : "text-teal-deep"}`}>
        <span aria-hidden="true" className={`h-px w-8 ${dark ? "bg-cyan/70" : "bg-teal-deep/60"}`} />
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`display text-[clamp(2.6rem,9vw,5rem)] leading-[0.98] ${dark ? "text-ivory-bright" : "text-navy"}`}
      >
        {title}
      </h2>
      {children ? (
        <div className={`max-w-xl text-[1.0625rem] leading-relaxed ${dark ? "text-mist" : "text-slate"}`}>{children}</div>
      ) : null}
    </div>
  );
}
