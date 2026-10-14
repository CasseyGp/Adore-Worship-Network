export interface NavItem {
  label: string;
  href: `#${string}`;
}

export interface EventDetails {
  name: string;
  presentedBy: string;
  partner: string;
  /** ISO 8601 with offset — West Africa Time */
  startsAt: string;
  /** IANA zone the event is held in */
  timeZone: string;
  dateLabel: string;
  weekday: string;
  day: string;
  monthYear: string;
  timeLabel: string;
  /** null until the organisers confirm a venue */
  venue: string | null;
}

export interface Pillar {
  numeral: string;
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  link?: { href: string; label: string };
}

export interface OutreachArm {
  id: string;
  name: string;
  description: string;
}

export interface RoleOption {
  value: string;
  label: string;
}
