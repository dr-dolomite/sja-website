"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as vision-mission.tsx and
// core-values.tsx, so this page's opening beat reads as part of the same
// system as the homepage. Hidden state never touches opacity: content paints
// at full opacity on the first (server-rendered) frame and only slides the
// last 24px into place. Enhancement-Not-Gate — the section's meaning is
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

export function AboutIntro() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Coconut ground (bg-background): the page opens calm and editorial,
           no hero photo, no evergreen mass yet. The first Committed-Green
           anchor arrives later at the Seal section, so this beat stays light
           and lets the reader settle into the story before the green lands. */}
        <section
          aria-labelledby="about-intro-eyebrow"
          className="relative overflow-hidden bg-background text-foreground"
        >
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto w-full max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-4"
          >
            {/* Eyebrow-kicker. On this light ground gold may not be text, so
               the kicker is Palm (--primary), matching core-values.tsx's
               light-ground idiom (4.70:1+ on Coconut/Leaf-Tint, AA). */}
            <m.p
              id="about-intro-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              About the Academy
            </m.p>

            {/* Serif-as-Display: Instrument Serif (weight 400) carries the
               page's opening statement. This is the one h1 on /about; every
               section below drops to h2. */}
            <m.h1
              variants={itemVariants}
              className="mt-5 max-w-[22ch] text-balance font-serif text-[clamp(2.5rem,5.4vw,4rem)] leading-[1.06] tracking-[-0.005em] text-grove-deep"
            >
              A Catholic school in Malinao, forming Guardians since 1948.
            </m.h1>

            {/* Lede: Hanken Grotesk body voice, a readable measure. */}
            <m.p
              variants={itemVariants}
              className="mt-8 max-w-[58ch] text-pretty text-lg leading-[1.7] text-muted-foreground sm:text-xl"
            >
              For over seventy years, St. Joseph&rsquo;s Academy has raised
              young people of faith and purpose in the heart of Malinao,
              Aklan. This is our story, our seal, and the beliefs that shape
              every Guardian who passes through our doors.
            </m.p>

            {/* Motto: an Italic-Palm serif accent, legal on this light
               ground as emotional emphasis inside the intro, not a heading. */}
            <m.p
              variants={itemVariants}
              className="mt-10 font-serif text-2xl italic leading-[1.3] text-primary sm:text-3xl"
            >
              &ldquo;Be like St. Joseph.&rdquo;
            </m.p>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
