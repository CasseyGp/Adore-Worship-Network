import type { OutreachArm, RoleOption } from "./types";

/**
 * Member registration & outreach deployment — official content supplied by Adore.
 * The form renders these strings verbatim and the server validates against `value` / `id`.
 */

export const memberFormTitle = "Adore Worship Movement - Member Registration & Outreach Deployment";

export const MAX_OUTREACH_ARMS = 2;
export const MOTIVATION_MAX = 1500;
export const ROLE_OTHER = "other";

export const roleOptions: RoleOption[] = [
  { value: "vocalist", label: "Vocalist" },
  { value: "instrumentalist", label: "Instrumentalist" },
  { value: "music-producer-sound-engineer", label: "Music Producer/Sound Engineer" },
  { value: "media-content-creative", label: "Media/Content Creative" },
  { value: "administrative-operations", label: "Administrative/Operations" },
  { value: "passionate-worshipper", label: "Passionate Worshipper" },
  { value: "intercessor", label: "Intercessor" },
  { value: ROLE_OTHER, label: "Other" },
];

export const outreachIntro =
  "Every member of Adore Worship Movement is invited to actively plug into at least one outreach initiative. Please select the outreach arm(s) you feel led to serve in:";

export const outreachQuestion = "Which Outreach would you like to join? Please select a maximum of two options only.";

export const outreachArms: OutreachArm[] = [
  { id: "house-of-worship", name: "House of Worship", description: "Reaching families and raising worship altars in homes" },
  { id: "adore-teens-movement", name: "Adore Teens Movement", description: "Ministering to and discipling the younger generations" },
  { id: "adore-women-network", name: "Adore Women Network", description: "Empowering and building women in faith and worship" },
  {
    id: "reclaim",
    name: "Reclaim",
    description: "Bringing hope, spiritual restoration, and love to those in correctional institutions and marginalized spaces",
  },
  { id: "adore-campus-movement", name: "Adore Campus Movement", description: "Fanning the flames of worship across tertiary institutions" },
  { id: "davidic-kids", name: "Davidic Kids", description: "Nurturing young children in worship and godly foundation" },
  {
    id: "ymmcn",
    name: "Young Music Ministers and Media Creatives Network YMMCN",
    description: "Equipping mentoring and empowering emerging gospel musicians and media creatives",
  },
];

export const motivationQuestion = "Why do you feel led to serve in your selected outreach arm?";

export const memberConsent = "I agree that Adore Worship Movement may store and use these details to contact me about serving.";
