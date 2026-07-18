"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Same transform-only rise + stagger contract as the homepage sections
// (hero.tsx, news.tsx, ...): hidden state never touches opacity, content is
// fully painted server-side and only slides 24px into place.
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

export type GuardLineListPost = {
  slug: string;
  date: string;
  title: string;
  displayDate: string;
  excerpt: string;
  photo?: { src: string; alt: string; width: number; height: number };
};

export function GuardLineIndex({ posts }: { posts: GuardLineListPost[] }) {
  const [featured, ...rest] = posts;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <section
          aria-labelledby="guard-line-heading"
          className="relative overflow-hidden bg-background text-foreground"
        >
          {/* Decorative thin gold ring, per the Gold-as-Detail Rule. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 -right-32 size-[26rem] rounded-full border border-secondary/25 sm:size-[32rem]"
          />

          <div className="relative mx-auto w-full max-w-[88rem] px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-4">
            {/* Masthead: the page's single eyebrow kicker (interior density). */}
            <m.header
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex max-w-3xl flex-col gap-5"
            >
              <m.p
                variants={itemVariants}
                className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
              >
                News &amp; Announcements
              </m.p>
              <m.h1
                id="guard-line-heading"
                variants={itemVariants}
                className="text-balance font-serif text-[clamp(2.75rem,6.5vw,4.5rem)] leading-[1.04] tracking-[-0.005em] text-grove-deep"
              >
                The Guard Line
              </m.h1>
              <m.p
                variants={itemVariants}
                className="max-w-[60ch] text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]"
              >
                Stories and announcements from St. Joseph&rsquo;s Academy of
                Malinao, kept in one place for every Guardian family.
              </m.p>
            </m.header>

            {/* Featured: the latest story on a Leaf-Tint panel. */}
            {featured ? (
              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                className="mt-12 sm:mt-16"
              >
                <m.div variants={itemVariants}>
                  <Link
                    href={`/news/${featured.slug}`}
                    className={`group grid overflow-hidden rounded-[32px] bg-muted transition-shadow hover:shadow-[0_24px_48px_-24px_rgba(14,61,43,0.28)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/60${featured.photo ? " md:grid-cols-2" : ""}`}
                  >
                    <div className="flex flex-col justify-center gap-4 px-6 py-8 sm:px-10 sm:py-12">
                      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-primary">
                        <span>Latest</span>
                        <span className="sr-only">, </span>
                        <span
                          aria-hidden="true"
                          className="mx-3 inline-block h-px w-6 -translate-y-0.5 bg-secondary"
                        />
                        <time dateTime={featured.date}>{featured.displayDate}</time>
                      </p>
                      <h2 className="text-balance font-serif text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-grove-deep">
                        {featured.title}
                      </h2>
                      <p className="max-w-[55ch] text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
                        {featured.excerpt}
                      </p>
                      <span className="mt-1 w-fit border-b-2 border-secondary pb-0.5 text-[15px] font-semibold text-primary transition-colors group-hover:text-grove-deep">
                        Read the story &rarr;
                      </span>
                    </div>
                    {featured.photo ? (
                      <div className="relative order-first min-h-56 md:order-none md:min-h-80">
                        <Image
                          src={featured.photo.src}
                          alt={featured.photo.alt}
                          fill
                          sizes="(min-width: 768px) 44rem, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}
                  </Link>
                </m.div>
              </m.div>
            ) : (
              <p className="mt-14 max-w-[55ch] text-[16px] leading-relaxed text-muted-foreground">
                No announcements yet. Check back soon, or follow the school on
                Facebook for day-to-day updates.
              </p>
            )}

            {/* The rest: the established dated editorial row list. */}
            {rest.length > 0 ? (
              <m.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                className="mt-12 flex flex-col sm:mt-16"
              >
                {rest.map((post, index) => (
                  <m.div key={post.slug} variants={itemVariants}>
                    <Link
                      href={`/news/${post.slug}`}
                      className={`group flex flex-col gap-3 rounded-2xl border-t border-border px-3 py-7 transition-colors transition-transform hover:translate-x-1 hover:bg-accent focus-visible:translate-x-1 focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:grid sm:grid-cols-[170px_1fr_40px] sm:items-baseline sm:gap-8 ${
                        index === rest.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-primary">
                        {post.displayDate}
                      </span>
                      <span className="flex flex-col gap-1.5">
                        <span className="font-serif text-2xl leading-tight text-foreground">
                          {post.title}
                        </span>
                        <span className="max-w-[60ch] text-pretty text-[15px] leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-xl text-primary transition-colors group-hover:text-grove-deep sm:justify-self-end"
                      >
                        &rarr;
                      </span>
                    </Link>
                  </m.div>
                ))}
              </m.div>
            ) : null}
          </div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
