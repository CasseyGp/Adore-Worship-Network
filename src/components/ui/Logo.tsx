import Image from "next/image";
import mark from "@/assets/brand/adore-mark.png";
import theragistLogo from "@/assets/brand/theragist-logo.png";

interface LogoProps {
  tone?: "light" | "dark";
  className?: string;
}

/** Adore mark + typographic lockup. The mark is decorative; the text carries the name. */
export function Logo({ tone = "light", className = "" }: LogoProps) {
  const sub = tone === "light" ? "text-mist-dim" : "text-muted";
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Image src={mark} alt="" width={40} height={39} sizes="40px" className="size-10 shrink-0" preload />
      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-extrabold tracking-[0.08em]">ADORE</span>
        <span className={`mt-1.5 text-[0.56rem] font-bold tracking-[0.22em] ${sub}`}>WORSHIP MOVEMENT</span>
      </span>
    </span>
  );
}

interface TheragistMarkProps {
  className?: string;
  /** Sizing for the logo tile; defaults to 1.5em so it tracks the label's font size. */
  logoClassName?: string;
  /** Hide the "Theragist" label when the name is already given nearby. */
  label?: boolean;
}

/**
 * Official Theragist logo (supplied 88×66 PNG with transparency) + name.
 * Served unoptimised so its colours and alpha are untouched; never render it
 * taller than its native 66px or it starts to soften.
 */
export function TheragistMark({ className = "", logoClassName = "h-[1.5em]", label = true }: TheragistMarkProps) {
  return (
    <span className={`inline-flex items-center gap-[0.5em] font-semibold tracking-[0.02em] ${className}`}>
      <Image
        src={theragistLogo}
        alt={label ? "" : "Theragist"}
        unoptimized
        className={`w-auto max-h-[66px] shrink-0 ${logoClassName}`}
      />
      {label ? "Theragist" : null}
    </span>
  );
}
