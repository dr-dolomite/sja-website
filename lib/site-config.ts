// Single source of truth for the school's public-facing identity and contact
// facts. The footer (and any future contact page) reads from here so there is
// one place to keep these correct.
//
// ─────────────────────────────────────────────────────────────────────────
//  PLACEHOLDERS: every field tagged `PLACEHOLDER` below is not yet the real
//  detail. Replace them with the school's actual information before this footer
//  ships. The layout is built and testable against these stand-ins; the copy is
//  not shippable until the TODOs are resolved.
// ─────────────────────────────────────────────────────────────────────────

export type NavLink = { href: string; label: string };
export type SocialLink = { key: string; label: string; href: string };
export type OfficeHours = { days: string; hours: string };

export const siteConfig = {
  name: "St. Joseph's Academy of Malinao, Inc.",
  shortName: "St. Joseph's Academy",
  foundedYear: 1947,
  // The community-facing one-liner. Faith-rooted, place-specific, Guardians.
  tagline:
    "A Catholic school in Malinao, Aklan, forming Guardians in faith and character since 1947.",

  address: {
    // Malinao, Aklan's postal code (5606) is public and accurate; the street /
    // barangay line is the PLACEHOLDER to confirm.
    lines: [
      "PLACEHOLDER: Street / Purok, Barangay", // TODO: real street + barangay
      "Malinao, Aklan 5606",
      "Philippines",
    ],
    // Google Maps "search" deep link — resolves by name with no API key or pin
    // coordinates. Swap for the exact place URL once the pin is confirmed.
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=St.%20Joseph%27s%20Academy%20of%20Malinao%2C%20Aklan",
  },

  phone: {
    display: "PLACEHOLDER: (036) 000 0000", // TODO: real landline / mobile
    href: "tel:+63360000000", // TODO: match the real number
  },

  email: {
    display: "PLACEHOLDER: hello@sjamalinao.edu.ph", // TODO: real inbox
    href: "mailto:hello@sjamalinao.edu.ph", // TODO: match the real address
  },

  officeHours: [
    { days: "Monday to Friday", hours: "PLACEHOLDER: 7:30 AM to 4:30 PM" }, // TODO
    { days: "Saturday", hours: "PLACEHOLDER: 8:00 AM to 12:00 NN" }, // TODO
  ] satisfies OfficeHours[],

  socials: [
    // Most PH schools lead with a Facebook page. Add Instagram / YouTube here
    // if the school maintains them.
    {
      key: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/SJAOfficialPage",
    },
  ] satisfies SocialLink[],
} as const;

// Primary destinations, mirrored from the site header plus the two conversion
// paths the homepage repeatedly points to.
export const FOOTER_NAV: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/guardian-life", label: "Guardian Life" },
  { href: "/news", label: "News" },
  { href: "/admissions", label: "Admissions" },
  { href: "/contact", label: "Contact" },
];
