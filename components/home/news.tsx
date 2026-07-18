"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as hero.tsx, core-values.tsx,
// vision-mission.tsx, life-of-guardians.tsx, and offerings.tsx, so every
// entrance across the homepage reads as one system. Hidden state never
// touches opacity: content paints at full opacity on the first
// (server-rendered) frame and only slides the last 24px into place.
// Enhancement-Not-Gate.
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

// Renders the latest three Guard Line articles, passed down from
// app/page.tsx (which reads them from @/lib/news). The section structure
// itself, a dated editorial row list, is final.
export type HomeNewsPost = {
  slug: string;
  displayDate: string;
  title: string;
  excerpt: string;
};

export function News({ posts }: { posts: HomeNewsPost[] }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Coconut ground (--background): a light breathing band between the
           Leaf-Tint Offerings section above and the Evergreen Admissions
           band below, per the Coconut/Leaf-Tint/Evergreen alternation. */}
        <section
          id="news"
          aria-labelledby="news-heading"
          className="relative overflow-hidden border-t border-border bg-background text-foreground"
        >
          {/* Soft-geometry anchor: a thin gold ring, clear of the header and
             the news rows. Fine gold linework on a light ground is legal and
             decorative only, per the Gold-as-Detail Rule. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 -right-32 size-[26rem] rounded-full border border-secondary/25 sm:size-[32rem]"
          />

          <div className="relative mx-auto w-full max-w-[88rem] px-4 py-20 sm:px-6 sm:py-28 lg:px-4">
            {/* 1. Header -------------------------------------------------- */}
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <div className="flex flex-col gap-5">
                <m.p
                  variants={itemVariants}
                  className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
                >
                  News &amp; Announcements
                </m.p>
                <m.h2
                  id="news-heading"
                  variants={itemVariants}
                  className="text-balance font-serif text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[1.06] tracking-[-0.005em] text-grove-deep"
                >
                  What&rsquo;s happening at SJA
                </m.h2>
              </div>
              <m.a
                variants={itemVariants}
                href="/news"
                className="w-fit border-b-2 border-secondary pb-0.5 text-[15px] font-semibold text-primary transition-colors hover:text-grove-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                All announcements &rarr;
              </m.a>
            </m.div>

            {/* 2. News list ------------------------------------------------ */}
            <m.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              className="mt-12 flex flex-col sm:mt-16"
            >
              {posts.map(({ slug, displayDate, title, excerpt }, index) => (
                <m.div key={slug} variants={itemVariants}>
                  <a
                    href={`/news/${slug}`}
                    className={`group flex flex-col gap-3 rounded-2xl border-t border-border px-3 py-7 transition-colors transition-transform hover:translate-x-1 hover:bg-[#F1F6F1] focus-visible:translate-x-1 focus-visible:bg-[#F1F6F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:grid sm:grid-cols-[170px_1fr_40px] sm:items-baseline sm:gap-8 ${
                      index === posts.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-primary">
                      {displayDate}
                    </span>
                    <span className="flex flex-col gap-1.5">
                      <span className="font-serif text-2xl leading-tight text-foreground">
                        {title}
                      </span>
                      <span className="max-w-[60ch] text-pretty text-[15px] leading-relaxed text-muted-foreground">
                        {excerpt}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-xl text-primary transition-colors group-hover:text-grove-deep sm:justify-self-end"
                    >
                      &rarr;
                    </span>
                  </a>
                </m.div>
              ))}
            </m.div>
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
