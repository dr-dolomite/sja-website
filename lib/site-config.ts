// Single source of truth for the school's public-facing identity and contact
// facts. The footer and the /contact page both read from here so there is one
// place to keep these correct. Address, office hours, phone, and email are
// all the school's real, confirmed details.
//
// Email is two confirmed edu.ph domain inboxes, not the old shared Gmail:
// general@ for everyday questions, registrar@ for admissions inquiries.

export type NavLink = { href: string; label: string };
export type SocialLink = { key: string; label: string; href: string };
export type OfficeHours = {
  days: string;
  periods: { label: string; hours: string }[];
};

export const siteConfig = {
  name: "St. Joseph's Academy of Malinao, Inc.",
  shortName: "St. Joseph's Academy",
  foundedYear: 1947,
  // The community-facing one-liner. Faith-rooted, place-specific, Guardians.
  tagline:
    "A Catholic school in Malinao, Aklan, forming Guardians in faith and character since 1947.",

  address: {
    lines: ["Sto. Rosario St., Poblacion", "Malinao, Aklan 5606", "Philippines"],
    // Confirmed Google Maps short link for the campus pin.
    mapsUrl: "https://maps.app.goo.gl/1FmhsNUA3oTLxRG58",
    // No-API-key Google Maps "q=" embed built from the real street address,
    // for the Contact page's iframe.
    mapEmbedSrc:
      "https://www.google.com/maps?q=Sto.+Rosario+St.%2C+Poblacion%2C+Malinao%2C+Aklan%2C+Philippines+5606&output=embed",
  },

  phone: {
    display: "(036) 272-7382",
    href: "tel:+63362727382",
  },

  email: {
    general: {
      label: "General inquiries",
      display: "info@sjamalinao.edu.ph",
      href: "mailto:info@sjamalinao.edu.ph",
    },
    admissions: {
      label: "Admissions",
      display: "registrar@sjamalinao.edu.ph",
      href: "mailto:registrar@sjamalinao.edu.ph",
    },
  },

  officeHours: [
    {
      days: "Monday to Friday",
      periods: [
        { label: "Morning", hours: "7:30 AM to 11:20 AM" },
        { label: "Afternoon", hours: "12:20 PM to 4:00 PM" },
      ],
    },
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
