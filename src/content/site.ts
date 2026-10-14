import type { EventDetails, FaqItem, NavItem, Pillar } from "./types";

export const site = {
  name: "Adore Worship Movement",
  shortName: "Adore",
  tagline: "Empower, Elevate, Transform",
  description:
    "A global family of worshipers, creatives, and kingdom stewards, ushering people into intimate, transformative worship.",
  /** Supplied by Adore as the team inbox (also the server-side submissions recipient). */
  contactEmail: "adoreglobalnetwork@gmail.com" as string | null,
  paymentSupportEmail: null as string | null,
  socials: [] as { label: string; href: string }[],
};

export const event: EventDetails = {
  name: "Worship Therapy",
  presentedBy: "Adore Worship Movement",
  partner: "Theragist",
  startsAt: "2026-10-23T17:00:00+01:00",
  timeZone: "Africa/Lagos",
  dateLabel: "Friday, October 23, 2026",
  weekday: "Friday",
  day: "23",
  monthYear: "October 2026",
  timeLabel: "5:00 PM",
  venue: "Solace Homes, Guzape",
};

export const nav: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "The Experience", href: "#experience" },
  { label: "Theragist", href: "#partnership" },
  { label: "Support", href: "#support" },
  { label: "FAQ", href: "#faq" },
  { label: "Serve", href: "#serve" },
];

export const about = {
  lead: "For close to a decade, Adore has carried one hunger: to usher people into intimate, transformative worship —",
  leadEmphasis: "patterned after the way worship is done in Heaven.",
  points: [
    {
      title: "Who we are",
      body: "A family of worshipers, creatives, and kingdom stewards — a global vision received from God and birthed by the Holy Spirit.",
    },
    {
      title: "What we carry",
      body: "A mandate to raise a Davidic people and awaken nations, with every member an active participant in ministry and service.",
    },
    {
      title: "Why this evening",
      body: "Worship Therapy carries that same hunger into a quieter room — space to slow down, reflect, and be cared for.",
    },
  ],
};

export const pillars: Pillar[] = [
  {
    numeral: "I",
    title: "Deep worship",
    body: "An atmosphere of intimate worship and music — reflection and spiritual connection, unhurried.",
  },
  {
    numeral: "II",
    title: "Reflection & renewal",
    body: "Space to pause, to be honest with yourself, and to attend to your emotional well-being.",
  },
  {
    numeral: "III",
    title: "Professional support",
    body: "Supportive therapeutic sessions through Theragist, within the event’s confirmed arrangements.",
  },
];

export const partnership = {
  summary:
    "Theragist connects people with certified and professional therapists. Its involvement brings a professional emotional and mental well-being dimension into an evening of worship.",
  roles: [
    { who: "Adore leads", what: "The worship vision and the spiritual experience." },
    {
      who: "Theragist contributes",
      what: "Professional therapeutic connection and support, within the confirmed scope.",
    },
  ],
  careNote:
    "Worship and professional care complement one another; neither replaces the other. Worship Therapy is not a substitute for therapy, diagnosis, or treatment.",
  crisisNote:
    "If you are in crisis or need urgent help, please contact local emergency services rather than waiting for the event.",
};

export const faqs: FaqItem[] = [
  {
    question: "What is Worship Therapy?",
    answer:
      "An exclusive evening of deep music, healing, renewal, and therapeutic sessions, presented by Adore Worship Movement in collaboration with Theragist.",
  },
  {
    question: "When is the event?",
    answer: "Friday, October 23, 2026, starting at 5:00 PM (West Africa Time). The full programme will be shared once confirmed.",
  },
  {
    question: "Where is the event?",
    answer: "Solace Homes, Guzape.",
  },
  {
    question: "How do I reserve my place?",
    answer: "Complete the “Reserve your place” form on this page with your name, email address and phone number.",
    link: { href: "#register", label: "Go to event registration" },
  },
  {
    question: "Is giving compulsory?",
    answer:
      "No. Giving is entirely voluntary and separate from event registration — you can reserve your place and attend without giving.",
  },
  {
    question: "How can I contact the team?",
    answer: "Email the Adore Worship Movement team at adoreglobalnetwork@gmail.com.",
    link: { href: "mailto:adoreglobalnetwork@gmail.com", label: "Send an email" },
  },
  {
    question: "How does the Theragist partnership work?",
    answer:
      "Adore Worship Movement leads the worship vision and spiritual experience. Theragist, which connects people with certified and professional therapists, contributes professional therapeutic connection and support within the event’s confirmed scope.",
  },
  {
    question: "Do I need to join an outreach to attend?",
    answer:
      "No. Member registration and outreach deployment is a separate form for those who feel called to serve with Adore. You don’t need it to attend Worship Therapy.",
  },
];
