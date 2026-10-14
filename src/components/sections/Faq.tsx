import { faqs } from "@/content/site";
import { SectionIntro } from "@/components/ui/SectionIntro";

/** Native <details> accordion — keyboard and screen-reader friendly with zero JS. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section bg-ivory text-ink scheme-light">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[22rem_1fr] lg:gap-20">
        <SectionIntro
          id="faq-title"
          tone="light"
          eyebrow="FAQ"
          title={
            <>
              Questions <em className="text-teal-deep">before you come</em>
            </>
          }
        />

        <div className="flex flex-col">
          {faqs.map((f, i) => (
            <details key={f.question} name="faq" open={i === 0} className="group border-t border-sand-line last:border-b">
              <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[1.05rem] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {f.question}
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sand text-navy transition-[transform,background-color,color] duration-(--duration-settle) ease-flow group-open:rotate-45 group-open:bg-navy group-open:text-ivory"
                >
                  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </summary>
              <div className="max-w-2xl pb-6 pr-4 leading-relaxed text-slate sm:pr-12">
                <p>{f.answer}</p>
                {f.link ? (
                  <a
                    href={f.link.href}
                    className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-teal-deep underline decoration-teal-deep/30 underline-offset-4 hover:decoration-teal-deep"
                  >
                    {f.link.label}
                    <span aria-hidden="true">→</span>
                  </a>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
