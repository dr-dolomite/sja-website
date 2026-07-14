"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as hero.tsx, core-values.tsx,
// vision-mission.tsx, and life-of-guardians.tsx, so every entrance across the
// homepage reads as one system. Hidden state never touches opacity: content
// paints at full opacity on the first (server-rendered) frame and only
// slides the last 24px into place. Enhancement-Not-Gate.
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

// PLACEHOLDER: the BE and ASH acronym expansions and all three cluster
// descriptions are brand-voiced drafts pending official school wording (same
// status as core-values / life-of-guardians copy). STEM, the three clusters,
// MATATAG, and the Strengthened SHS framing are final.
const CLUSTERS = [
  {
    number: "01",
    name: "STEM",
    description:
      "Science, Technology, Engineering, and Mathematics. For the problem-solvers headed toward engineering, medicine, and the sciences.",
  },
  {
    number: "02",
    name: "BE",
    description:
      "Business and Entrepreneurship. For the builders and leaders who will run and grow enterprises of their own.",
  },
  {
    number: "03",
    name: "ASH",
    description:
      "Arts, Sciences, and Humanities. For the storytellers, public servants, and lifelong questioners.",
  },
] as const;

export function Offerings() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Leaf-Tint ground (--muted, #EDF3ED): the same soft green break
           core-values.tsx uses, carrying the Coconut/Leaf-Tint/Evergreen
           alternation forward after Life of Guardians closes on Coconut and
           Leaf-Tint. The contained Evergreen Senior High panel below supplies
           this section's own green mass per the Committed Green Rule. */}
        <section
          aria-labelledby="offerings-heading"
          className="relative overflow-hidden border-t border-border bg-muted text-foreground"
        >
          {/* Soft-geometry anchor: a thin gold ring in the upper-left, clear
             of the Junior High row and the Senior High panel below. Fine gold
             linework on a light ground is legal and decorative only. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-40 size-[26rem] rounded-full border border-secondary/25 sm:size-[32rem]"
          />

          <div className="relative mx-auto w-full max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-4">
            {/* 1. Lead ---------------------------------------------------- */}
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              className="flex flex-col gap-5"
            >
              <m.p
                variants={itemVariants}
                className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
              >
                Our Programs
              </m.p>
              <m.h2
                id="offerings-heading"
                variants={itemVariants}
                className="text-balance font-serif text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.06] tracking-[-0.005em] text-grove-deep"
              >
                One <em className="font-medium italic text-primary">continuous</em>{" "}
                path, Grade 7 through 12.
              </m.h2>
              <m.p
                variants={itemVariants}
                className="max-w-[52ch] text-pretty text-lg leading-[1.6] text-muted-foreground"
              >
                St. Joseph&rsquo;s offers Junior and Senior High School on
                DepEd&rsquo;s newest curriculum, so a Guardian can grow from
                first year to graduate without ever leaving the Grove.
              </m.p>
            </m.div>

            {/* 2. Junior High — light row, deliberately lighter weight ----- */}
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              className="mt-16 sm:mt-20 lg:grid lg:grid-cols-12 lg:gap-x-16"
            >
              <div className="flex flex-col gap-3 lg:col-span-4">
                <m.div variants={itemVariants} className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-secondary" />
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Junior High School
                  </p>
                </m.div>
                <m.h3
                  variants={itemVariants}
                  className="text-balance font-serif text-2xl leading-tight tracking-normal text-grove-deep sm:text-3xl"
                >
                  Grades 7 to 10, built on MATATAG
                </m.h3>
              </div>
              <m.p
                variants={itemVariants}
                className="mt-4 max-w-[60ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:col-span-7 lg:col-start-6 lg:mt-0"
              >
                Every Junior High Guardian follows MATATAG, DepEd&rsquo;s
                strengthened core that trims the crowded old load to go deeper
                on the essentials: solid literacy and numeracy, and the
                values that shape good character, in classes small enough
                that a teacher still knows every name.
              </m.p>
            </m.div>

            {/* 3. Senior High — contained Evergreen registry panel --------- */}
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              className="mt-16 sm:mt-20"
            >
              <div className="relative overflow-hidden rounded-[32px] bg-grove-deep px-6 py-12 text-grove-foreground sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                {/* Barely-there gold glow, per Soft-Geometry. Decorative. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(60% 55% at 90% 6%, color-mix(in oklch, var(--secondary), transparent 90%), transparent 70%)",
                  }}
                />
                {/* Thin gold ring in the open lower-left corner, clipped by
                   the panel's overflow-hidden. Decorative only. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-28 -left-28 size-[22rem] rounded-full border border-secondary/25"
                />

                <div className="relative flex flex-col gap-4">
                  <m.p
                    variants={itemVariants}
                    className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary"
                  >
                    Senior High School
                  </m.p>
                  <m.h3
                    variants={itemVariants}
                    className="text-balance font-serif text-2xl leading-tight tracking-normal text-grove-foreground sm:text-3xl"
                  >
                    The Strengthened Senior High School
                  </m.h3>
                  <m.p
                    variants={itemVariants}
                    className="max-w-[60ch] text-pretty text-base leading-relaxed text-grove-foreground/90 sm:text-lg"
                  >
                    Our Senior High runs the new Strengthened SHS, a focused
                    three-term program where every Guardian specializes
                    early, choosing one of three clusters and rounding it out
                    with full academic electives.
                  </m.p>
                </div>

                {/* Cluster registry */}
                <m.div
                  variants={containerVariants}
                  className="relative mt-10 flex flex-col sm:mt-12"
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
                        <p className="max-w-[60ch] text-pretty text-base leading-relaxed text-grove-foreground/90">
                          {description}
                        </p>
                      </div>
                    </m.div>
                  ))}
                </m.div>

                {/* Closing electives line */}
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
                    Full academic electives across every cluster, so each
                    Guardian shapes their final two years around where they
                    are headed.
                  </p>
                </m.div>
              </div>
            </m.div>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
