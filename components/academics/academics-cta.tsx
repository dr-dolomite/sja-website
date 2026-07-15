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

// Same transform-only rise + stagger contract as academics-intro.tsx,
// academics-jhs.tsx, academics-shs.tsx, and academics-formation.tsx, so this
// closing section reads as one system with everything above it. Hidden state
// never touches opacity: content paints at full opacity on the first
// (server-rendered) frame and only slides the last 24px into place
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

export function AcademicsCta() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Evergreen structural band, the page's SECOND green mass after the
           SHS panel (bg-grove-deep), closing the Committed Green Rule with
           the Coconut Formation beat above acting as the breath between
           them. Same big rounded top as academics-shs.tsx and the homepage
           admissions.tsx so the panel reads as a lifted evergreen slab
           settling onto the page, and it flows directly into the evergreen
           SiteFooter below with no light gap. */}
        <section
          aria-labelledby="academics-cta-eyebrow"
          className="relative overflow-hidden rounded-t-[40px] bg-grove-deep text-grove-foreground sm:rounded-t-[56px]"
        >
          {/* Barely-there gold glow, decorative only, Soft-Geometry. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(55% 60% at 12% 0%, color-mix(in oklch, var(--secondary), transparent 90%), transparent 70%)",
            }}
          />
          {/* Thin gold ring, decorative only, legal on Evergreen. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -bottom-32 size-[26rem] rounded-full border border-secondary/25 sm:size-[32rem]"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto flex w-full max-w-[88rem] flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-24 lg:items-center lg:text-center"
          >
            {/* Eyebrow-kicker: gold is legal as text here since the ground
               is Evergreen, per the ground-keyed Gold-as-Detail Rule. */}
            <m.p
              id="academics-cta-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary"
            >
              Admissions
            </m.p>

            {/* Serif-as-Display heading, fully text-grove-foreground: no
               gold or colored emphasis span, per the Task 4 lesson (a gold
               emphasis span on this heading was a Critical violation). The
               italic-Palm mark would need a light ground to be legal, so
               emphasis here stays plain roman text. */}
            <m.h2
              id="academics-cta-heading"
              variants={itemVariants}
              className="max-w-[26ch] text-balance font-serif text-[clamp(2.25rem,4.8vw,3.5rem)] leading-[1.08] tracking-[-0.005em] text-grove-foreground"
            >
              Every academic path starts with one visit.
            </m.h2>

            <m.p
              variants={itemVariants}
              className="max-w-[54ch] text-pretty text-lg leading-[1.7] text-grove-foreground/80"
            >
              Whichever track your child is headed toward, from Junior High
              through STEM, ASSH, or BE in Senior High, our registrar can walk
              you through the fit in a single conversation. Talk to
              Admissions and give your Guardian a place to grow.
            </m.p>

            <m.div
              variants={itemVariants}
              className="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:justify-center"
            >
              {/* The single CTA: gold pill on Evergreen, matching the
                 admissions.tsx CTA pattern exactly (rounded-full, bg-secondary,
                 secondary-foreground text, hover lift). */}
              <Button
                render={<Link href="/contact" />}
                nativeButton={false}
                className="h-12 rounded-full border-transparent bg-secondary bg-clip-border px-8 text-base font-semibold text-secondary-foreground shadow-[0_12px_28px_-8px_rgba(0,0,0,0.5)] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-[0_18px_34px_-8px_rgba(0,0,0,0.55)]"
              >
                Talk to Admissions
              </Button>

              {/* Secondary link stays a plain text link, never a second
                 button, so the single-CTA emphasis holds. */}
              <Link
                href="/admissions"
                className="text-[15px] font-semibold text-grove-foreground underline decoration-secondary/70 decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grove-foreground/70 focus-visible:ring-offset-2 focus-visible:ring-offset-grove-deep"
              >
                See admission requirements
              </Link>
            </m.div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
