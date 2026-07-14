"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same stagger + transform-only rise contract as hero.tsx and
// guardian-story.tsx, so every entrance across the homepage reads as one
// system. Hidden state never touches opacity: the words paint at full opacity
// on the first (server-rendered) frame and only slide the last 24px into
// place. This is the Enhancement-Not-Gate Rule, the section's meaning is
// legible before Motion ever runs, and reduced-motion / headless renders show
// complete content.
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

export function VisionMission() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* The Committed Green Rule at its fullest: the school's soul earns a
           full-bleed Evergreen structural band. The big rounded top lifts it
           off the Coconut canvas above (guardian-story ends on coconut), so it
           reads as a lifted panel settling onto the page rather than a hard
           color-block seam. */}
        <section
          aria-labelledby="vision-mission-eyebrow"
          className="relative overflow-hidden rounded-t-[40px] bg-grove-deep text-grove-foreground sm:rounded-t-[56px]"
        >
          {/* Barely-there gold glow, top-right, ~8% of Piña Gold. Atmospheric
             per the Soft-Geometry Rule, never a loud gradient. Decorative. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(65% 55% at 88% 4%, color-mix(in oklch, var(--secondary), transparent 92%), transparent 70%)",
            }}
          />
          {/* Soft-geometry anchor for the open lower-left quadrant: a single
             thin gold ring curving in from the corner, with one small gold dot
             sitting on its arc. Fine gold linework on an evergreen ground is
             legal and decorative only (never meaning-bearing); clipped by the
             section's overflow-hidden so it never widens the viewport. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-32 size-[26rem] rounded-full border border-secondary/25 sm:size-[30rem]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[6.5rem] left-[6.5rem] hidden size-2 rounded-full bg-secondary/70 lg:block"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto w-full max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-4"
          >
            {/* Eyebrow-kicker: the one place gold reads as text. Piña Gold on
               Evergreen clears 5.97:1 (the contrast law's single passing gold
               pairing). */}
            <m.p
              id="vision-mission-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary"
            >
              Our Vision &amp; Mission
            </m.p>

            <div className="mt-10 grid grid-cols-1 gap-y-14 sm:mt-14 lg:grid-cols-12 lg:gap-x-16">
              {/* Vision leads: the section's serif peak, wide, on the left. */}
              <div className="flex flex-col gap-5 lg:col-span-8">
                <div className="flex items-center gap-3">
                  {/* Gold-as-Detail: a thin gold hairline marks each statement.
                     Fine linework only, never a fill. */}
                  <span aria-hidden="true" className="h-px w-8 bg-secondary" />
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-grove-foreground/80">
                    The Vision
                  </p>
                </div>
                {/* Serif-as-Display: Instrument Serif (weight 400 only) carries
                   the institution's defining statement, like a pull-quote. No
                   font-bold, the serif has none; size and relaxed tracking do
                   the work. text-balance keeps the wrap even. */}
                <h2 className="max-w-[20ch] text-balance font-serif text-[clamp(2.25rem,4.8vw,3.5rem)] leading-[1.08] tracking-[-0.005em] text-grove-foreground">
                  A Christ-centered community inspired by the virtues of St.
                  Joseph.
                </h2>
              </div>

              {/* Faint hairline divider, full width, to lead the eye from the
                 Vision down into the supporting Mission. Light-on-evergreen at
                 low alpha, decorative only. */}
              <div
                aria-hidden="true"
                className="hidden h-px w-full bg-grove-foreground/12 lg:col-span-12 lg:block"
              />

              {/* Mission supports: right-offset, narrower, smaller serif. The
                 asymmetric column start sets it a step below the Vision in the
                 hierarchy the reader chose. */}
              <div className="flex flex-col gap-5 lg:col-span-7 lg:col-start-6">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-secondary" />
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-grove-foreground/80">
                    The Mission
                  </p>
                </div>
                {/* Set in Hanken Grotesk, not Instrument Serif: the Mission is
                   body-length prose, and DESIGN.md §7 says text-dense content
                   leans on the sans so thin serif hairlines don't erode on the
                   low-DPI phones this school's families read on. The Vision
                   keeps the serif display voice; the two statements now differ
                   in voice as they already differ in scale. Light text at /90
                   clears AA on evergreen with wide margin (8.87:1). */}
                <h3 className="max-w-[52ch] text-pretty font-sans text-lg font-normal leading-[1.7] text-grove-foreground/90 sm:text-xl">
                  St. Joseph&rsquo;s Academy of Malinao, Aklan, Inc. forms
                  integral human persons by developing competent learners,
                  nurturing excellence in their chosen fields, and guiding them
                  to become faithful servants of the Church and responsible
                  members of society.
                </h3>
              </div>
            </div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
