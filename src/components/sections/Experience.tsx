import Image from "next/image";
import embrace from "@/assets/photos/embrace.jpeg";
import { partnership, pillars } from "@/content/site";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Waveform } from "@/components/ui/Waveform";

/** Each pillar gets its own quiet glyph: resonance, breath, care. */
const glyphs = [
  <path key="0" d="M4 24c4-10 8-10 12 0s8 10 12 0 8-10 12 0" />,
  <g key="1">
    <circle cx="22" cy="24" r="6" />
    <circle cx="22" cy="24" r="12" strokeOpacity=".5" />
    <circle cx="22" cy="24" r="18" strokeOpacity=".25" />
  </g>,
  <path key="2" d="M22 36s-12-7.2-12-15a6.5 6.5 0 0 1 12-3.4A6.5 6.5 0 0 1 34 21c0 7.8-12 15-12 15Z" />,
];

/**
 * embrace.jpeg (736×1270, warm monochrome) — two people holding one another in worship.
 * Faces at ~24–52% height, x ~27–60%; the lower half is plaid shirt and can take a fade.
 * Framed as a sanctuary arch: edge to edge on mobile, a sticky portrait column on desktop.
 */
export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section relative overflow-hidden bg-navy">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(15_106_99/0.35),transparent_55%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-24 overflow-hidden opacity-60">
        <Waveform amplitude={18} wavelength={600} stroke="#5FE0D3" opacity={0.25} motion="animate-flow-slow" />
      </div>

      <div className="wrap relative grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-14">
        <SectionIntro
          id="experience-title"
          eyebrow="The experience"
          className="lg:col-start-2"
          title={
            <>
              Come as you are.
              <br />
              <em className="text-cyan-soft">Make room for renewal.</em>
            </>
          }
        >
          <p>
            An exclusive evening of deep music, healing, renewal, and therapeutic sessions. Three movements, held together in one
            space — each making room for the others.
          </p>
        </SectionIntro>

        <figure className="relative mx-[calc(var(--gutter)*-1)] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mx-0">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            {/* Thin cyan arch echo, offset — the only ornament on the photo. */}
            <div aria-hidden="true" className="absolute inset-x-[6%] -top-4 bottom-8 hidden rounded-t-full border border-cyan/25 lg:block" />
            <div className="photo-reveal relative aspect-[4/5] overflow-hidden rounded-t-[50vw] bg-midnight sm:aspect-[5/4] sm:rounded-t-[40vw] lg:aspect-[3/4.4] lg:rounded-t-full lg:rounded-b-[2rem]">
              <div className="photo-drift absolute inset-x-0 -inset-y-[4%]">
                <Image
                  src={embrace}
                  alt="Two young men holding each other closely in an embrace during worship, one with his eyes closed"
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1216px) 500px, (min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-[46%_34%] sm:object-[46%_30%] lg:object-[44%_36%]"
                />
              </div>
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-navy to-transparent lg:from-navy/70" />
            </div>
          </div>
        </figure>

        <div className="flex flex-col gap-10 lg:col-start-2">
          <ol className="flex flex-col">
            {pillars.map((p, i) => (
              <li key={p.title} className="reveal grid grid-cols-[2.75rem_1fr] gap-x-5 border-t border-ivory/12 py-7 last:border-b">
                <svg viewBox="0 0 44 48" className="h-12 w-11 text-cyan" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                  {glyphs[i]}
                </svg>
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="display text-[2rem] leading-none text-ivory-bright">{p.title}</h3>
                    <span aria-hidden="true" className="display text-2xl italic text-amber/80">
                      {p.numeral}
                    </span>
                  </div>
                  <p className="mt-3 leading-relaxed text-mist">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="reveal max-w-2xl border-l-2 border-amber/60 pl-5 text-[0.95rem] leading-relaxed text-mist">{partnership.careNote}</p>
        </div>
      </div>
    </section>
  );
}
