// Accreditation / affiliation marks for St. Joseph's Academy. Shared by the
// hero trust-bar and the footer accreditation strip so the two never drift out
// of sync. DepEd + PEAC are wide official wordmarks; the Diocese, CEAP, and ESC
// marks are square emblems. `width`/`height` carry each logo's true pixel ratio
// so `w-auto` sizes the width with no distortion. `emblem: true` marks the
// square seals, which render a step larger with tighter padding (optical sizing
// so the detailed crests don't read as undersized next to the wordmarks).
export type AffiliationMark = {
  key: string;
  label: string;
  image: string;
  width: number;
  height: number;
  emblem: boolean;
};

export const AFFILIATION_MARKS: readonly AffiliationMark[] = [
  {
    key: "diocese",
    label: "Diocese of Kalibo",
    image: "/images/diocese-of-kalibo-coat-of-arms.webp",
    width: 512,
    height: 512,
    emblem: true,
  },
  {
    key: "deped",
    label: "Department of Education",
    image: "/images/affiliations/deped.png",
    width: 500,
    height: 256,
    emblem: false,
  },
  {
    key: "ceap",
    label: "Catholic Educational Association of the Philippines",
    image: "/images/affiliations/ceap.png",
    width: 800,
    height: 800,
    emblem: true,
  },
  {
    key: "peac",
    label: "Private Education Assistance Committee",
    image: "/images/affiliations/peac.png",
    width: 500,
    height: 154,
    emblem: false,
  },
  {
    key: "esc",
    label: "Education Service Contracting",
    image: "/images/affiliations/esc-logo.png",
    width: 900,
    height: 902,
    emblem: true,
  },
] as const;
