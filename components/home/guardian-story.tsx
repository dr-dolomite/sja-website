"use client";

import Image from "next/image";
import Link from "next/link";
import { Award } from "lucide-react";

// Static imports so Next generates a real blurred placeholder for each photo at
// build time — the large festival and Mass images fade up from their own blur
// instead of flashing blank white on a cold load.
import atiAtihanImg from "../../public/images/hero/sja-ati-atihan.jpg";
import faithMassImg from "../../public/images/sja-images/IMG_20260610_091810.jpg";
import guardiansImg from "../../public/images/hero/sja-new.jpg";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

import { Button } from "@/components/ui/button";

// Shared stagger container for a row's children (heading, body, photo). Kept
// identical to the hero's containerVariants so entrances across the page feel
// like one system.
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.1,
    },
  },
};

// Transform-only rise, matching hero.tsx exactly: hidden state never touches
// opacity, so every paragraph and photo paints at full opacity on first frame
// (server-rendered) and only slides the last 24px into place. This is the
// Enhancement-Not-Gate Rule — content is complete and legible before Motion
// ever runs, and a slow phone or headless render never shows blank content.
const itemVariants: Variants = {
  hidden: { y: 24 },
  show: {
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// The dominant band's photo gets its own transform-only reveal: a slight
// scale-down from 1.06 -> 1 (never opacity), so the immersive image still
// paints instantly and only settles into frame.
const bandImageVariants: Variants = {
  hidden: { scale: 1.06 },
  show: {
    scale: 1,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

export function GuardianStory() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Committed Green on the Coconut canvas: the section ground stays
           bg-background throughout. Green masses into two contained objects,
           the full-bleed faith band and the invitation panel, never as a
           background wash. */}
        <section className="bg-background py-20 text-foreground sm:py-28">
          {/* 1. Lead ------------------------------------------------------ */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="mx-auto flex w-full max-w-[88rem] flex-col gap-5 px-4 sm:px-6 lg:px-4"
          >
            <m.h2
              variants={itemVariants}
              className="text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em] text-foreground"
            >
              What it feels like to be a <span className="text-primary">Guardian</span>.
            </m.h2>
            <m.p
              variants={itemVariants}
              className="max-w-[48ch] text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              Some things about a school you can only feel. This is the life a
              child steps into at St. Joseph&rsquo;s, past the crest and the
              mission statement.
            </m.p>
          </m.div>

          {/* 2. Row A — photo left / copy right, supporting weight -------- */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="mx-auto mt-16 flex w-full max-w-[88rem] flex-col gap-8 px-4 sm:mt-20 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-4"
          >
            <m.div
              variants={itemVariants}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl lg:order-1"
            >
              <Image
                src={atiAtihanImg}
                alt="Guardians costumed in full regalia for the Ati-Atihan festival"
                fill
                sizes="(min-width: 1024px) 42vw, 92vw"
                quality={72}
                placeholder="blur"
                className="object-cover"
              />
            </m.div>
            <div className="flex flex-col gap-4 lg:order-2">
              <m.h3
                variants={itemVariants}
                className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                A full life beyond the last bell
              </m.h3>
              <m.p
                variants={itemVariants}
                className="max-w-[65ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                A Guardian&rsquo;s week runs well past dismissal. There is the
                SJA Palaro and Foundation Day, basketball and volleyball for
                the men and the women, dance sports and racket games, and an
                Alumni Homecoming that brings grown Guardians back through the
                same gate they once ran through. There is room here for who
                your child already is, and for who they are still becoming.
              </m.p>
            </div>
          </m.div>

          {/* 3. Band B — dominant, full-bleed, faith ---------------------- */}
          <div className="relative mt-20 min-h-[70svh] w-full overflow-hidden sm:mt-24 lg:min-h-[80svh]">
            <m.div
              variants={bandImageVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              className="absolute inset-0"
            >
              <Image
                src={faithMassImg}
                alt="The St. Joseph's Academy community gathered with their bishop for Mass in the parish church"
                fill
                sizes="100vw"
                quality={72}
                placeholder="blur"
                className="object-cover"
              />
            </m.div>
            {/* Two scrims, each matched to where the text sits at its
               breakpoint so white copy always lands on deep green, never the
               bright church interior (which would drop below 4.5:1).
               - Mobile: text is full-width and bottom-anchored. The lower third
                 of the photo is the darker crowd, so a strong bottom-up scrim
                 covers the whole text region while the lit dome reveals above.
               - lg+: text is a left column, vertically centered. A left-anchored
                 horizontal scrim covers the entire measure at any height while
                 the dome, windows, and crowd on the right stay visible.
               grove-deep is ~0.33 L, so white over the ~85-94% opaque zone
               clears AA comfortably. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 lg:hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to top, color-mix(in oklch, var(--grove-deep), transparent 5%) 0%, color-mix(in oklch, var(--grove-deep), transparent 12%) 32%, color-mix(in oklch, var(--grove-deep), transparent 55%) 58%, transparent 82%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 hidden lg:block"
              style={{
                backgroundImage:
                  "linear-gradient(to right, color-mix(in oklch, var(--grove-deep), transparent 6%) 0%, color-mix(in oklch, var(--grove-deep), transparent 14%) 42%, color-mix(in oklch, var(--grove-deep), transparent 58%) 60%, transparent 84%)",
              }}
            />
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              // absolute inset-0 (not h-full): the band parent sizes by
              // min-height, so a percentage-height child collapses to its
              // content and items-* would no-op, pinning text to the top edge.
              // Filling via inset-0 gives the flexbox a real height, so
              // items-center actually vertically centers the text in the band.
              className="absolute inset-0 mx-auto flex w-full max-w-[88rem] items-end px-4 pb-12 pt-16 sm:px-6 lg:items-center lg:px-4 lg:py-12"
            >
              <div className="flex max-w-xl flex-col gap-3">
                {/* Serif-as-Display: Instrument Serif (weight 400 only)
                   carries the page's spiritual peak. No font-bold: the serif
                   has no bold and faux-bold would look crude; relaxed tracking
                   and a size step up let the classical letterforms breathe. */}
                <m.h3
                  variants={itemVariants}
                  className="text-balance font-serif text-3xl leading-tight tracking-normal text-grove-foreground sm:text-4xl"
                >
                  Faith, lived together
                </m.h3>
                <m.p
                  variants={itemVariants}
                  className="max-w-[55ch] text-pretty text-base leading-relaxed text-grove-foreground/90 sm:text-lg"
                >
                  Being Catholic here is not a line on the timetable. It is
                  the whole school in one church for First Friday Mass, the
                  stillness of the annual recollection, the Diocese of Kalibo
                  behind every Guardian. Faith is not explained to your
                  child. It is lived beside them.
                </m.p>
              </div>
            </m.div>
          </div>

          {/* 4. Row C — photo right / copy left, supporting weight -------- */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="mx-auto mt-20 flex w-full max-w-[88rem] flex-col gap-8 px-4 sm:mt-24 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-4"
          >
            <div className="flex flex-col gap-4 lg:order-1">
              <m.h3
                variants={itemVariants}
                className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                A path that asks their best
              </m.h3>
              <m.p
                variants={itemVariants}
                className="max-w-[65ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                From Grade 7 to Grade 12, Guardians follow the MATATAG and
                Strengthened Senior High curriculum, choosing the STEM, ASH,
                or BE cluster that fits where they are headed, in classes of
                about thirty-five where a teacher can still learn every name.
              </m.p>
              {/* The section's single gold detail: ONE Piña Gold Award icon
                 heads the honors group. The wins below are marked with small
                 green dots, never gold-per-item, so gold stays the single
                 highlight (Gold-as-Detail) and the honors read as a real record
                 rather than a tiled trophy case. */}
              <m.div variants={itemVariants} className="flex flex-col gap-3 pt-1">
                <p className="flex items-center gap-2.5 text-base font-semibold text-foreground sm:text-lg">
                  <Award
                    aria-hidden="true"
                    className="size-5 shrink-0 text-secondary"
                  />
                  A record the Guardians are proud of
                </p>
                <ul className="flex flex-col gap-2.5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {[
                    "Top 10 Outstanding Students, chosen by interview every year",
                    "Annual honors in the CEAP Inter-Catholic League, in both sports and the cultural competitions",
                    "A Guardian who competed all the way to the Palarong Pambansa",
                    "Five straight years as the LGU Daigon choir champion, and December’s Battle of the Bands title",
                  ].map((win) => (
                    <li key={win} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span>{win}</span>
                    </li>
                  ))}
                </ul>
              </m.div>
            </div>
            <m.div
              variants={itemVariants}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl lg:order-2"
            >
              <Image
                src={guardiansImg}
                alt="Four Guardians in the St. Joseph's Academy uniform, from junior high to senior high"
                fill
                sizes="(min-width: 1024px) 42vw, 92vw"
                quality={72}
                placeholder="blur"
                className="object-cover"
              />
            </m.div>
          </m.div>

          {/* 5. Invitation — contained inset green panel ------------------- */}
          <m.div
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="mx-auto mt-20 w-full max-w-[88rem] px-4 sm:mt-24 sm:px-6 lg:px-4"
          >
            <div className="flex flex-col items-start gap-8 rounded-3xl bg-grove-deep px-6 py-12 text-grove-foreground sm:px-12 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-16">
              <div className="flex flex-col gap-3 lg:max-w-xl">
                {/* The second and final serif moment: the heartfelt close. Same
                   Instrument Serif treatment as the faith band, so the two
                   grove-deep sections share one quiet rule: the school's warmest
                   voice speaks in serif, the utility sections stay Hanken Grotesk. */}
                <h3 className="text-balance font-serif text-3xl leading-tight tracking-normal sm:text-4xl">
                  Come and see for yourself.
                </h3>
                <p className="max-w-[55ch] text-pretty text-base leading-relaxed text-grove-foreground/90 sm:text-lg">
                  Numbers and photographs only carry so far. Visit St.
                  Joseph&rsquo;s, meet the Guardians, and feel whether this is
                  where your child belongs.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                {/* Inverted primary: on the green panel a standard green
                   button would disappear, so this flips to a near-white fill
                   with green text (>=4.5:1, verified — grove-deep foreground
                   on white and white background with dark green text both
                   read far past AA). */}
                <Button
                  render={<Link href="/admissions" />}
                  nativeButton={false}
                  className="h-12 rounded-lg border-transparent bg-grove-foreground px-7 text-base font-semibold text-grove-deep shadow-md transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-grove-foreground/90 hover:shadow-lg"
                >
                  Inquire about enrollment
                </Button>
                <Button
                  render={<Link href="/contact" />}
                  nativeButton={false}
                  variant="outline"
                  className="h-12 rounded-lg border-grove-foreground/40 bg-transparent px-7 text-base font-semibold text-grove-foreground transition-[transform,box-shadow,background-color,border-color] hover:-translate-y-0.5 hover:border-grove-foreground/60 hover:bg-grove-foreground/10"
                >
                  Visit us
                </Button>
              </div>
            </div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
