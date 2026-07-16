"use client";

import Image from "next/image";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as offerings.tsx, about-intro.tsx,
// and every other homepage/interior section, so /academics opens as part of
// the same system. Hidden state never touches opacity: content paints at full
// opacity on the first (server-rendered) frame and only slides the last 24px
// into place. Enhancement-Not-Gate — reduced-motion and headless renders show
// complete content immediately.
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

export function AcademicsIntro() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Coconut ground (bg-background): the page opens calm and editorial.
           This is a LIGHT beat by the Committed Green Rule; the evergreen
           mass for /academics arrives in the Senior High and CTA sections
           built in later tasks, not here. */}
        <section
          aria-labelledby="academics-intro-eyebrow"
          className="relative overflow-hidden bg-background text-foreground"
        >
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto grid w-full max-w-[88rem] grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:px-4"
          >
            {/* Text column. */}
            <div className="lg:col-span-6">
              {/* Eyebrow-kicker. On this light ground gold may not be text, so
                 the kicker is Palm (--primary), 5.06:1 on Coconut, AA. */}
              <m.p
                id="academics-intro-eyebrow"
                variants={itemVariants}
                className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
              >
                Academics
              </m.p>

              {/* Serif-as-Display: Instrument Serif carries the page's
                 opening statement, with one italic-Palm emphasis word
                 ("Grove"), legal on this light ground. This is the one h1
                 on /academics. */}
              <m.h1
                variants={itemVariants}
                className="mt-5 max-w-[16ch] text-balance font-serif text-[clamp(2.5rem,5.4vw,4rem)] leading-[1.06] tracking-[-0.005em] text-grove-deep"
              >
                One K to 12 journey, never leaving the{" "}
                <em className="font-medium italic text-primary">Grove</em>.
              </m.h1>

              {/* Lede: exact K-12 facts, Hanken Grotesk body voice. */}
              <m.p
                variants={itemVariants}
                className="mt-8 max-w-[52ch] text-pretty text-lg leading-[1.7] text-muted-foreground sm:text-xl"
              >
                St. Joseph&rsquo;s Academy carries every Guardian through the
                full K to 12 Basic Education Curriculum, Junior High in
                Grades 7 to 10 and Senior High in Grades 11 to 12, one
                continuous formation without ever leaving the Grove.
              </m.p>
            </div>

            {/* Image column: a blob-masked photo of Guardians at the Academy,
               per the Soft-Geometry Rule's organic border-radius language,
               with a thin gold ring inset, Gold-as-Detail decorative linework
               only, legal on this light ground. */}
            <m.div variants={itemVariants} className="lg:col-span-6">
              <div
                className="relative aspect-[5/4] overflow-hidden border border-border bg-muted shadow-sm"
                style={{
                  borderRadius: "44% 38% 42% 40% / 40% 42% 42% 40%",
                }}
              >
                <Image
                  src="/images/academics/academics-intro.jpg"
                  alt="Guardians in a St. Joseph's Academy classroom, part of the school's continuous K to 12 program from Junior High through Senior High"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 border border-secondary/30"
                  style={{
                    borderRadius: "44% 38% 42% 40% / 40% 42% 42% 40%",
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
