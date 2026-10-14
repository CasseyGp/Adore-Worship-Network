import Image from "next/image";
import prayer from "@/assets/photos/prayer-evening.jpeg";
import { about, site } from "@/content/site";

/**
 * prayer-evening.jpeg — a 736×776 derivative of "Prayer Evening.jpeg" with a third-party
 * watermark cropped off the top. Face sits at ~6–35% height, hands to ~62%, just right of centre.
 * Mobile: edge-to-edge 4:5 between the vision statement and the points.
 * Desktop: a framed portrait with an offset amber hairline behind it, opposite the copy.
 */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section overflow-hidden bg-ivory text-ink scheme-light">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-x-20">
        <div className="reveal flex flex-col gap-6 lg:col-start-2 lg:row-start-1">
          <p className="eyebrow flex items-center gap-3 text-teal-deep">
            <span aria-hidden="true" className="h-px w-8 bg-teal-deep/60" />
            The vision
          </p>
          <h2 id="about-title" className="sr-only">
            About Adore Worship Movement
          </h2>
          <p className="display text-[clamp(2rem,7.4vw,3.4rem)] leading-[1.08] text-navy">
            {about.lead} <em className="text-teal-deep">{about.leadEmphasis}</em>
          </p>
        </div>

        <figure className="relative mx-[calc(var(--gutter)*-1)] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mx-0">
          {/* Offset hairline frame — layered depth without competing with the photo. */}
          <div aria-hidden="true" className="absolute inset-0 hidden translate-x-5 translate-y-5 rounded-[2rem] border border-amber-deep/35 lg:block" />
          <div className="photo-reveal relative aspect-[4/5] overflow-hidden bg-navy sm:aspect-[16/11] lg:aspect-[4/5] lg:rounded-[2rem] lg:shadow-soft">
            <Image
              src={prayer}
              alt="A woman in worship, eyes closed and hands clasped beneath her chin, with warm light breaking behind her"
              fill
              placeholder="blur"
              sizes="(min-width: 1216px) 520px, (min-width: 1024px) 42vw, 100vw"
              className="object-cover object-[56%_18%] sm:object-[50%_14%] lg:object-[54%_20%]"
            />
          </div>
          <figcaption className="wrap mt-4 flex items-center gap-3 text-sm text-muted lg:absolute lg:-bottom-5 lg:left-8 lg:mt-0 lg:w-auto lg:rounded-pill lg:bg-ivory-bright lg:px-5 lg:py-2.5 lg:shadow-soft">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-amber-deep" />
            <span className="font-semibold tracking-[0.04em] text-navy">{site.tagline}</span>
          </figcaption>
        </figure>

        <ol className="flex flex-col lg:col-start-2 lg:row-start-2">
          {about.points.map((p, i) => (
            <li key={p.title} className="reveal grid grid-cols-[2.5rem_1fr] gap-4 border-t border-sand-line py-6 last:border-b">
              <span aria-hidden="true" className="display pt-0.5 text-2xl text-amber-deep">
                0{i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold text-navy">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-slate">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
