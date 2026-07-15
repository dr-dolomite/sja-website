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
        {/* A compact Evergreen strip, not another full showpiece band: the
           page already spends its Committed-Green mass on the Seal and the
           Philosophy & Goals sections. This closing strip exists so the
           single gold CTA below sits on an evergreen ground per the
           Gold-as-Detail / one-CTA rule, then hands off directly to the
           evergreen footer with no light seam between them. */}
        <section
          aria-labelledby="about-cta-eyebrow"
          className="relative overflow-hidden rounded-t-[40px] bg-grove-deep text-grove-foreground sm:rounded-t-[56px]"
        >
          {/* Barely-there gold glow, atmospheric per the Soft-Geometry Rule.
             Decorative only. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(60% 70% at 12% 100%, color-mix(in oklch, var(--secondary), transparent 92%), transparent 70%)",
            }}
          />
          {/* Thin gold ring, soft-geometry anchor, clipped by overflow-hidden
             so it never widens the viewport. Fine linework only, never
             meaning-bearing. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-secondary/25 sm:size-80"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto flex w-full max-w-[88rem] flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:items-center lg:text-center"
          >
            {/* Eyebrow-kicker: the one place gold reads as text, legal here
               because this ground is evergreen. */}
            <m.p
              id="about-cta-eyebrow"
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary"
            >
              Come and See
            </m.p>

            {/* Serif-as-Display: Instrument Serif carries the headline. */}
            <m.h2
              variants={itemVariants}
              className="max-w-[24ch] text-balance font-serif text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] tracking-[-0.005em] text-grove-foreground"
            >
              Visit St. Joseph&rsquo;s Academy.
            </m.h2>

            <m.p
              variants={itemVariants}
              className="max-w-[52ch] text-pretty font-sans text-base leading-[1.7] text-grove-foreground/90 sm:text-lg"
            >
              The best way to know a school is to walk its grounds. Reach out
              and we will welcome you.
            </m.p>

            <m.div
              variants={itemVariants}
              className="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:justify-center"
            >
              {/* Exactly one gold-styled CTA on this evergreen ground, per
                 the Gold-as-Detail Rule. Matches the shadcn Button usage
                 pattern in site-header.tsx: render prop + nativeButton
                 false. */}
              <Button
                render={<Link href="/contact" />}
                nativeButton={false}
                variant="secondary"
                className="h-12 px-7 text-base hover:bg-[color-mix(in_oklch,var(--secondary),black_5%)] focus-visible:ring-ring"
              >
                Contact us
              </Button>

              {/* Secondary link stays a plain text link, never a second gold
                 button, so the one-CTA rule holds. */}
              <Link
                href="/#admissions"
                className="inline-flex h-12 items-center rounded-md text-base font-medium text-grove-foreground underline underline-offset-4 decoration-grove-foreground/40 transition-colors hover:decoration-grove-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
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
