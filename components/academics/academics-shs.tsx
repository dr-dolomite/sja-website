"use client";

import Image from "next/image";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as academics-intro.tsx and
// academics-jhs.tsx, so /academics reads as one continuous system. Hidden
// state never touches opacity: content paints at full opacity on the first
// (server-rendered) frame and only slides the last 24px into place.
// Enhancement-Not-Gate — reduced motion and headless renders show complete
// content immediately.
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

// The ASSH and BE full-word expansions are not yet officially confirmed by
// the school (same pending status as the Offerings homepage registry, see
// components/home/offerings.tsx). Only STEM's expansion is safe to spell
// out. ASSH and BE get a brand-voiced audience line instead of an invented
// official name.
const CLUSTERS = [
  {
    number: "01",
    name: "STEM",
    description:
      "Science, Technology, Engineering, and Mathematics. For the Guardians drawn to formulas, systems, and the sciences, headed toward engineering, medicine, and research.",
  },
  {
    number: "02",
    name: "ASSH",
    description:
      "For the Guardians who read the world through people, ideas, and language, headed toward the humanities, public service, and the social sciences.",
  },
  {
    number: "03",
    name: "BE",
    description:
      "For the Guardians already thinking like builders, headed toward business, management, and enterprises of their own.",
  },
] as const;

export function AcademicsShs() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Evergreen structural band (bg-grove-deep): this is the primary
           green mass for /academics, satisfying the Committed Green Rule
           after the Coconut intro and Leaf-Tint JHS beat. Full-bleed rather
           than a contained panel (unlike offerings.tsx) since this page
           gives Senior High its own dedicated section, not a shared row.
           The big rounded top (matching vision-mission.tsx, admissions.tsx,
           about-seal.tsx, about-philosophy-goals.tsx) lifts it off the
           Leaf-Tint JHS section above instead of a hairline border-t, which
           reads as a mismatched light-on-dark seam per --border's
           translucent-evergreen-on-light design. */}
        <section
          aria-labelledby="academics-shs-eyebrow"
          className="relative overflow-hidden rounded-t-[40px] bg-grove-deep text-grove-foreground sm:rounded-t-[56px]"
        >
          {/* Barely-there gold glow, per Soft-Geometry. Decorative only. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(60% 55% at 88% 4%, color-mix(in oklch, var(--secondary), transparent 90%), transparent 70%)",
            }}
          />
          {/* Thin gold ring, decorative only, legal on Evergreen. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-32 size-[26rem] rounded-full border border-secondary/25 sm:size-[32rem]"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto grid w-full max-w-[88rem] grid-cols-1 items-start gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:px-4"
          >
            {/* Text column. */}
            <div className="lg:col-span-7">
              {/* Eyebrow-kicker: gold IS legal as text here since the ground
                 is Evergreen, per the ground-keyed Gold-as-Detail Rule. */}
              <m.p
                id="academics-shs-eyebrow"
                variants={itemVariants}
                className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary"
              >
                Senior High School
              </m.p>

              {/* Serif-as-Display heading. Fully text-grove-foreground: gold
                 stays confined to the eyebrow, the cluster numerals, the
                 thin rings, and the closing marker glyph, never a large
                 gold text block on this Evergreen ground. */}
              <m.h2
                variants={itemVariants}
                className="mt-5 max-w-[20ch] text-balance font-serif text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.08] tracking-[-0.005em] text-grove-foreground"
              >
                The Strengthened Senior High School.
              </m.h2>

              {/* Body: exact SSHS facts. */}
              <m.p
                variants={itemVariants}
                className="mt-8 max-w-[56ch] text-pretty text-lg leading-[1.7] text-grove-foreground/90 sm:text-xl"
              >
                Our Senior High runs the new Strengthened SHS, a focused
                program where every Guardian specializes early, choosing one
                of three Academic Track clusters to shape their final two
                years around where they are headed.
              </m.p>

              {/* Cluster registry, mirroring the offerings.tsx pattern. */}
              <m.div
                variants={containerVariants}
                className="relative mt-12 flex flex-col sm:mt-14"
              >
                {CLUSTERS.map(({ number, name, description }, index) => (
                  <m.div
                    key={number}
                    variants={itemVariants}
                    className={`flex flex-col gap-4 rounded-2xl px-3 py-6 transition-colors hover:bg-grove-foreground/[0.04] sm:flex-row sm:items-baseline sm:gap-8 sm:px-4 ${
                      index !== 0 ? "border-t border-grove-foreground/12" : ""
                    }`}
                  >
                    <span className="font-serif text-4xl leading-none text-secondary sm:w-16 sm:shrink-0 sm:text-5xl">
                      {number}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <p className="font-sans text-lg font-semibold text-grove-foreground">
                        {name}
                      </p>
                      <p className="max-w-[58ch] text-pretty text-base leading-relaxed text-grove-foreground/90">
                        {description}
                      </p>
                    </div>
                  </m.div>
                ))}
              </m.div>

              {/* Closing policy line: trust-building facts, verbatim. */}
              <m.div
                variants={itemVariants}
                className="relative mt-8 flex items-start gap-3 sm:mt-10"
              >
                <span
                  aria-hidden="true"
                  className="text-xl font-semibold leading-none text-secondary"
                >
                  +
                </span>
                <p className="max-w-[58ch] text-pretty text-base leading-relaxed text-grove-foreground sm:text-lg">
                  All cluster offerings follow the Department of
                  Education&rsquo;s minimum section size and faculty
                  requirements. The Principal announces the clusters
                  available each enrollment period.
                </p>
              </m.div>
            </div>

            {/* Image column. */}
            <m.div variants={itemVariants} className="lg:col-span-5">
              <div
                className="relative aspect-[5/4] overflow-hidden border border-grove-foreground/15 bg-grove-deep shadow-sm"
                style={{
                  borderRadius: "45% 55% 48% 52% / 55% 45% 58% 42%",
                }}
              >
                <Image
                  src="/images/academics/shs-guardians.jpg"
                  alt="Senior High Guardians at St. Joseph's Academy working within their chosen Academic Track cluster"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 border border-secondary/30"
                  style={{
                    borderRadius: "45% 55% 48% 52% / 55% 45% 58% 42%",
                  }}
                />
              </div>
            </m.div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
