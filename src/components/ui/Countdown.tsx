"use client";

import { useSyncExternalStore } from "react";
import { event } from "@/content/site";

const target = Date.parse(event.startsAt); // absolute instant — correct in every visitor timezone

/** One shared ticker aligned to the second boundary; stops when nothing is subscribed. */
function subscribe(onTick: () => void) {
  let id: ReturnType<typeof setTimeout>;
  const loop = () => {
    onTick();
    id = setTimeout(loop, 1000 - (Date.now() % 1000));
  };
  id = setTimeout(loop, 1000 - (Date.now() % 1000));
  return () => clearTimeout(id);
}
// Whole seconds, so React re-renders at most once per second.
const getSnapshot = () => Math.floor(Date.now() / 1000);
// Prerendered HTML can't know the visitor's clock — render a neutral frame, then hydrate.
const getServerSnapshot = () => null;

const lagosDay = (ms: number) => new Intl.DateTimeFormat("en-CA", { timeZone: event.timeZone }).format(ms);

const units = [
  { key: "days", label: "Days", s: 86400 },
  { key: "hours", label: "Hours", s: 3600 },
  { key: "minutes", label: "Minutes", s: 60 },
  { key: "seconds", label: "Seconds", s: 1 },
] as const;

function split(totalSeconds: number) {
  let rest = totalSeconds;
  return units.map((u) => {
    const v = Math.floor(rest / u.s);
    rest -= v * u.s;
    return { ...u, value: v };
  });
}

export function Countdown({ className = "" }: { className?: string }) {
  const nowSec = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const remaining = nowSec === null ? null : Math.max(0, Math.floor(target / 1000) - nowSec);

  if (remaining === 0 && nowSec !== null) {
    const today = lagosDay(nowSec * 1000) === lagosDay(target);
    return (
      <div className={`rounded-card border border-amber/35 bg-midnight/60 px-6 py-6 ${className}`} role="status">
        <p className="eyebrow text-amber">{today ? "Today" : "Thank you"}</p>
        <p className="display mt-2 text-[2rem] leading-tight text-ivory-bright">
          {today ? `${event.name} began at ${event.timeLabel} today.` : `${event.name} has taken place.`}
        </p>
        <p className="mt-2 text-[0.95rem] text-mist">
          {today
            ? `We’re gathered at ${event.venue ?? "the venue"}.`
            : `Held on ${event.dateLabel}. Thank you to everyone who made room for renewal with us.`}
        </p>
      </div>
    );
  }

  const parts = remaining === null ? null : split(remaining);
  const days = parts?.[0].value;

  return (
    <div className={className}>
      <p className="sr-only">
        {days === undefined ? `Countdown to ${event.name}.` : `${days} ${days === 1 ? "day" : "days"} until ${event.name}.`}
      </p>
      {/* Visual ticker is hidden from screen readers so it doesn't announce every second. */}
      <ol aria-hidden="true" className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((u, i) => {
          const v = parts?.[i].value;
          const text = v === undefined ? "––" : String(v).padStart(2, "0");
          return (
            <li
              key={u.key}
              className="relative flex flex-col items-center overflow-hidden rounded-[1.1rem] border border-ivory/10 bg-[linear-gradient(180deg,rgb(14_26_61/0.95),rgb(7_14_36/0.95))] px-1 pb-3 pt-4 shadow-lift"
            >
              <span aria-hidden="true" className={`absolute inset-x-4 top-0 h-px ${i === 3 ? "bg-amber/60" : "bg-cyan/40"}`} />
              <span className="relative block h-[1em] overflow-hidden text-[clamp(2rem,9vw,3.25rem)] leading-none tabular-nums">
                {/* Keyed by value: each change remounts the digit and plays one short rise. */}
                <span key={text} className={`display block ${v === undefined ? "text-mist-dim" : "countdown-tick text-ivory-bright"}`}>
                  {text}
                </span>
              </span>
              <span className={`eyebrow mt-2.5 text-[0.6rem] sm:text-[0.66rem] ${i === 3 ? "text-amber-soft" : "text-cyan-soft"}`}>{u.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
