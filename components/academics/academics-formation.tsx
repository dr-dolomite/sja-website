"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as academics-intro.tsx,
// academics-jhs.tsx, and academics-shs.tsx, so /academics reads as one
// continuous system. Hidden state never touches opacity: content paints at
// full opacity on the first (server-rendered) frame and only slides the
// last 24px into place. Enhancement-Not-Gate — reduced motion and headless
// renders show complete content immediately.
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

export function AcademicsFormation() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Coconut ground, deliberately the calm breath after the dense
           Evergreen SHS panel. This is a short connective beat, not a
           fourth pillar: no image, no registry, just an eyebrow, a serif
           lede, and a short paragraph, so it reads noticeably LIGHTER than
           academics-jhs.tsx and academics-shs.tsx before the CTA lands. */}
        <section
          aria-labelledby="academics-formation-eyebrow"
          className="relative overflow-hidden border-t border-border bg-background text-foreground"
        >
          {/* Soft-geometry anchor: a single thin gold ring, decorative only,
             legal on this light ground per the Gold-as-Detail Rule. Smaller
             and quieter than the rings on the intro/JHS beats to match this
             section's lighter weight. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 size-[18rem] rounded-full border border-secondary/25 sm:size-[22rem]"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto flex w-full max-w-[52rem] flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-4"
          >
            {/* Eyebrow-kicker: Palm on Coconut, matching the intro/JHS
               pattern; gold stays decorative linework only on this light
               ground, never text. */}
            <m.p
              id="academics-formation-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              How Guardians Are Formed
            </m.p>

            {/* Serif-as-Display heading, one italic-Palm emphasis word. */}
            <m.h2
              variants={itemVariants}
              className="mt-5 max-w-[24ch] text-balance font-serif text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1.2] tracking-[-0.005em] text-grove-deep"
            >
              Every subject is taught{" "}
              <em className="font-medium italic text-primary">alongside</em>{" "}
              character.
            </m.h2>

            {/* Body: exact formation facts, short and connective. */}
            <m.p
              variants={itemVariants}
              className="mt-6 max-w-[56ch] text-pretty text-lg leading-[1.7] text-muted-foreground"
            >
              The curriculum is enriched by SJA&rsquo;s Catholic and
              Josephian formation program, weaving values education,
              faith-based reflection, and community service into everyday
              learning. Classes stay small enough to keep that formation
              personal.
            </m.p>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
