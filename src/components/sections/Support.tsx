import Image from "next/image";
import hands from "@/assets/photos/hands-joined.jpeg";
import { GivingPanel } from "@/components/forms/GivingPanel";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { Waveform } from "@/components/ui/Waveform";
import { getTransferDetails } from "@/server/giving";

/**
 * hands-joined.jpeg (736×414) — two hands clasped and raised in a worshipping crowd.
 * The hands sit right of centre (x ~57–82%), so crops anchor right to keep them whole.
 */
export function Support() {
  const transfer = getTransferDetails();
  return (
    <section id="support" aria-labelledby="support-title" className="section relative overflow-hidden bg-navy">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(240_184_92/0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgb(15_106_99/0.4),transparent_55%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-10 overflow-hidden">
        <Waveform amplitude={20} wavelength={540} stroke="#F0B85C" opacity={0.25} motion="animate-flow-slow" />
      </div>

      <div className="wrap relative grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-20">
        <div className="flex flex-col gap-10">
          <figure className="relative mx-[calc(var(--gutter)*-1)] lg:mx-0">
            <div className="photo-reveal relative aspect-[4/3] overflow-hidden bg-midnight sm:aspect-[16/9] lg:aspect-[16/10] lg:rounded-[1.75rem]">
              <Image
                src={hands}
                alt="Two hands clasped together and raised high in a crowd of worshippers"
                fill
                placeholder="blur"
                sizes="(min-width: 1216px) 640px, (min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[76%_45%] sm:object-[70%_45%] lg:object-[72%_45%]"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-navy to-transparent lg:from-navy/50" />
            </div>
          </figure>

          <SectionIntro
            id="support-title"
            eyebrow="Support the vision"
            title={
              <>
                Be part of what
                <br />
                <em className="text-amber-soft">makes this possible.</em>
              </>
            }
          >
            <p>
              Your support helps us create meaningful spaces for worship, connection, and service. Join us in supporting the vision
              and its outreach.
            </p>
            <p className="mt-4 font-semibold text-ivory">Giving is entirely voluntary and separate from registration.</p>
          </SectionIntro>
        </div>

        <div className="reveal rounded-[1.75rem] border border-ivory/12 bg-midnight/60 p-6 shadow-lift sm:p-9 lg:self-center">
          <GivingPanel transfer={transfer} />
        </div>
      </div>
    </section>
  );
}
