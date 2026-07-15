"use client";

import Link from "next/link";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

import { Button } from "@/components/ui/button";

// Same stagger + transform-only rise contract as vision-mission.tsx (and the
// rest of the homepage), so this closing section reads as one system with
// everything above it. Hidden state never touches opacity: content paints at
// full opacity on the first frame and only slides the last 24px into place
// (Enhancement-Not-Gate).
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

export function AboutCta() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Light closing beat (Coconut), NOT an evergreen band: the page
           already spends its Committed-Green mass on the Seal and the
           Philosophy & Goals bands, and the site footer directly below is
           full-bleed evergreen. Keeping this CTA light gives a breather
           between the evergreen Philosophy band above and the evergreen
           footer below, so the tail of the page still alternates
           (green -> light -> green) instead of stacking three green blocks. */}
        <section
          aria-labelledby="about-cta-eyebrow"
          className="relative overflow-hidden bg-background text-foreground"
        >
          {/* Thin gold ring, soft-geometry anchor, clipped by overflow-hidden
             so it never widens the viewport. Fine gold linework is legal on
             this light ground because it is decorative, never meaning-bearing. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-secondary/25 sm:size-80"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto flex w-full max-w-[88rem] flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-24 lg:items-center lg:text-center"
          >
            {/* Eyebrow-kicker. Gold is ground-keyed: on this light ground the
               kicker is Palm (--primary), not gold text. */}
            <m.p
              id="about-cta-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              Come and See
            </m.p>

            {/* Serif-as-Display: Instrument Serif carries the headline. */}
            <m.h2
              variants={itemVariants}
              className="max-w-[24ch] text-balance font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] tracking-[-0.005em] text-grove-deep"
            >
              Visit St. Joseph&rsquo;s Academy.
            </m.h2>

            <m.p
              variants={itemVariants}
              className="max-w-[52ch] text-pretty font-sans text-base leading-[1.7] text-muted-foreground sm:text-lg"
            >
              The best way to know a school is to walk its grounds. Reach out
              and we will welcome you.
            </m.p>

            <m.div
              variants={itemVariants}
              className="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:justify-center"
            >
              {/* The single CTA. On a light ground the primary action is the
                 Palm (--primary) button, matching the header Contact button;
                 a gold fill would be off-limits here (gold fills are
                 evergreen-only). Matches the shadcn Button usage pattern in
                 site-header.tsx: render prop + nativeButton false. */}
              <Button
                render={<Link href="/contact" />}
                nativeButton={false}
                className="h-12 bg-primary px-7 text-base text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring"
              >
                Contact us
              </Button>

              {/* Secondary link stays a plain text link, never a second
                 button, so the single-CTA emphasis holds. */}
              <Link
                href="/#admissions"
                className="inline-flex h-12 items-center rounded-md text-base font-medium text-foreground underline underline-offset-4 decoration-foreground/30 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
              >
                Admissions
              </Link>
            </m.div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
