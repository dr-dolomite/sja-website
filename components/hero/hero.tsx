"use client";

import Image from "next/image";
import Link from "next/link";
import { LazyMotion, MotionConfig, domAnimation, m, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GuardianDeck } from "@/components/hero/guardian-deck";

// Accreditation / affiliation marks, drifting in a slow trust-bar (below).
// DepEd + PEAC are the official wordmarks (Wikimedia Commons); the Diocese
// crest is a local asset. ESC is a PEAC-administered program with no distinct
// logo, so it rides as a typographic lockup that echoes the wordmarks.
const AFFILIATION_MARKS = [
  {
    key: "diocese",
    label: "Diocese of Kalibo",
    image: "/images/diocese-of-kalibo-coat-of-arms.webp",
    imageClass: "h-9 w-9 sm:h-10 sm:w-10",
  },
  {
    key: "deped",
    label: "Department of Education",
    image: "/images/affiliations/deped.png",
    imageClass: "h-8 w-auto sm:h-9",
  },
  {
    key: "peac",
    label: "Private Education Assistance Committee",
    image: "/images/affiliations/peac.png",
    imageClass: "h-6 w-auto sm:h-7",
  },
  {
    key: "esc",
    label: "Education Service Contracting",
    image: "/images/affiliations/esc-logo.png",
    imageClass: "h-9 w-9 sm:h-10 sm:w-10",
  },
] as const;

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

const logoStripVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function AffiliationMark({
  mark,
}: {
  mark: (typeof AFFILIATION_MARKS)[number];
}) {
  return (
    <div className="flex shrink-0 items-center px-6">
      <Image
        src={mark.image}
        alt={mark.label}
        width={120}
        height={40}
        className={cn("shrink-0 object-contain", mark.imageClass)}
      />
    </div>
  );
}

export function Hero() {
  // MotionConfig reducedMotion="user" handles prefers-reduced-motion at the
  // animation layer (transforms snap, opacity still fades) — branching the
  // variants on useReducedMotion() instead would desync SSR and client
  // markup and throw a hydration error for reduced-motion visitors.
  const variants = itemVariants;

  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
    <section className="relative flex min-h-[calc(100svh-5rem)] flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-[88rem] px-4 pt-5 sm:px-6 lg:px-4 lg:pt-6">
        {/* Same grid as the hero body below, so the trust-bar aligns to and
           spans only the carousel column — right-side, above the coverflow. */}
        <m.div
          variants={logoStripVariants}
          initial="hidden"
          animate="show"
          className="lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-8 xl:gap-12"
        >
          {/* Accreditation trust-bar: a slow, continuous drift, muted and
             grayscaled at rest and brought to full color when the bar is
             hovered (which also pauses it). Edge-masked so marks fade in and
             out rather than hard-cut. Under reduced motion it holds still,
             fully legible. A modern trust-bar, not a clip-art marquee. */}
          <div
            role="group"
            aria-label="Affiliations and accreditations"
            className="group relative overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] lg:col-start-2"
          >
            {/* Two identical halves; the drift translates by exactly one half
               (-50% of the track), landing the second where the first began —
               a seamless, endless loop. Each half repeats the marks twice so a
               single half is always wider than the viewport, leaving no bare
               stretch before the loop point. */}
            <div className="flex w-max items-center opacity-90 grayscale transition-[filter,opacity] duration-500 [animation:affiliation-drift_60s_linear_infinite] group-hover:opacity-100 group-hover:grayscale-0 group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
              {[0, 1].map((half) => (
                <div
                  key={half}
                  aria-hidden={half === 1}
                  className="flex shrink-0 items-center"
                >
                  {[0, 1].map((rep) =>
                    AFFILIATION_MARKS.map((mark) => (
                      <AffiliationMark key={`${half}-${rep}-${mark.key}`} mark={mark} />
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
        </m.div>
      </div>

      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-10 px-4 pt-6 pb-0 sm:px-6 lg:grid lg:flex-1 lg:grid-cols-[1fr_1.1fr] lg:content-center lg:items-center lg:gap-8 lg:px-4 lg:pt-0 xl:gap-12">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex max-w-2xl flex-col gap-6"
        >
          <m.div
            variants={variants}
            className="flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"
            />
            Enrollment open &middot; SY 2026&ndash;2027
          </m.div>

          <m.h1
            variants={variants}
            className="text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-primary"
          >
            Where Guardians grow.
          </m.h1>

          <m.p
            variants={variants}
            className="max-w-[55ch] text-lg leading-relaxed text-foreground/85 sm:text-xl"
          >
            St. Joseph&rsquo;s Academy of Malinao is a Catholic school in
            Aklan where every student is a Guardian: known by name, rooted
            in faith, and raised to be selfless, just achievers. Since 1947.
          </m.p>

          <m.div
            variants={variants}
            aria-label="Our core values: Selfless, Just, Achievers"
            className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xl font-semibold tracking-tight text-primary sm:text-2xl"
          >
            {["Selfless", "Just", "Achievers"].map((value, index) => (
              <span key={value} className="flex items-center gap-x-4">
                {index > 0 ? (
                  // Academy Gold — the crown, marking the values that define the
                  // school. A single small deliberate accent, never filler.
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full bg-secondary"
                  />
                ) : null}
                <span>{value}</span>
              </span>
            ))}
          </m.div>

          <m.div
            variants={variants}
            className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center"
          >
            <Button
              render={<Link href="/admissions" />}
              nativeButton={false}
              className="h-12 rounded-lg bg-secondary px-7 text-base font-semibold text-secondary-foreground shadow-md shadow-primary/10 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg hover:shadow-primary/20"
            >
              Inquire about enrollment
            </Button>
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              variant="outline"
              className={cn(
                "h-12 rounded-lg border-primary/35 bg-transparent px-7 text-base font-semibold text-primary",
                "transition-[transform,box-shadow,background-color,border-color] hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5"
              )}
            >
              Get in touch
            </Button>
          </m.div>
        </m.div>

        <m.div
          variants={panelVariants}
          initial="hidden"
          animate="show"
          // The deck carries its slide dots + play control ~4rem below it. On
          // the two-column layout that trailing block would pull the deck's
          // optical centre above the text; a matching 4rem top offset balances
          // it so the photo lines up with the middle of the copy.
          className="relative z-10 w-full lg:mt-16 lg:self-center"
        >
          <GuardianDeck />
        </m.div>
      </div>

      <div className="relative mt-10 bg-grove-deep py-5 text-grove-foreground dark:bg-card dark:text-foreground lg:mt-0 lg:py-6">
        <div className="mx-auto grid w-full max-w-[88rem] grid-cols-1 gap-8 px-4 text-sm sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:px-4">
          <div className="flex flex-col gap-2">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Est. 1947</span>
              <span aria-hidden="true" className="opacity-50">
                &middot;
              </span>
              <span className="dark:text-primary">Forming Guardians in faith and knowledge.</span>
            </p>
            <p className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-grove-foreground">
                <Image
                  src="/images/diocese-of-kalibo-coat-of-arms.webp"
                  alt="Coat of arms of the Diocese of Kalibo"
                  width={64}
                  height={64}
                  className="h-7 w-7"
                />
              </span>
              A Diocesan school in Malinao, Aklan &middot; Diocese of Kalibo
            </p>
          </div>
        </div>
      </div>
    </section>
    </MotionConfig>
    </LazyMotion>
  );
}
