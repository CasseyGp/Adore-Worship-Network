import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Partnership } from "@/components/sections/Partnership";
import { EventRegistration } from "@/components/sections/EventRegistration";
import { Serve } from "@/components/sections/Serve";
import { Support } from "@/components/sections/Support";
import { Faq } from "@/components/sections/Faq";
import { event, site } from "@/content/site";

/** schema.org Event — venue intentionally omitted until confirmed. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: event.name,
  startDate: event.startsAt,
  eventStatus: "https://schema.org/EventScheduled",
  organizer: { "@type": "Organization", name: site.name },
  ...(event.venue ? { location: { "@type": "Place", name: event.venue, address: event.venue } } : {}),
  description: "An intimate evening of deep music, worship, reflection, and professional therapeutic support.",
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Experience />
        <Partnership />
        <EventRegistration />
        <Support />
        <Faq />
        <Serve />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
