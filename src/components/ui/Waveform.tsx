/**
 * Flowing sine waveform rendered on the server — no JS shipped.
 * The path spans two periods' worth of width so a -50% translate loops seamlessly.
 */
interface WaveformProps {
  amplitude?: number;
  wavelength?: number;
  phase?: number;
  stroke: string;
  opacity?: number;
  width?: number;
  className?: string;
  /** Tailwind animate-* class, or "" for static */
  motion?: string;
}

function sinePath(amp: number, wl: number, phase: number, width: number, mid: number) {
  const step = 24;
  let d = "";
  for (let x = 0; x <= width * 2; x += step) {
    const y = mid + amp * Math.sin(((x + phase) / wl) * Math.PI * 2);
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
  }
  return d.trim();
}

export function Waveform({
  amplitude = 30,
  wavelength = 480,
  phase = 0,
  stroke,
  opacity = 0.4,
  width = 1440,
  className = "",
  motion = "animate-flow",
}: WaveformProps) {
  // keep width an exact multiple of wavelength for a seamless loop
  const w = Math.round(width / wavelength) * wavelength;
  const h = amplitude * 2 + 8;
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none block h-auto w-[200%] max-w-none ${motion} ${className}`}
      viewBox={`0 0 ${w * 2} ${h}`}
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d={sinePath(amplitude, wavelength, phase, w, h / 2)}
        stroke={stroke}
        strokeOpacity={opacity}
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}
