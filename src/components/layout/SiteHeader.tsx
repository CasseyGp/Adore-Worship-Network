"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes, focus returns to toggle; body scroll locked while open.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 64rem)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      document.documentElement.style.overflow = "";
      toggle?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = () => setOpen(false);
  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow,backdrop-filter] duration-(--duration-settle) ease-flow ${
        solid ? "bg-midnight/90 shadow-[0_1px_0_rgb(247_242_232/0.08)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-pill focus:bg-ivory focus:px-4 focus:py-2 focus:text-navy"
      >
        Skip to content
      </a>
      <div className="wrap flex h-(--header-h) items-center justify-between gap-6">
        <a href="#top" aria-label="Adore Worship Movement — home" className="text-ivory" onClick={close}>
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative py-2 text-sm font-medium text-mist transition-colors hover:text-ivory after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-cyan after:transition-transform after:duration-(--duration-settle) hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink href="#register" variant="ivory" className="hidden min-h-11! px-5! text-sm! sm:inline-flex">
            Register
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-pill border border-ivory/20 bg-ivory/5 text-ivory transition-colors hover:bg-ivory/10 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <path
                className="origin-center transition-transform duration-(--duration-settle) ease-flow"
                style={{ transform: open ? "translateY(4px) rotate(45deg)" : "none" }}
                d="M5 8h14"
              />
              <path
                className="origin-center transition-transform duration-(--duration-settle) ease-flow"
                style={{ transform: open ? "translateY(-4px) rotate(-45deg)" : "none" }}
                d="M5 16h14"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-var(--header-h)-env(safe-area-inset-top))] overflow-y-auto overscroll-contain border-t border-ivory/10 bg-midnight lg:hidden"
      >
        <nav aria-label="Mobile" className="wrap flex flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} className="enter border-b border-ivory/10" style={{ ["--i" as string]: i }}>
                <a href={item.href} onClick={close} className="display flex min-h-16 items-center justify-between text-[2rem] text-ivory-bright">
                  {item.label}
                  <span aria-hidden="true" className="text-base text-cyan">
                    ↘
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href="#register" onClick={close} className="mt-8 w-full">
            Reserve your place
          </ButtonLink>
          <ButtonLink href="#support" onClick={close} variant="ghost-dark" className="mt-3 w-full">
            Support the vision
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
