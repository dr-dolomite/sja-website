"use client";

import Image from "next/image";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as vision-mission.tsx and
// core-values.tsx, so every entrance across the site reads as one system.
// Hidden state never touches opacity: content paints at full opacity on the
// first (server-rendered) frame and only slides the last 24px into place.
// Enhancement-Not-Gate — reduced-motion and headless renders show complete
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

// Static row (deliberately NOT a marquee, distinct from the hero's approved
// affiliation marquee): four recognitions the school holds, each a real
// mark of accreditation rather than decorative logos.
const AFFILIATIONS = [
  {
    src: "/images/affiliations/deped.png",
    alt: "Department of Education",
    label: "DepEd Recognized",
  },
  {
    src: "/images/affiliations/ceap.png",
    alt: "Catholic Educational Association of the Philippines",
    label: "CEAP Region VI Member",
  },
  {
    src: "/images/affiliations/peac.png",
    alt: "Private Education Assistance Committee",
    label: "PEAC Certified",
  },
  {
    src: "/images/affiliations/esc-logo.png",
    alt: "Education Service Contracting",
    label: "ESC Participating School",
  },
] as const;

export function AboutAffiliations() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Coconut ground: a calm, breathing light section between the
           Philosophy & Goals evergreen band above and the closing CTA below,
           keeping the Coconut/Leaf-Tint/Evergreen alternation the Committed
           Green Rule asks for. Top hairline makes the evergreen -> coconut
           handoff a crisp line. */}
        <section
          aria-labelledby="about-affiliations-heading"
          className="relative border-t border-border bg-background text-foreground"
        >
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="relative mx-auto w-full max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-4"
          >
            {/* Eyebrow-kicker. On this light ground gold may not be text, so
               the kicker is Palm ink, AA on Coconut. */}
            <m.p
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              Affiliations &amp; Recognition
            </m.p>

            {/* Serif-as-Display heading. */}
            <m.h2
              id="about-affiliations-heading"
              variants={itemVariants}
              className="mt-5 max-w-[20ch] text-balance font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.005em] text-grove-deep"
            >
              Recognized, certified, and connected.
            </m.h2>

            {/* The row: even, dignified, static. Grayscale by default, full
               color on hover/focus for a restrained interactive touch that
               stays legible either way (no meaning is carried by color, only
               polish). Each mark sits above its own short label. */}
            <m.div
              variants={containerVariants}
              className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:mt-16 sm:grid-cols-4 sm:gap-x-6"
            >
              {AFFILIATIONS.map(({ src, alt, label }) => (
                <m.div
                  key={src}
                  variants={itemVariants}
                  className="flex flex-col items-center gap-4 text-center"
                >
                  <div className="relative h-16 w-full max-w-[9rem] sm:h-20">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(min-width: 640px) 9rem, 40vw"
                      className="object-contain grayscale transition-[filter] duration-300 ease-out hover:grayscale-0 focus-visible:grayscale-0"
                    />
                  </div>
                  <span className="mt-5 block h-px w-10 bg-secondary" aria-hidden="true" />
                  <p className="text-sm font-medium leading-[1.5] text-muted-foreground">
                    {label}
                  </p>
                </m.div>
              ))}
            </m.div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
