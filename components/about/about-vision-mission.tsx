"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same stagger + transform-only rise contract as vision-mission.tsx and
// core-values.tsx, so this compact restate still reads as part of the same
// entrance system as the homepage. Hidden state never touches opacity: words
// paint at full opacity on the first (server-rendered) frame and only slide
// the last 24px into place. Enhancement-Not-Gate — content is complete before
// Motion ever runs, and reduced-motion / headless renders show everything.
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

export function AboutVisionMission() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Leaf-Tint ground (--muted): this is the compact restate, not the
           homepage's full evergreen showpiece. Deliberately quieter, smaller,
           and light-grounded so it never competes with vision-mission.tsx's
           signature moment. Top hairline echoes core-values.tsx's
           Coconut -> Leaf-Tint handoff convention. */}
        <section
          aria-labelledby="about-vision-mission-eyebrow"
          className="relative overflow-hidden border-t border-border bg-muted text-foreground"
        >
          {/* Soft-geometry anchor: a single thin gold ring, decorative only.
             Gold is ground-keyed: on this light ground it is never text or a
             meaning-bearing dot, just fine linework filling open space.
             Clipped by overflow-hidden so it never widens the viewport. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-28 size-[22rem] rounded-full border border-secondary/25 sm:size-[26rem]"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto w-full max-w-[72rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-4"
          >
            {/* Eyebrow-kicker: differentiated label from the homepage's "Our
               Vision & Mission" so the two moments never read as an exact
               duplicate. On a light ground gold text is off-limits (ground-
               keyed), so the eyebrow uses Palm (--primary), matching the
               light-ground eyebrow convention in core-values.tsx / offerings.tsx
               / life-of-guardians.tsx (4.70:1 on Leaf Tint, AA). */}
            <m.p
              id="about-vision-mission-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              What We Believe
            </m.p>

            <m.p
              variants={itemVariants}
              className="mt-4 max-w-[48ch] text-pretty font-sans text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              These two statements anchor everything that follows.
            </m.p>

            <div className="mt-10 grid grid-cols-1 gap-y-10 sm:mt-12 lg:grid-cols-12 lg:gap-x-12">
              {/* Vision: the serif voice, but sized well below the homepage's
                 clamp so this reads as a restate, not a repeat. */}
              <div className="flex flex-col gap-4 lg:col-span-7">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
                  The Vision
                </p>
                <h2 className="max-w-[22ch] text-balance font-serif text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.005em] text-foreground">
                  A Christ-centered community inspired by the virtues of St.
                  Joseph.
                </h2>
              </div>

              {/* Mission: Hanken Grotesk, matching the homepage's voice split
                 (serif for Vision, sans for Mission's body-length prose). */}
              <div className="flex flex-col gap-4 lg:col-span-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-primary">
                  The Mission
                </p>
                <p className="max-w-[46ch] text-pretty font-sans text-[15px] leading-[1.7] text-muted-foreground sm:text-base">
                  St. Joseph&rsquo;s Academy of Malinao, Aklan, Inc. forms
                  integral human persons by developing competent learners,
                  nurturing excellence in their chosen fields, and guiding
                  them to become faithful servants of the Church and
                  responsible members of society.
                </p>
              </div>
            </div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
