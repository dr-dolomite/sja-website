"use client";

import Image from "next/image";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same stagger + transform-only rise contract as vision-mission.tsx, so the
// second evergreen mass on /about reads as one system with the homepage.
// Hidden state never touches opacity (Enhancement-Not-Gate Rule): content is
// legible at full opacity on the first frame, only sliding the last 24px.
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

const SYMBOLS = [
  {
    name: "The Sacred Host",
    meaning:
      "Its rays declare the school's dedication to the propagation of Catholic education.",
  },
  {
    name: "The Book",
    meaning: "The pursuit of knowledge and truth.",
  },
  {
    name: "The Laurel",
    meaning:
      "Prosperity, and the belief that education is the path to a better life.",
  },
  {
    name: "The Cord",
    meaning: "Binds these symbols into one Josephian identity.",
  },
] as const;

export function AboutSeal() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* The Committed Green Rule: the page's second full-bleed Evergreen
           mass. The big rounded top lifts it off the light section above
           (Our Story ends on Coconut/Leaf-Tint), reading as a lifted panel
           settling onto the page rather than a hard color-block seam. */}
        <section
          aria-labelledby="about-seal-eyebrow"
          className="relative overflow-hidden rounded-t-[40px] bg-grove-deep text-grove-foreground sm:rounded-t-[56px]"
        >
          {/* Barely-there gold glow, upper-left this time (mirrors
             vision-mission's upper-right glow), atmospheric per the
             Soft-Geometry Rule. Decorative only. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(60% 55% at 10% 0%, color-mix(in oklch, var(--secondary), transparent 92%), transparent 70%)",
            }}
          />
          {/* Soft-geometry anchor in the open lower-right quadrant: a single
             thin gold ring with one small gold dot on its arc. Fine gold
             linework on evergreen is legal and decorative only. Clipped by
             overflow-hidden so it never widens the viewport. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-32 size-[26rem] rounded-full border border-secondary/25 sm:size-[30rem]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[6.5rem] right-[6.5rem] hidden size-2 rounded-full bg-secondary/70 lg:block"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto w-full max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-4"
          >
            {/* Eyebrow-kicker: gold text is legal here, on evergreen only.
               Piña Gold on Evergreen clears ~5.97:1. */}
            <m.p
              id="about-seal-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary"
            >
              The Josephian Seal
            </m.p>

            <div className="mt-10 grid grid-cols-1 gap-y-14 sm:mt-14 lg:grid-cols-12 lg:items-start lg:gap-x-16">
              {/* Crest column: the page's purest Gold-as-Detail moment. A
                 thin gold ring frames the seal, fine linework only, never a
                 fill. Square asset, so a square frame with generous internal
                 padding lets the crest breathe rather than crowding the ring. */}
              <div className="flex justify-center lg:col-span-4 lg:justify-start">
                <m.div
                  variants={itemVariants}
                  className="relative flex size-56 items-center justify-center rounded-full border border-secondary/60 p-6 sm:size-64"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-2 rounded-full border border-secondary/25"
                  />
                  <Image
                    src="/sja-school-logo.png"
                    alt="The St. Joseph's Academy seal"
                    width={500}
                    height={500}
                    className="relative h-auto w-full max-w-[13rem]"
                  />
                </m.div>
              </div>

              <div className="flex flex-col gap-10 lg:col-span-8">
                {/* Serif-as-Display: Instrument Serif carries the headline,
                   weight 400 only, size well above the ~24px floor. */}
                <m.h2
                  variants={itemVariants}
                  className="max-w-[24ch] text-balance font-serif text-[clamp(2.25rem,4.8vw,3.5rem)] leading-[1.08] tracking-[-0.005em] text-grove-foreground"
                >
                  One seal, four symbols, a single identity.
                </m.h2>

                {/* The four symbols as a two-column editorial list on wider
                   screens, one column on mobile. Gold hairline + gold name
                   text (legal here), gloss set in the light-on-evergreen
                   sans that clears AA with wide margin. */}
                <m.dl
                  variants={itemVariants}
                  className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2"
                >
                  {SYMBOLS.map((symbol) => (
                    <div key={symbol.name} className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="h-px w-8 bg-secondary"
                        />
                        <dt className="font-serif text-2xl leading-tight text-secondary">
                          {symbol.name}
                        </dt>
                      </div>
                      <dd className="max-w-[36ch] text-pretty font-sans text-base leading-[1.7] text-grove-foreground/90">
                        {symbol.meaning}
                      </dd>
                    </div>
                  ))}
                </m.dl>
              </div>
            </div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
