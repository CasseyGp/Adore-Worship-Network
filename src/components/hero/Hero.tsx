import Image from "next/image";
import worship from "@/assets/photos/worship-hero.jpeg";
import { event } from "@/content/site";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { TheragistMark } from "@/components/ui/Logo";
import { Waveform } from "@/components/ui/Waveform";

const stagger = (i: number) => ({ ["--i" as string]: i });

/**
 * Art direction for worship-hero.jpeg (736×1115 portrait; faces sit at ~29–50% height,
 * left of centre; the top quarter is natural darkness, the lower third is the orange sweater).
 *
 * Mobile/tablet: the photo runs edge to edge at close to its native ratio, the header floats
 * over its dark top, and the headline rises out of its lower edge — over clothing, never faces.
 * Desktop: the photo becomes a tall cinematic panel on the right, feathered into midnight on
 * its left edge only, so the colour and light stay intact.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-midnight lg:flex lg:min-h-svh lg:items-center"
    >
      <div className="relative h-[max(22rem,min(64svh,38rem))] w-full overflow-hidden max-lg:[@media(max-height:44rem)]:h-[max(18rem,54svh)] sm:h-[max(24rem,min(68svh,44rem))] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[52%]">
        <div className="hero-parallax absolute inset-x-0 -top-[8%] bottom-0">
          <Image
            src={worship}
            alt="Young worshippers standing in warm stage light, eyes closed and hands folded in prayer"
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="hero-settle object-cover object-[38%_34%] max-lg:[@media(max-height:44rem)]:object-[38%_26%] sm:object-[40%_30%] lg:object-[42%_38%]"
          />
        </div>
        {/* Scrims: only where text or the header needs contrast. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-midnight/75 to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[58%] bg-linear-to-t from-midnight via-midnight/75 to-transparent lg:h-48 lg:via-midnight/30" />
        <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[20%] bg-linear-to-r from-midnight via-midnight/45 to-transparent lg:block" />
        <div aria-hidden="true" className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_85%_10%,rgb(15_106_99/0.28),transparent_55%)] mix-blend-soft-light lg:block" />
      </div>

      {/* Atmosphere behind the text column — gradients only. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -left-1/3 bottom-0 aspect-square w-[130%] rounded-full bg-[radial-gradient(circle,rgb(18_48_122/0.6),transparent_62%)] lg:-left-[15%] lg:top-1/4 lg:w-[60%]" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-4 -z-[1] overflow-hidden opacity-80 lg:bottom-8 lg:w-1/2">
        <Waveform amplitude={18} wavelength={480} stroke="#5FE0D3" opacity={0.35} />
        <Waveform amplitude={12} wavelength={360} phase={60} stroke="#F0B85C" opacity={0.25} className="-mt-10 [animation-direction:reverse]" />
      </div>

      <div className="wrap relative -mt-[7.5rem] pb-14 sm:-mt-40 lg:mt-0 lg:py-[calc(var(--header-h)+3rem)]">
        <div className="flex max-w-[40rem] flex-col gap-5 sm:gap-6 lg:max-w-[min(36rem,42vw)]">
          <p className="enter flex flex-wrap items-center gap-x-4 gap-y-2" style={stagger(1)}>
            <span className="display text-[1.6rem] italic leading-none text-amber-soft sm:text-[1.75rem]">{event.name}</span>
            <span aria-hidden="true" className="h-px w-10 bg-cyan" />
            <span className="eyebrow text-cyan-soft">An Adore Worship Movement experience</span>
          </p>

          <h1
            id="hero-title"
            className="display enter text-[clamp(2.9rem,13.5vw,5.25rem)] leading-[0.95] text-ivory-bright lg:text-[clamp(3.6rem,6.2vw,6.5rem)]"
            style={stagger(2)}
          >
            <span className="block">Worship that</span>
            <span className="block">reaches deeper.</span>
            <span className="mt-2 block text-[0.48em] italic leading-[1.05] text-cyan-soft sm:mt-3">Make room for renewal.</span>
          </h1>

          {/* Phones: one compact line so the CTA stays in the first screen. Larger screens: labelled columns. */}
          <dl className="enter flex flex-wrap gap-x-3 gap-y-1 text-[0.95rem] sm:gap-x-8 sm:gap-y-3" style={stagger(3)}>
            {[
              { k: "Date", v: <time dateTime={event.startsAt}>{event.dateLabel}</time> },
              { k: "Time", v: <time dateTime={event.startsAt}>{event.timeLabel}</time> },
              {
                k: "Venue",
                v: event.venue ?? (
                  <>
                    <span className="sm:hidden">Venue to be announced</span>
                    <span className="max-sm:hidden">To be announced</span>
                  </>
                ),
              },
            ].map((row, i) => (
              <div
                key={row.k}
                className="flex items-baseline gap-3 sm:block"
              >
                {i > 0 ? <span aria-hidden="true" className="text-amber sm:hidden">·</span> : null}
                <dt className="eyebrow text-[0.62rem] text-mist-dim max-sm:sr-only">{row.k}</dt>
                <dd className="font-semibold text-ivory sm:mt-1">{row.v}</dd>
              </div>
            ))}
          </dl>

          <div className="enter mt-1 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={stagger(4)}>
            <ButtonLink href="#register" className="sm:min-w-56">
              Reserve your place <Arrow />
            </ButtonLink>
            <ButtonLink href="#experience" variant="ghost-dark" className="whitespace-nowrap bg-midnight/30 backdrop-blur-sm">
              Discover the experience
            </ButtonLink>
          </div>

          <p className="enter max-w-[33rem] text-[1.0625rem] leading-[1.7] text-mist" style={stagger(5)}>
            An intimate evening of deep music, worship, reflection, and professional therapeutic support — prepared as a quiet
            sanctuary away from the noise.
          </p>

          <p className="enter flex items-center gap-3 text-sm text-mist-dim" style={stagger(6)}>
            In collaboration with
            <TheragistMark className="text-base text-ivory" />
          </p>
        </div>
      </div>
    </section>
  );
}
