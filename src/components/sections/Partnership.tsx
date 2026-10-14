import Image from "next/image";
import mark from "@/assets/brand/adore-mark.png";
import { event, partnership } from "@/content/site";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { TheragistMark } from "@/components/ui/Logo";

export function Partnership() {
  return (
    <section id="partnership" aria-labelledby="partnership-title" className="section bg-ivory-bright text-ink scheme-light">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="flex flex-col gap-10">
          <SectionIntro
            id="partnership-title"
            tone="light"
            eyebrow="In collaboration with Theragist"
            title={
              <>
                Worship and well-being,
                <br />
                <em className="text-teal-deep">thoughtfully brought together.</em>
              </>
            }
          >
            <p>{partnership.summary}</p>
          </SectionIntro>

          <dl className="reveal grid gap-px overflow-hidden rounded-card border border-sand-line bg-sand-line sm:grid-cols-2">
            {partnership.roles.map((r) => (
              <div key={r.who} className="bg-ivory-bright p-6">
                <dt className="eyebrow text-teal-deep">{r.who}</dt>
                <dd className="mt-2 leading-relaxed text-slate">{r.what}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Co-brand lockup */}
        <div className="reveal relative flex flex-col gap-6">
          <div className="relative flex aspect-[4/3] items-center justify-center gap-4 overflow-hidden rounded-[2rem] bg-midnight px-5 text-ivory sm:gap-10">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgb(18_48_122/0.9),transparent_60%),radial-gradient(circle_at_75%_65%,rgb(15_106_99/0.7),transparent_55%)]" />
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory/10" />
            <div className="relative flex flex-col items-center gap-3">
              <Image src={mark} alt="" sizes="96px" className="size-14 sm:size-24" />
              <span className="text-[0.7rem] font-bold tracking-[0.22em] text-mist">ADORE</span>
            </div>
            <span aria-hidden="true" className="display relative text-4xl italic text-amber">
              ×
            </span>
            <div className="relative flex flex-col items-center gap-3">
              {/* Official logo at its native 66px height (never upscaled), on midnight for contrast. */}
              <TheragistMark label={false} logoClassName="h-14 sm:h-[66px]" />
              <span aria-hidden="true" className="text-[0.7rem] font-bold tracking-[0.22em] text-mist">THERAGIST</span>
            </div>
          </div>
          <p className="-mt-2 text-center text-[0.8rem] tracking-[0.04em] text-muted">Professional care partner for {event.name}</p>
          <p className="rounded-field bg-sand/60 px-5 py-4 text-[0.92rem] leading-relaxed text-slate" role="note">
            <strong className="font-semibold text-navy">Need help now?</strong> {partnership.crisisNote}
          </p>
        </div>
      </div>
    </section>
  );
}
