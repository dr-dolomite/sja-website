"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";
import { AFFILIATION_MARKS, type AffiliationMark } from "@/lib/affiliations";
import { Button } from "@/components/ui/button";
import { GuardianDeck } from "@/components/hero/guardian-deck";

// The accreditation / affiliation marks live in lib/affiliations.ts so the hero
// trust-bar (a slow drift) and the footer strip (static) stay in sync. Order
// alternates square emblems / wide wordmarks for an even drifting rhythm here.

// Transform-only rise. The hidden state moves the element, it never hides it:
// with no opacity in the variant the copy paints at full opacity on the first
// frame (server-rendered, pre-hydration) and Motion only slides the last 24px
// into place. So the hero is legible instantly on a slow phone instead of
// gating blank on the entrance. Reduced motion snaps it (MotionConfig below).
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 24 },
  show: {
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// The photo cluster "grows" into place, a subtle scale distinct from the
// copy's rise so the entrance reads as choreography. Opacity stays 1 so the
// priority LCP photo is painted immediately, never held behind the animation.
const clusterVariants: Variants = {
  hidden: { scale: 0.96, y: 14 },
  show: {
    scale: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
};

// Slide-only, like the rest: the accreditation marks are real trust signals,
// so they settle down from above without ever being hidden behind opacity.
const logoStripVariants: Variants = {
  hidden: { y: -10 },
  show: {
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function AffiliationMark({ mark }: { mark: AffiliationMark }) {
  return (
    <div className="flex shrink-0 items-center px-3">
      {/* Each mark sits on a bordered card chip so the official crests and
         wordmarks keep their real color and dignity on the Coconut canvas,
         no flat silhouettes of an ecclesiastical coat of arms. Emblems get
         tighter padding than the wordmarks; the taller logo + smaller padding
         nets the same chip height, so the row still lines up. */}
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-border bg-card",
          mark.emblem ? "px-2.5 py-1" : "px-3 py-1.5"
        )}
      >
        {/* w-auto keeps each logo's true proportions from its width/height, so
           wordmarks run wide and emblems stay square. Emblems render a step
           larger to hold their weight against the wordmarks. */}
        <Image
          src={mark.image}
          alt={mark.label}
          width={mark.width}
          height={mark.height}
          className={cn(
            "w-auto shrink-0 object-contain",
            mark.emblem ? "h-6 sm:h-7" : "h-5 sm:h-6"
          )}
        />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* overflow-hidden is load-bearing: it clips the radial Palm glow and
           keeps the photo cluster's percentage-based children from ever
           forcing horizontal scroll at narrow widths. */}
        <section className="relative overflow-hidden bg-background text-foreground">
          {/* ============ SLIM AFFILIATION MARQUEE BAR ============ */}
          {/* A deliberately kept-but-slimmed trust-bar (see
             hero-affiliation-marquee-approved memory note): a single row, a
             quieter label, and less vertical padding than a full band. Only
             this bar moves; the values strip further down is static, so the
             page never has two adjacent drifting bands. */}
          <div className="border-b border-border">
            <div className="mx-auto w-full max-w-[80rem] px-4 py-2.5 sm:px-6">
              {/* The trust cluster is bounded (max-w) and pushed to the right
                 with ml-auto, so it reads as a compact right-aligned strip sized
                 to its logos, not an edge-to-edge marquee band. On mobile the cap
                 exceeds the viewport, so it simply fills the row. */}
              <m.div
                variants={logoStripVariants}
                initial="hidden"
                animate="show"
                role="group"
                aria-label="Accreditations and affiliations"
                className="ml-auto flex w-full max-w-[44rem] items-center gap-3 sm:gap-4"
              >
                <span className="shrink-0 text-xs text-muted-foreground">
                  Accredited &amp; affiliated
                </span>
                <div className="group relative min-w-0 flex-1 overflow-hidden py-0.5 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
                  {/* Two identical halves; the drift translates by exactly one
                     half (-50% of the track), landing the second where the
                     first began, a seamless, endless loop. Each half repeats
                     the marks twice so a single half is always wider than the
                     viewport, leaving no bare stretch before the loop point. */}
                  <div className="flex w-max items-center [animation:affiliation-drift_60s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
                    {[0, 1].map((half) => (
                      <div
                        key={half}
                        aria-hidden={half === 1}
                        className="flex shrink-0 items-center"
                      >
                        {[0, 1].map((rep) =>
                          AFFILIATION_MARKS.map((mark) => (
                            <AffiliationMark
                              key={`${half}-${rep}-${mark.key}`}
                              mark={mark}
                            />
                          ))
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </m.div>
            </div>
          </div>

          {/* ============ HERO GRID ============ */}
          <div className="relative mx-auto w-full max-w-[80rem] px-4 py-16 sm:px-6 lg:grid lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-12 lg:py-24">
            {/* Soft Palm radial glow, atmospheric only, clipped by the
               section's overflow-hidden so it never widens the viewport. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -left-32 size-[38rem] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklch, var(--primary) 10%, transparent) 0%, transparent 68%)",
              }}
            />

            {/* LEFT COLUMN: copy */}
            <m.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="relative z-10 order-1"
            >
              {/* Instrument Serif, font-normal only (the face has no true
                 bold; forcing font-bold faux-bolds and distorts the
                 hairlines). The italic "tomorrow" is Palm-on-Coconut, a legal
                 light-ground emphasis per DESIGN.md. */}
              <m.h1
                variants={itemVariants}
                className="mt-0 font-serif text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.03] font-normal tracking-[-0.01em] text-balance text-grove-deep"
              >
                Rooted in faith,{" "}
                <br className="hidden sm:block" />
                growing toward <em className="text-primary italic">tomorrow</em>.
              </m.h1>

              {/* The motto is woven into the subhead itself rather than set as
                 its own display line. "be like St. Joseph" picks up the serif
                 display voice (Instrument Serif italic) so it echoes the
                 headline's italic word, in Palm on Coconut, a legal
                 light-ground emphasis (5.06:1). Phrased with a comma, not a
                 colon, so the values read as an apposition. */}
              <m.p
                variants={itemVariants}
                className="mt-5 max-w-[480px] text-lg leading-[1.65] text-pretty text-muted-foreground"
              >
                A Diocesan Catholic school in the heart of Malinao, forming
                Guardians to{" "}
                <em className="font-serif text-primary italic">
                  be like St. Joseph
                </em>
                , selfless, just, and achievers in junior and senior high
                school and beyond.
              </m.p>

              <m.div
                variants={itemVariants}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                {/* Palm primary pill CTA (DESIGN.md "Palm primary pill button":
                   full radius, soft green shadow that deepens on hover, ~-2px
                   lift). The shadcn Button base ships `border border-transparent
                   bg-clip-padding`, which clips the fill to the padding box and
                   leaves the 1px transparent border ring unpainted, so the pill
                   edge showed a faint light hairline ("smudge"). `bg-clip-border`
                   paints the Palm fill across the full border box, so the edge
                   is one clean color with no rim, at rest and on the opaque
                   darker hover fill alike. The shadow is a deep, low-spread
                   Evergreen tint (rgba(14,61,43,...)) per DESIGN.md section 4,
                   not a Palm glow, so the button reads premium and grounded
                   rather than SaaS-neon, and deepens as it lifts on hover. The
                   base's focus-visible ring is inherited unchanged. */}
                <Button
                  render={<Link href="/admissions" />}
                  nativeButton={false}
                  className="h-[52px] rounded-full bg-primary bg-clip-border px-8 text-base font-semibold text-primary-foreground shadow-[0_10px_28px_-10px_rgba(14,61,43,0.20)] transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-grove)] hover:-translate-y-0.5 hover:bg-[color-mix(in_oklch,var(--primary),#000_10%)] hover:shadow-[0_18px_40px_-12px_rgba(14,61,43,0.28)]"
                >
                  Apply Today
                </Button>
                {/* Secondary: a ghost pill that matches the primary's height so
                   the two read as a deliberate pair. Hairline border at rest
                   (Flat-Until-Touched); on hover it lifts, borrows a Palm border
                   and a barely-there Palm wash. No gold underline. */}
                <Link
                  href="/about"
                  className="group/link inline-flex h-[52px] w-fit items-center gap-1.5 rounded-full border border-border px-7 text-base font-semibold text-grove-deep transition-[transform,background-color,border-color] duration-300 ease-[var(--ease-grove)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklch,var(--primary),transparent_55%)] hover:bg-[color-mix(in_oklch,var(--primary),transparent_92%)] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  Get to know us
                  <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-grove)] group-hover/link:translate-x-0.5" />
                </Link>
              </m.div>
            </m.div>

            {/* RIGHT COLUMN: the Guardian coverflow deck. The deck manages
               its own portrait aspect ratio and sizing internally (fans
               outward from a centred 3:4 card), so this wrapper only
               contributes the shared scale-in entrance, no aspect ratio or
               max-width cap of its own. */}
            <m.div
              variants={clusterVariants}
              initial="hidden"
              animate="show"
              className="relative z-10 order-2 mt-14 w-full lg:mt-0"
            >
              <GuardianDeck />
            </m.div>
          </div>

          {/* ============ VALUES STRIP ============ */}
          <div className="border-t border-b border-border bg-background">
            {/* Dots sit BETWEEN values only (render for index > 0), so there is
               no dangling separator now that the motto has moved up to the
               headline. */}
            <div className="mx-auto flex w-full max-w-[80rem] flex-wrap items-center justify-center gap-x-5 gap-y-3 px-4 py-5 sm:px-6">
              {["Selfless", "Just", "Achiever"].map((value, i) => (
                <React.Fragment key={value}>
                  {i > 0 && (
                    <span aria-hidden="true" className="size-[5px] rounded-full bg-secondary" />
                  )}
                  <span className="text-[13px] font-semibold tracking-[0.24em] text-grove-deep uppercase">
                    {value}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
