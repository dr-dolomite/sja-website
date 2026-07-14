"use client";

import Image from "next/image";
import { Award } from "lucide-react";

// Static imports so Next generates a real blurred placeholder for each photo
// at build time, matching the pattern the section this file replaces used:
// the large festival and Mass images fade up from their own blur instead of
// flashing blank white on a cold load.
import atiAtihanImg from "../../public/images/hero/sja-ati-atihan.jpg";
import faithMassImg from "../../public/images/sja-images/IMG_20260610_091810.jpg";
import guardiansImg from "../../public/images/hero/sja-new.jpg";
// PLACEHOLDER: temporary stand-in for the Humanitarian pillar until a real
// outreach / community-visit photo is provided. Swap this import for the real
// asset before launch. (Uses the graduation photo, not the church panorama,
// so it does not duplicate the Spiritual circle above.)
import outreachPlaceholderImg from "../../public/images/hero/sja-graduation.png";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  type Variants,
} from "motion/react";

// Shared stagger container for a beat's children (eyebrow, heading, body,
// photo). Identical to hero.tsx / vision-mission.tsx / core-values.tsx so
// every entrance across the homepage reads as one system.
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.1,
    },
  },
};

// Transform-only rise: hidden state never touches opacity, so every heading,
// paragraph, and photo paints at full opacity on first (server-rendered)
// frame and only slides the last 24px into place. Enhancement-Not-Gate: the
// section's meaning is legible before Motion ever runs.
const itemVariants: Variants = {
  hidden: { y: 24 },
  show: {
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// The dominant Communitarian band's photo gets its own transform-only reveal:
// a slight scale-down from 1.06 -> 1 (never opacity), so the immersive image
// still paints instantly and only settles into frame.
const bandImageVariants: Variants = {
  hidden: { scale: 1.06 },
  show: {
    scale: 1,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
};

export function LifeOfGuardians() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* Committed Green on the Coconut canvas: the section ground stays
           bg-background throughout. Green masses into two contained objects,
           the Spiritual panel and the Communitarian band, and the Invitation
           is Leaf-Tint instead so it never repeats green-on-green against the
           evergreen footer directly below.

           Structure mirrors the school's four-dimension holistic formation
           framework, in order: Academic, Spiritual, Communitarian,
           Humanitarian. */}
        <section
          aria-labelledby="life-heading"
          className="bg-background py-20 text-foreground sm:py-28"
        >
          {/* 1. Lead ------------------------------------------------------ */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="mx-auto flex w-full max-w-[88rem] flex-col gap-5 px-4 sm:px-6 lg:px-4"
          >
            <m.p
              variants={itemVariants}
              className="text-[13px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              Holistic Formation
            </m.p>
            <m.h2
              id="life-heading"
              variants={itemVariants}
              className="text-balance font-serif text-[clamp(2.25rem,4.8vw,3.5rem)] leading-[1.06] tracking-[-0.005em] text-grove-deep"
            >
              Formed{" "}
              <em className="font-medium italic text-primary">whole</em>, not
              just taught.
            </m.h2>
            <m.p
              variants={itemVariants}
              className="max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              A Guardian grows in four dimensions: academic, spiritual,
              communitarian, and humanitarian. This is what that looks like in
              an ordinary week at St. Joseph&rsquo;s.
            </m.p>
          </m.div>

          {/* 2. Academic — Coconut two-column row --------------------------- */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="mx-auto mt-16 flex w-full max-w-[88rem] flex-col gap-8 px-4 sm:mt-20 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-4"
          >
            <div className="flex flex-col gap-4 lg:order-1">
              <m.div variants={itemVariants} className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-secondary" />
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Academic
                </p>
              </m.div>
              <m.h3
                variants={itemVariants}
                className="text-balance font-serif text-3xl leading-tight tracking-normal text-grove-deep sm:text-4xl"
              >
                A path that asks their best
              </m.h3>
              <m.p
                variants={itemVariants}
                className="max-w-[60ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                From Grade 7 to Grade 12, Guardians follow the MATATAG and
                Strengthened Senior High curriculum, choosing the STEM, ASH,
                or BE track that fits where they are headed, in classes small
                enough that a teacher still learns every name.
              </m.p>
              {/* The section's single gold detail: ONE Piña Gold Award icon
                 paired with one strong line, not a bulleted list, so gold
                 stays the lone highlight moment (Gold-as-Detail). The other
                 honors live further down, in the Communitarian beat, as
                 showing-proof rather than a second trophy cluster. */}
              <m.div
                variants={itemVariants}
                className="flex items-center gap-2.5 pt-1"
              >
                <Award
                  aria-hidden="true"
                  className="size-5 shrink-0 text-secondary"
                />
                <p className="text-base font-semibold text-foreground sm:text-lg">
                  Ten Guardians are named Top 10 Outstanding Students every
                  year, chosen by interview, not by grades alone.
                </p>
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

          {/* 3. Spiritual — contained solid-Evergreen panel + blob photo ---- */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="mx-auto mt-20 w-full max-w-[88rem] px-4 sm:mt-24 sm:px-6 lg:px-4"
          >
            <div className="relative overflow-hidden rounded-[32px] bg-grove-deep px-6 py-12 text-grove-foreground sm:px-10 sm:py-20 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-16 lg:py-24">
              {/* Barely-there gold glow in the panel's open corner, per
                 Soft-Geometry. Decorative only. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(60% 55% at 92% 8%, color-mix(in oklch, var(--secondary), transparent 90%), transparent 70%)",
                }}
              />
              <m.div
                variants={itemVariants}
                className="relative order-2 mx-auto mt-10 aspect-square w-full max-w-md lg:order-1 lg:mx-0 lg:mt-0"
              >
                {/* Concentric gold halo: a deliberate aureole tracing the
                   circular Mass portrait, giving the foundational Faith beat a
                   quiet focal weight. Fine gold linework only, decorative. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-3 rounded-full border border-secondary/30 sm:-inset-4"
                />
                {/* Symmetrical circle mask (was an organic blob). */}
                <div className="relative size-full overflow-hidden rounded-full">
                  <Image
                    src={faithMassImg}
                    alt="The St. Joseph's Academy community gathered with their bishop for Mass in the parish church"
                    fill
                    sizes="(min-width: 1024px) 38vw, 88vw"
                    quality={72}
                    placeholder="blur"
                    className="object-cover"
                  />
                </div>
              </m.div>

              <div className="relative order-1 flex flex-col gap-4 lg:order-2">
                <m.p
                  variants={itemVariants}
                  className="text-[13px] font-semibold uppercase tracking-[0.22em] text-secondary"
                >
                  Spiritual
                </m.p>
                <m.h3
                  variants={itemVariants}
                  className="text-balance font-serif text-3xl leading-tight tracking-normal text-grove-foreground sm:text-4xl"
                >
                  Faith, lived together
                </m.h3>
                <m.p
                  variants={itemVariants}
                  className="max-w-[52ch] text-pretty text-base leading-relaxed text-grove-foreground/90 sm:text-lg"
                >
                  Faith here is not a subject on the timetable. It is the whole
                  school gathered in one church for First Friday Mass, the hush
                  of the annual recollection, and prayer that begins an ordinary
                  morning.
                </m.p>
                <m.p
                  variants={itemVariants}
                  className="max-w-[52ch] text-pretty text-base leading-relaxed text-grove-foreground/90 sm:text-lg"
                >
                  It is the ground the other three dimensions grow from. Before
                  a Guardian is a scholar, an athlete, or a volunteer, they are
                  formed to live what they believe, with the Diocese of Kalibo
                  behind them.
                </m.p>
              </div>
            </div>
          </m.div>

          {/* 4. Communitarian — dominant, full-bleed band ------------------- */}
          <div className="relative mt-20 min-h-[70svh] w-full overflow-hidden sm:mt-24 lg:min-h-[78svh]">
            <m.div
              variants={bandImageVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              className="absolute inset-0"
            >
              <Image
                src={atiAtihanImg}
                alt="Guardians costumed in full regalia for the Ati-Atihan festival"
                fill
                sizes="100vw"
                quality={72}
                placeholder="blur"
                // Anchor the crop toward the top of the frame so the upper
                // portion of the festival face is no longer clipped.
                className="object-cover object-[center_22%]"
              />
            </m.div>
            {/* Two scrims, bottom-anchored to INK rather than a full grove-deep
               wash, so the festival's color stays vivid through the top two
               thirds of the photo and only the text base darkens. This keeps
               the band from reading as a second solid-evergreen section (that
               is the Spiritual panel's job above).
               - Mobile: text is full-width and bottom-anchored, so a strong
                 bottom-up scrim covers the whole text region.
               - lg+: text sits in a left column, vertically centered, so a
                 left-anchored horizontal scrim covers the entire measure at
                 any height while the color on the right stays visible. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 lg:hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to top, color-mix(in oklch, var(--foreground), transparent 4%) 0%, color-mix(in oklch, var(--foreground), transparent 12%) 34%, color-mix(in oklch, var(--foreground), transparent 58%) 60%, transparent 84%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 hidden lg:block"
              style={{
                backgroundImage:
                  "linear-gradient(to right, color-mix(in oklch, var(--foreground), transparent 5%) 0%, color-mix(in oklch, var(--foreground), transparent 14%) 44%, color-mix(in oklch, var(--foreground), transparent 60%) 62%, transparent 86%)",
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
              className="absolute inset-0 mx-auto flex w-full max-w-[88rem] items-end px-4 pb-12 pt-16 sm:px-6 lg:items-center lg:px-4 lg:py-12"
            >
              <div className="flex max-w-xl flex-col gap-3">
                <m.p
                  variants={itemVariants}
                  className="text-[13px] font-semibold uppercase tracking-[0.22em] text-grove-foreground/80"
                >
                  Communitarian
                </m.p>
                <m.h3
                  variants={itemVariants}
                  className="text-balance font-serif text-3xl leading-tight tracking-normal text-grove-foreground sm:text-4xl"
                >
                  Rooted in the town that raised them
                </m.h3>
                <m.p
                  variants={itemVariants}
                  className="max-w-[55ch] text-pretty text-base leading-relaxed text-grove-foreground/90 sm:text-lg"
                >
                  Guardians grow up inside the life of Malinao: the town
                  Daigon, the Ati-Atihan, Foundation Day, and the CEAP
                  Inter-Catholic League. It is where they carry the
                  school&rsquo;s name out into the world.
                </m.p>
                <m.p
                  variants={itemVariants}
                  className="max-w-[55ch] text-pretty text-base leading-relaxed text-grove-foreground/90 sm:text-lg"
                >
                  Five straight years as LGU Daigon choir champion. Honors in
                  the CEAP Inter-Catholic League, in sports and the cultural
                  competitions. A Guardian who reached the Palarong Pambansa,
                  and December&rsquo;s Battle of the Bands title.
                </m.p>
              </div>
            </m.div>
          </div>

          {/* 5. Humanitarian — Coconut two-column row ----------------------- */}
          {/* PLACEHOLDER IMAGE: the photo below is a temporary stand-in
             (whole-school shot). Swap outreachPlaceholderImg for a real
             outreach/community-visit photo before launch. Tracked with the
             footer/core-values placeholders. */}
          <m.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            className="mx-auto mt-24 flex w-full max-w-[88rem] flex-col gap-8 px-4 sm:mt-28 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-4"
          >
            {/* Photo left on desktop (alternates from Academic's photo-right),
               copy first in the DOM so mobile still reads copy then photo. */}
            <div className="flex flex-col gap-4 lg:order-2">
              <m.div variants={itemVariants} className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-secondary" />
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Humanitarian
                </p>
              </m.div>
              <m.h3
                variants={itemVariants}
                className="text-balance font-serif text-3xl leading-tight tracking-normal text-grove-deep sm:text-4xl"
              >
                Service beyond the gate
              </m.h3>
              <m.p
                variants={itemVariants}
                className="max-w-[60ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                Formation is not finished until it turns outward. Guardians run
                outreach programs and visit communities in need, carrying help,
                presence, and the school&rsquo;s care to families beyond the
                campus. It is where selfless stops being a word on the wall and
                becomes something a Guardian does.
              </m.p>
            </div>
            <m.div
              variants={itemVariants}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl lg:order-1"
            >
              <Image
                src={outreachPlaceholderImg}
                alt="Placeholder: St. Joseph's Academy Guardians at their graduation with faculty and clergy"
                fill
                sizes="(min-width: 1024px) 42vw, 92vw"
                quality={72}
                placeholder="blur"
                className="object-cover"
              />
            </m.div>
          </m.div>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
