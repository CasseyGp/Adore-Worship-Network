import Image from "next/image";
import mark from "@/assets/brand/adore-mark.png";

/** Concentric resonance rings around the Adore mark. Pure SVG + CSS motion. */
export function HeroSculpture({ className = "" }: { className?: string }) {
  const spin = "origin-center [transform-box:fill-box]";
  return (
    <div aria-hidden="true" className={`pointer-events-none aspect-square ${className}`}>
      <div className="absolute inset-[8%] animate-breathe rounded-full bg-[radial-gradient(circle,rgb(247_242_232/0.16),rgb(95_224_211/0.1)_40%,transparent_70%)]" />
      <svg viewBox="0 0 600 600" fill="none" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="hero-arc-cyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5FE0D3" stopOpacity="0" />
            <stop offset="1" stopColor="#5FE0D3" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="hero-arc-amber" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F0B85C" stopOpacity="0" />
            <stop offset="1" stopColor="#F0B85C" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <circle cx="300" cy="300" r="292" stroke="#F7F2E8" strokeOpacity=".18" strokeWidth="1.4" strokeDasharray="1.5 11" strokeLinecap="round" />
        <g className={`animate-turn ${spin}`}>
          <circle cx="300" cy="300" r="256" stroke="url(#hero-arc-cyan)" strokeWidth="2" strokeDasharray="460 1150" strokeLinecap="round" />
        </g>
        <g className={`animate-turn-reverse ${spin}`}>
          <circle cx="300" cy="300" r="222" stroke="url(#hero-arc-amber)" strokeWidth="1.6" strokeDasharray="190 1200" strokeLinecap="round" />
        </g>
        <circle cx="300" cy="300" r="222" stroke="#F7F2E8" strokeOpacity=".07" />
        <circle cx="300" cy="300" r="188" stroke="#5FE0D3" strokeOpacity=".14" />
      </svg>
      <div className="absolute inset-[25%] flex items-center justify-center">
        <Image
          src={mark}
          alt=""
          priority
          sizes="(min-width: 1024px) 320px, 45vw"
          className="h-auto w-full drop-shadow-[0_24px_60px_rgb(46_196_182/0.3)]"
        />
      </div>
    </div>
  );
}
