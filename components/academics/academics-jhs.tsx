"use client";

import Image from "next/image";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as academics-intro.tsx,
// offerings.tsx, and every other homepage/interior section, so /academics
// reads as one continuous system. Hidden state never touches opacity:
// content paints at full opacity on the first (server-rendered) frame and
// only slides the last 24px into place. Enhancement-Not-Gate — reduced
// motion and headless renders show complete content immediately.
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

export function AcademicsJhs() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Leaf-Tint ground (--muted): the intro opened on Coconut, this beat
           steps down one register per the Coconut/Leaf-Tint alternation.
           This is still a LIGHT section by the Committed Green Rule; the
           Evergreen mass for /academics arrives in the Senior High and CTA
           sections built in later tasks, not here. */}
        <section
          aria-labelledby="academics-jhs-eyebrow"
          className="relative overflow-hidden border-t border-border bg-muted text-foreground"
        >
          {/* Soft-geometry anchor: a thin gold ring, decorative only, legal
             on this light ground per the Gold-as-Detail Rule. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 -right-32 size-[24rem] rounded-full border border-secondary/25 sm:size-[30rem]"
          />

          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto grid w-full max-w-[88rem] grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:px-4"
          >
            {/* Image column first on the JHS beat, mirroring the intro's
               text-then-image order so the page's rhythm alternates rather
               than repeating the same layout twice in a row. */}
            <m.div
              variants={itemVariants}
              className="order-first lg:order-last lg:col-span-5"
            >
              <div
                className="relative aspect-[5/4] overflow-hidden border border-border bg-background shadow-sm"
                style={{
                  borderRadius: "45% 55% 48% 52% / 55% 45% 58% 42%",
                }}
              >
                <Image
                  src="/images/academics/jhs-guardians.jpg"
                  alt="Junior High Guardians in a St. Joseph's Academy classroom, working through the MATATAG curriculum together"
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

            {/* Text column. */}
            <div className="lg:col-span-7">
              {/* Eyebrow-kicker. Palm (--primary) on Leaf-Tint, matching the
                 intro and offerings pattern; gold stays decorative linework
                 only on this light ground, never text. */}
              <m.p
                id="academics-jhs-eyebrow"
                variants={itemVariants}
                className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
              >
                Junior High School
              </m.p>

              {/* Serif-as-Display heading. */}
              <m.h2
                variants={itemVariants}
                className="mt-5 max-w-[18ch] text-balance font-serif text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.08] tracking-[-0.005em] text-grove-deep"
              >
                Grades 7 to 10, built on{" "}
                <em className="font-medium italic text-primary">MATATAG</em>.
              </m.h2>

              {/* Body: exact MATATAG facts, fresh phrasing from offerings.tsx. */}
              <m.p
                variants={itemVariants}
                className="mt-8 max-w-[56ch] text-pretty text-lg leading-[1.7] text-muted-foreground sm:text-xl"
              >
                Junior High runs on DepEd&rsquo;s MATATAG Curriculum, built
                around foundational competencies, critical thinking, and
                values integration woven through every learning area. Classes
                stay small enough that a teacher still knows every Guardian
                by name.
              </m.p>
            </div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
