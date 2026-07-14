"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as hero.tsx and
// vision-mission.tsx, so every entrance across the homepage reads as one
// system. Hidden state never touches opacity: the words paint at full opacity
// on the first (server-rendered) frame and only slide the last 24px into
// place. Enhancement-Not-Gate — the section's meaning is legible before Motion
// ever runs, and reduced-motion / headless renders show complete content.
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

// The three core values spell S-J-A = St. Joseph's Academy, the section's hook.
// `line` is PLACEHOLDER copy: brand-voiced drafts standing in until the school
// provides the official wording per value (tracked with the footer-contact
// placeholders — a launch blocker). The value WORD and its acrostic are final.
const VALUES = [
  {
    word: "Selfless",
    line: "Formed to give before taking, in quiet service to God and neighbor.",
  },
  {
    word: "Just",
    line: "Fair in judgment, honest in action, faithful to what is right.",
  },
  {
    word: "Achiever",
    line: "Striving for excellence in every calling, from the classroom outward.",
  },
] as const;

export function CoreValues() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Leaf-Tint ground (--muted, #EDF3ED): the soft green break between the
           Hero's Coconut above and the dark Evergreen Vision & Mission band
           below, keeping the Coconut -> Leaf-Tint -> Evergreen alternation the
           Committed Green Rule asks for. The TOP hairline (evergreen 0.11-alpha
           border token) makes the Coconut -> Leaf-Tint handoff from the Hero a
           crisp line rather than a wash that vanishes on a low-DPI phone; no
           bottom border is needed, since V&M's big rounded evergreen top is the
           signature separator below. overflow-hidden clips the gold ring. */}
        <section
          aria-labelledby="core-values-heading"
          className="relative overflow-hidden border-t border-border bg-muted text-foreground"
        >
          {/* Soft-geometry anchor: a single thin gold ring curving in from the
             upper-right, filling the open space beside the heading (and clear of
             V&M's rising green top below). Fine gold linework on a light ground
             is legal and decorative only (never text, never meaning-bearing
             here); clipped by overflow-hidden so it never widens the viewport. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 -right-40 size-[28rem] rounded-full border border-secondary/25 sm:size-[34rem]"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto w-full max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-4"
          >
            {/* Eyebrow-kicker. On this light ground gold may not be text, so the
               kicker is Palm (--primary, 4.70:1 on Leaf Tint, AA). */}
            <m.p
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              Our Core Values
            </m.p>

            {/* Serif-as-Display: Instrument Serif (weight 400 only) in Evergreen
               carries the heading. Periods, not a mid dot, separate the three
               words per the house copy rule. */}
            <m.h2
              id="core-values-heading"
              variants={itemVariants}
              className="mt-5 max-w-[16ch] text-balance font-serif text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.06] tracking-[-0.005em] text-grove-deep"
            >
              Selfless. Just. Achiever.
            </m.h2>

            {/* Acrostic reveal — the explicit hook. Hanken Grotesk body voice;
               "St. Joseph's Academy" carries Palm emphasis (italic + medium),
               a legal light-ground emphasis (5.06:1 on Coconut, 4.70:1 here). */}
            <m.p
              variants={itemVariants}
              className="mt-5 max-w-[46ch] text-pretty text-lg leading-[1.6] text-muted-foreground"
            >
              Their initials spell the name every Guardian carries:{" "}
              <em className="font-medium italic text-primary">
                St. Joseph&rsquo;s Academy
              </em>
              .
            </m.p>

            {/* The trio. On desktop the three enlarged serif initials read
               S / J / A across the row; stacked on mobile they read S / J / A
               top to bottom — either way the acrostic survives, and the subline
               states it outright. Nested container variants so the columns
               stagger in after the heading block. */}
            <m.div
              variants={containerVariants}
              className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 sm:mt-16 sm:grid-cols-3"
            >
              {VALUES.map(({ word, line }) => (
                <m.div key={word} variants={itemVariants}>
                  {/* The value word set in Instrument Serif, Evergreen, with its
                     first letter enlarged via ::first-letter (first-letter:*).
                     The DOM text stays the whole word, so assistive tech reads
                     "Selfless", never "S elfless". Above the 24px serif floor. */}
                  <p className="font-serif text-[clamp(1.75rem,2.6vw,2.25rem)] leading-none text-grove-deep first-letter:text-[1.5em] first-letter:leading-none">
                    {word}
                  </p>
                  {/* Gold-as-Detail: a short gold hairline, fine linework only,
                     legal on a light ground because it carries no meaning. */}
                  <span
                    aria-hidden="true"
                    className="mt-5 block h-px w-10 bg-secondary"
                  />
                  <p className="mt-5 max-w-[34ch] text-pretty text-base leading-[1.6] text-muted-foreground">
                    {line}
                  </p>
                </m.div>
              ))}
            </m.div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
