"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same stagger + transform-only rise contract as vision-mission.tsx and
// about-vision-mission.tsx, so this second evergreen mass still reads as part
// of the same entrance system as the rest of the page. Hidden state never
// touches opacity: content paints at full opacity on the first
// (server-rendered) frame and only slides the last 24px into place.
// Enhancement-Not-Gate — content is complete before Motion ever runs, and
// reduced-motion / headless renders show everything.
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 24 },
  show: {
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// Titles are VERBATIM from VMGO.md; glosses are drafted one-liners pending
// school sign-off (see project memory: offerings/goal glosses placeholder).
const GOALS = [
  {
    n: "01",
    title: "Faith Formation and Christian Witnessing",
    gloss:
      "Authentic Christian witnessing and Christ-centered formation rooted in Gospel values.",
  },
  {
    n: "02",
    title: "Foundational Mastery and Academic Excellence (K–10 & SHS)",
    gloss:
      "Mastery of core literacy and numeracy, and Senior High readiness for college, work, or enterprise.",
  },
  {
    n: "03",
    title: "Talent and 21st Century Skills Development",
    gloss:
      "Developing each learner's giftedness and 21st-century skills through inclusive, differentiated programs.",
  },
  {
    n: "04",
    title: "Human Resource Excellence and Well-being",
    gloss:
      "A qualified, mission-driven workforce supported by continuous development and genuine well-being.",
  },
  {
    n: "05",
    title: "Institutional Compliance and Quality Assurance",
    gloss:
      "Full DepEd and accreditation compliance through data-driven, continuous improvement.",
  },
  {
    n: "06",
    title: "Ecclesial and Community Engagement",
    gloss:
      "Active partnership with the parish, parents, alumni, LGU, and the wider community.",
  },
] as const;

export function AboutPhilosophyGoals() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* The Committed Green Rule's second evergreen mass on this page (the
           first is about-seal.tsx). Big rounded top lifts it off the light
           section above, matching the vision-mission.tsx lift convention. */}
        <section
          aria-labelledby="about-philosophy-goals-eyebrow"
          className="relative overflow-hidden rounded-t-[40px] bg-grove-deep text-grove-foreground sm:rounded-t-[56px]"
        >
          {/* Barely-there gold glow, top-left this time (seal's glow sits
             top-right), atmospheric per the Soft-Geometry Rule. Decorative. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(60% 50% at 10% 0%, color-mix(in oklch, var(--secondary), transparent 92%), transparent 70%)",
            }}
          />
          {/* Soft-geometry anchor: a single thin gold ring in the lower-right,
             with one small gold dot on its arc. Fine gold linework on
             evergreen is legal and decorative only. Clipped by
             overflow-hidden so it never widens the viewport. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-28 size-[24rem] rounded-full border border-secondary/25 sm:size-[28rem]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-24 right-24 hidden size-2 rounded-full bg-secondary/70 lg:block"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto w-full max-w-[72rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-4"
          >
            {/* Eyebrow-kicker: gold text is legal here on evergreen. */}
            <m.p
              id="about-philosophy-goals-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary"
            >
              Philosophy &amp; Goals
            </m.p>

            {/* Philosophy + Institutional Goal, framed as a cited
               institutional statement at a RESTRAINED, roughly large-body
               scale, deliberately NOT the giant monumentalized serif
               pull-quote vision-mission.tsx uses. A thin gold rule and small
               caption stand in for quote marks, keeping this legible as an
               official statement rather than the page's emotional peak. */}
            <m.div
              variants={itemVariants}
              className="mt-10 max-w-[62ch] border-l-2 border-secondary/50 pl-6 sm:mt-14"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-grove-foreground/60">
                Our Philosophy
              </p>
              {/*
                PLACEHOLDER-PENDING: this is the school's current official
                Philosophy string, reproduced verbatim. It is grammatically
                broken ("...growth and transformational education that is
                Christ-centered formation process...") and is pending a
                corrected version from the school before launch. Do not
                paraphrase or silently fix it; only replace it with a
                school-approved rewrite.
              */}
              <p className="mt-3 text-pretty font-serif text-xl leading-[1.5] text-grove-foreground sm:text-2xl">
                Every learner is capable of growth and transformational
                education that is Christ-centered formation process,
                nurturing the whole learner toward truth, excellence, and
                responsible service to the Church and society.
              </p>

              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-grove-foreground/60">
                Institutional Goal
              </p>
              <p className="mt-3 text-pretty font-sans text-base leading-[1.7] text-grove-foreground/90 sm:text-lg">
                To ensure the effective delivery of Catholic education through
                a coherent, learner-centered, and quality-assured system that
                is responsive to educational reforms, promotes continuous
                improvement, and sustains institutional vitality.
              </p>
            </m.div>

            {/* Six strategic goals as an editorial numbered list, not a grid
               of identical feature-cards (anti-reference). Each row is a thin
               top hairline plus a gold numeral, a serif title, and a sans
               gloss, so the rhythm reads as reading down a list rather than
               scanning matched tiles. */}
            <m.ol
              variants={itemVariants}
              className="mt-16 divide-y divide-grove-foreground/12 border-t border-grove-foreground/12 sm:mt-20"
            >
              {GOALS.map((goal) => (
                <li
                  key={goal.n}
                  className="flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-8 sm:py-8"
                >
                  {/* Gold numeral: legal as text/numeral on an evergreen
                     ground per the Gold-as-Detail Rule. */}
                  <span
                    aria-hidden="true"
                    className="font-serif text-2xl leading-none text-secondary sm:w-16 sm:shrink-0 sm:text-3xl"
                  >
                    {goal.n}
                  </span>
                  <div className="flex flex-col gap-1.5 sm:flex-1">
                    <h3 className="text-balance font-serif text-xl leading-[1.2] text-grove-foreground sm:text-2xl">
                      {goal.title}
                    </h3>
                    <p className="max-w-[58ch] text-pretty font-sans text-sm leading-[1.6] text-grove-foreground/80 sm:text-base">
                      {goal.gloss}
                    </p>
                  </div>
                </li>
              ))}
            </m.ol>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
