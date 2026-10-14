import { event, nav, site } from "@/content/site";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Logo, TheragistMark } from "@/components/ui/Logo";
import { Waveform } from "@/components/ui/Waveform";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-midnight pb-[max(2rem,env(safe-area-inset-bottom))]">
      {/* Closing invitation */}
      <div className="wrap section relative flex flex-col items-start gap-8 lg:items-center lg:text-center">
        <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -z-0 -translate-y-1/2 overflow-hidden opacity-70">
          <Waveform amplitude={40} wavelength={720} stroke="#5FE0D3" opacity={0.18} motion="animate-flow-slow" />
        </div>
        <h2 className="display reveal relative max-w-3xl text-[clamp(2.6rem,9vw,5.25rem)] leading-[0.98] text-ivory-bright">
          Make room for a <em className="text-cyan-soft">different kind of evening.</em>
        </h2>
        <p className="reveal relative max-w-xl text-[1.0625rem] leading-relaxed text-mist">
          Join Adore Worship Movement for {event.name} — an intimate experience of music, worship, reflection, and renewal.
        </p>
        <p className="reveal relative eyebrow text-amber-soft">
          <time dateTime={event.startsAt}>
            {event.dateLabel} · {event.timeLabel}
          </time>
        </p>
        <div className="reveal relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="#register">
            Reserve your place <Arrow />
          </ButtonLink>
          <ButtonLink href="#support" variant="ghost-dark">
            Support the vision
          </ButtonLink>
        </div>
      </div>

      <div className="wrap">
        <div className="grid gap-12 border-t border-ivory/10 pt-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-sm text-[0.92rem] leading-relaxed text-mist-dim">{site.description}</p>
            <p className="flex flex-wrap items-center gap-2 text-[0.85rem] text-mist-dim">
              {event.name} is presented in collaboration with <TheragistMark className="text-ivory" />
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow text-mist-dim">Explore</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 md:grid-cols-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="inline-flex min-h-11 items-center text-[0.95rem] text-mist transition-colors hover:text-ivory">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-mist-dim">Contact</h2>
            <ul className="mt-4 flex flex-col gap-3 text-[0.95rem] text-mist">
              {site.contactEmail ? (
                <li>
                  <a className="underline-offset-4 hover:underline" href={`mailto:${site.contactEmail}`}>
                    {site.contactEmail}
                  </a>
                </li>
              ) : (
                <li className="text-mist-dim">Contact details coming soon.</li>
              )}
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a className="underline-offset-4 hover:underline" href={s.href} rel="noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-ivory/10 pt-6 text-[0.8rem] text-mist-dim">
          © {new Date(event.startsAt).getFullYear()} {site.name}. All rights reserved. · {site.tagline}
        </p>
      </div>
    </footer>
  );
}
