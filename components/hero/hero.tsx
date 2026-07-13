"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useReducedMotion,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";
import { AFFILIATION_MARKS, type AffiliationMark } from "@/lib/affiliations";
import { Button } from "@/components/ui/button";
import { GuardianDeck } from "@/components/hero/guardian-deck";

// The accreditation / affiliation marks live in lib/affiliations.ts so the hero
// trust-bar (a slow drift) and the footer strip (static) stay in sync. Order
// alternates square emblems / wide wordmarks for an even drifting rhythm here.

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.08,
    },
  },
};

// Transform-only rise. The hidden state moves the element, it never hides it:
// with no opacity in the variant the copy paints at full opacity on the first
// frame (server-rendered, pre-hydration) and Motion only slides the last 24px
// into place. So the hero is legible instantly on a slow phone instead of
// gating blank on the entrance. Reduced motion snaps it (MotionConfig below).
const itemVariants: Variants = {
  hidden: { y: 24 },
  show: {
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// The invitation badge is the one element allowed a spring. It is additive,
// decorative warmth (not the reassurance copy), so a gentle scale + opacity pop
// is fine here where the headline stays transform-only. The spring reads as
// playful precisely because everything around it settles with a calm expo-out.
// Reduced-motion (MotionConfig below) snaps the transforms and just crossfades.
const badgeVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0, y: 6 },
  show: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 440, damping: 17 },
  },
};

// Warm, community-voice welcomes that cycle in the hero badge — the school
// speaking like people who know you by name, not a corporate "Join us" tag.
// Kept short so the pill resizes gently as lines swap; assistive tech gets one
// static line (below) instead of a new announcement every few seconds.
const GREETINGS = [
  "Come as you are.",
  "Musyon eon!",
  "Known by name.",
  "Tara na!",
  "We saved you a seat.",
  "Be a Guardian!",
  "There’s room for you here.",
] as const;

const GREETING_INTERVAL_MS = 4200;

// The deck "grows" into place — a subtle scale that echoes the headline's
// promise, distinct from the copy's rise so the entrance reads as choreography
// rather than one uniform fade. Opacity stays 1 so the priority LCP photo is
// painted immediately, never held behind the animation.
const panelVariants: Variants = {
  hidden: { scale: 0.96, y: 14 },
  show: {
    scale: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
  },
};

// Slide-only, like the rest: the accreditation marks are real trust signals,
// so they settle down from above without ever being hidden behind opacity.
const logoStripVariants: Variants = {
  hidden: { y: -10 },
  show: {
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
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
          mark.emblem ? "px-3 py-1.5" : "px-4 py-2.5"
        )}
      >
        {/* w-auto keeps each logo's true proportions from its width/height, so
           wordmarks run wide and emblems stay square. Emblems render a step
           larger (h-9 -> sm:h-10) to hold their weight against the wordmarks
           (h-7 -> sm:h-8). */}
        <Image
          src={mark.image}
          alt={mark.label}
          width={mark.width}
          height={mark.height}
          className={cn(
            "w-auto shrink-0 object-contain",
            mark.emblem ? "h-9 sm:h-10" : "h-7 sm:h-8"
          )}
        />
      </div>
    </div>
  );
}

export function Hero() {
  // MotionConfig reducedMotion="user" handles prefers-reduced-motion at the
  // animation layer (transforms snap, opacity still fades) — branching the
  // variants on useReducedMotion() instead would desync SSR and client
  // markup and throw a hydration error for reduced-motion visitors.
  const variants = itemVariants;

  // The badge cycles warm greetings so it reads as the school speaking, not a
  // static tag. useReducedMotion() is read here but only ever consulted inside
  // the effect below — never to branch markup — so SSR and client agree and no
  // hydration mismatch occurs. Hovering the badge pauses the cycle (a WCAG
  // 2.2.2 stop mechanism); reduced-motion visitors hold on the first line.
  const shouldReduceMotion = useReducedMotion();
  const [greeting, setGreeting] = React.useState(0);
  const [greetingPaused, setGreetingPaused] = React.useState(false);

  React.useEffect(() => {
    if (shouldReduceMotion || greetingPaused) return;
    const id = window.setInterval(
      () => setGreeting((current) => (current + 1) % GREETINGS.length),
      GREETING_INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [shouldReduceMotion, greetingPaused]);

  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
    {/* Committed Green on the Coconut canvas: the ground stays Coconut, and
       green masses into contained structural objects, the green panel around
       the photo deck and the full-width proof band below. Green carries 30-60%
       of the fold without ever flooding the background. */}
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
          {/* Accreditation trust-bar: a slow, continuous drift of the marks,
             each on a bordered card chip so it stays legible on the off-white
             canvas and edge-masked so marks fade in and out, not hard-cut. Hover
             pauses the drift; reduced motion holds it still. A quiet standing
             label names the row so it reads as credentials, not decoration. */}
          {/* min-w-0 is load-bearing: as a grid item this group defaults to
             min-width:auto and would refuse to shrink below the marquee's
             intrinsic w-max width, collapsing the empty first column to 0 and
             stretching the bar across the whole container. min-w-0 lets the
             1fr / 1.1fr split hold, so the bar sits exactly over the
             photo-deck column. */}
          <div
            role="group"
            aria-label="Accreditations and affiliations"
            className="flex min-w-0 items-center gap-3 sm:gap-4 lg:col-start-2"
          >
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              Accredited &amp; affiliated
            </span>
            <div className="group relative min-w-0 flex-1 overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
              {/* Two identical halves; the drift translates by exactly one half
                 (-50% of the track), landing the second where the first began —
                 a seamless, endless loop. Each half repeats the marks twice so a
                 single half is always wider than the viewport, leaving no bare
                 stretch before the loop point. */}
              <div className="flex w-max items-center [animation:affiliation-drift_60s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
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
          {/* Invitation badge, a warm, sentence-case welcome above the
             headline, NOT a tracked uppercase eyebrow. Palm (soft tint),
             never gold: an admissions nudge is not achievement or faith,
             so gold would break the Gold-as-Detail rule. Deep-green label for AA
             contrast on the tint. Instead of a corporate status dot, the line
             gently rotates through community-voice welcomes (GREETINGS) so it
             reads as the school speaking. Used once on the hero only. */}
          <m.div variants={badgeVariants} className="flex">
            <span
              onMouseEnter={() => setGreetingPaused(true)}
              onMouseLeave={() => setGreetingPaused(false)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-medium text-grove-deep"
            >
              {/* Piña Gold star, a single deliberate gold detail on the
                 welcome (a conscious nudge on the Gold-as-Detail rule, and the
                 one place gold is actually visible in the fold). A lucide icon,
                 not an emoji, so it renders identically on every device. */}
              <Star
                aria-hidden="true"
                fill="currentColor"
                className="size-3.5 shrink-0 text-secondary"
              />
              {/* One static line for assistive tech; the visible line rotates
                 for sighted visitors only (aria-hidden), so a screen reader is
                 never re-announced every few seconds. */}
              <span className="sr-only">
                Come as you are, there is a place for you here.
              </span>
              <span aria-hidden="true" className="inline-flex">
                <AnimatePresence mode="wait" initial={false}>
                  <m.span
                    key={greeting}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="block whitespace-nowrap"
                  >
                    {GREETINGS[greeting]}
                  </m.span>
                </AnimatePresence>
              </span>
            </span>
          </m.div>

          <m.h1
            variants={variants}
            className="text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground"
          >
            Where <span className="text-primary">Guardians</span> grow.
          </m.h1>

          <m.p
            variants={variants}
            className="max-w-[55ch] text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            St. Joseph&rsquo;s Academy of Malinao is a Catholic school in
            Aklan where every student is a Guardian, known by name and
            rooted in faith. Since 1947, we&rsquo;ve raised our students
            to be:
          </m.p>

          <m.div
            variants={variants}
            aria-label="Our core values: Selfless, Just, Achievers"
            className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {["Selfless", "Just", "Achievers"].map((value, index) => (
              <span key={value} className="flex items-center gap-x-4">
                {index > 0 ? (
                  // A thin Palm rule separates the three values. It
                  // reads as structure, not decoration: no gold here (gold
                  // stays the single detail on the invitation badge above, never
                  // filler between words), and no dot-separator motif.
                  <span
                    aria-hidden="true"
                    className="h-5 w-px shrink-0 bg-primary/50 sm:h-6"
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
            {/* Palm primary button, the standard committed-green CTA on the
               Coconut canvas. Gold stays reserved as a fine detail, never spent
               on a button. */}
            <Button
              render={<Link href="/admissions" />}
              nativeButton={false}
              // border-primary + an opaque darker hover fill: the shared button
              // base pairs a 1px transparent border with bg-clip-padding, so a
              // translucent hover:bg lets the page show through as a white
              // hairline. A matching green border and a solid hover fill close
              // that gap and give a proper darken-on-hover instead of a wash.
              className="group/cta h-12 gap-2 rounded-lg border-primary bg-primary px-7 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-[transform,box-shadow,background-color,border-color] hover:-translate-y-0.5 hover:border-[color-mix(in_oklch,var(--primary),#000_10%)] hover:bg-[color-mix(in_oklch,var(--primary),#000_10%)] hover:shadow-lg hover:shadow-primary/30"
            >
              Inquire about enrollment
              <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/cta:translate-x-0.5" />
            </Button>
            <Button
              render={<Link href="/contact" />}
              nativeButton={false}
              variant="outline"
              className="h-12 rounded-lg px-7 text-base font-semibold transition-[transform,box-shadow,background-color,border-color] hover:-translate-y-0.5"
            >
              Get in touch
            </Button>
          </m.div>
        </m.div>

        {/* The photo deck sits directly on the Coconut canvas, no framing
           panel, and grows into place (panelVariants). Real Guardian
           photography leads the fold; committed green is carried by the
           headline accent, the primary CTA, and the green faith band in the
           section that follows. */}
        <m.div
          variants={panelVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full lg:self-center"
        >
          <GuardianDeck />
        </m.div>
      </div>
    </section>
    </MotionConfig>
    </LazyMotion>
  );
}
