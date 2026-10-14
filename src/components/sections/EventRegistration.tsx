import { event } from "@/content/site";
import { EventRegistrationForm } from "@/components/forms/EventRegistrationForm";
import { Countdown } from "@/components/ui/Countdown";
import { SectionIntro } from "@/components/ui/SectionIntro";

export function EventRegistration() {
  return (
    <section id="register" aria-labelledby="register-title" className="section relative overflow-hidden bg-midnight">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgb(18_48_122/0.7),transparent_60%),radial-gradient(ellipse_at_top_right,rgb(240_184_92/0.08),transparent_50%)]" />

      <div className="wrap relative grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-20">
        <div className="flex flex-col gap-10">
          <SectionIntro
            id="register-title"
            eyebrow="The invitation"
            title={
              <>
                An evening,
                <br />
                <em className="text-amber-soft">set apart.</em>
              </>
            }
          />

          {/* Date plaque */}
          <div className="reveal flex items-stretch gap-6">
            <time dateTime={event.startsAt} className="flex flex-col items-center justify-center rounded-card border border-amber/40 px-6 py-5 text-center">
              <span className="display text-[4.5rem] leading-[0.85] text-amber">{event.day}</span>
              <span className="eyebrow mt-2 text-[0.66rem] text-amber-soft">{event.weekday}</span>
            </time>
            <div className="flex flex-col justify-center gap-1">
              <p className="display text-3xl text-ivory-bright">{event.monthYear}</p>
              <p className="text-lg font-semibold text-cyan">{event.timeLabel}</p>
              {event.venue ? <p className="text-[0.95rem] text-mist">{event.venue}</p> : null}
            </div>
          </div>

          <div className="reveal flex flex-col gap-3">
            <p className="text-[0.85rem] text-mist-dim">
              Counting down to {event.dateLabel}, {event.timeLabel} (West Africa Time)
            </p>
            <Countdown />
          </div>

          <dl className="reveal grid gap-6 border-t border-ivory/10 pt-8 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-mist-dim">Venue</dt>
              <dd className="mt-2 leading-relaxed text-mist">
                {event.venue ?? "To be announced. Registered guests will receive details by email once confirmed."}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-mist-dim">Programme</dt>
              <dd className="mt-2 leading-relaxed text-mist">The order of the evening will be published once sessions are confirmed.</dd>
            </div>
          </dl>
        </div>

        <div className="reveal rounded-[1.75rem] bg-ivory-bright p-6 text-ink shadow-lift scheme-light sm:p-9 lg:self-start">
          <EventRegistrationForm />
        </div>
      </div>
    </section>
  );
}
