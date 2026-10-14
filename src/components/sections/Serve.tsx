import Image from "next/image";
import heldInTears from "@/assets/photos/held-in-tears.jpeg";
import { MemberRegistrationForm } from "@/components/forms/MemberRegistrationForm";
import { SectionIntro } from "@/components/ui/SectionIntro";

/**
 * held-in-tears.jpeg (735×490, monochrome) — a young woman weeping as someone holds her.
 * Her face sits at x ~40–65%, y ~5–60%; crops keep it centred and never trim the top of her head.
 */
export function Serve() {
  return (
    <section id="serve" aria-labelledby="serve-title" className="section overflow-hidden bg-sand text-ink scheme-light">
      <div className="wrap flex flex-col gap-12">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-6">
            <SectionIntro
              id="serve-title"
              tone="light"
              eyebrow="Member Registration & Outreach"
              title={
                <>
                  Your gifts have
                  <br />
                  <em className="text-teal-deep">a place here.</em>
                </>
              }
            >
              <p>
                As Adore grows, every member is called to be an active participant in ministry and service. Share your details and
                tell us where you feel called to contribute.
              </p>
            </SectionIntro>
            <p className="reveal max-w-xl rounded-field border border-navy/10 bg-ivory-bright/70 px-5 py-4 text-[0.92rem] leading-relaxed text-slate">
              This is separate from event registration — you don’t need this form to attend Worship Therapy.
            </p>
          </div>

          <figure className="relative mx-[calc(var(--gutter)*-1)] lg:mx-0">
            <div aria-hidden="true" className="absolute inset-0 hidden -translate-x-4 translate-y-4 rounded-[1.75rem] border border-teal-deep/30 lg:block" />
            <div className="photo-reveal relative aspect-[4/3] overflow-hidden bg-navy lg:aspect-[4/5] lg:rounded-[1.75rem] lg:shadow-soft">
              <Image
                src={heldInTears}
                alt="A young woman in tears being held closely in an embrace"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 384px, 100vw"
                className="object-cover object-[52%_20%] lg:object-[54%_30%]"
              />
            </div>
          </figure>
        </div>

        <div className="rounded-[1.75rem] bg-ivory-bright p-5 shadow-soft sm:p-10">
          <MemberRegistrationForm />
        </div>
      </div>
    </section>
  );
}
