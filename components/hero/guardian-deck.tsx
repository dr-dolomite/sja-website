"use client"

import * as React from "react"
import Image, { type StaticImageData } from "next/image"
import { Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"

// Static imports so Next generates a real blurred placeholder per photo — the
// priority LCP card fades up from its own blur instead of flashing blank white
// on a cold load, and the lazy cards do the same as they enter.
import selflessVoicesImg from "../../public/images/hero/selfless-voices.jpg"
import basketballImg from "../../public/images/hero/sja-mens-basketball.png"
import graduationImg from "../../public/images/hero/sja-graduation.png"
import atiAtihanImg from "../../public/images/hero/sja-ati-atihan.jpg"
import promImg from "../../public/images/hero/sja-prom.jpg"
import wholeImg from "../../public/images/hero/sja-whole.jpg"

// Real Guardian photography from St. Joseph's Academy. One exported data array
// so the deck can be re-pointed at new assets without touching component logic.
// The deck frame is portrait (3:4); `objectPosition` sets a per-photo focal
// point so the landscape shots crop around their subjects instead of blindly
// centring. Native-portrait photos omit it and fall back to centre.
type HeroSlide = {
  src: StaticImageData
  alt: string
  objectPosition?: string
}

export const heroSlides: HeroSlide[] = [
  {
    src: selflessVoicesImg,
    alt: "Guardians of the school choir celebrate their Catholic League championship, certificates and medals in hand.",
  },
  {
    src: basketballImg,
    alt: "Guardians of the school basketball team.",
    objectPosition: "center"
  },
  {
    src: graduationImg,
    alt: "Graduating Guardians in green and gold gowns with faculty and the parish priest at commencement.",
    objectPosition: "center",
  },
  {
    src: atiAtihanImg,
    alt: "A Guardian in full Ati-Atihan festival regalia, painted and adorned in native Aklan materials.",
    objectPosition: "center",
  },
  {
    src: promImg,
    alt: "Guardians crowned Prom King and Queen in masquerade finery.",
    objectPosition: "center",
  },
  {
    src: wholeImg,
    alt: "A group of Guardians in the school uniform, smiling and posing for a photo.",
    objectPosition: "center 50%",
  }
]

// 6.5s (was 4s) so the peak photos hold long enough for a parent to dwell, and
// so the coverflow stops feeling busy alongside the always-on affiliation
// marquee above it. The first advance lands well after the entrance settles.
const AUTOPLAY_DELAY_MS = 6500

// Calm-on-load hold: the deck stays still for this long after mount before it
// arms autoplay, so the first impression of the fold is quiet (only the slow
// marquee and the badge greeting move) and the photo tour begins deliberately
// once the entrance has settled — not the instant the page paints. Applied
// once; hover/pause afterwards resume at the normal cadence, never re-trigger
// this hold. Reduced motion never arms, so it is moot there.
const AUTOPLAY_START_DELAY_MS = 3600

// The deck "fans open" on entrance: cards start stacked on the front card's
// spot, then spread into coverflow once ENTER_DELAY_MS elapses (letting the
// wrapper's grow animation land first). Reduced motion skips straight to open.
const ENTER_DELAY_MS = 260

// Deck tuning. Each step away from the front shifts a card sideways by
// PEEK_PCT of *its own width* (percentage transforms scale with the card
// across breakpoints, so no per-breakpoint pixel math) and shrinks/dims it.
// Only the immediate neighbours peek (MAX_PEEK = 1); every card further round
// the deck stays hidden while it crosses, so the loop never shows a card
// teleporting across the stack, whatever the photo count.
const PEEK_PCT = 23
const SCALE_STEP = 0.1
const OPACITY_STEP = 0.15
const MAX_PEEK = 1

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onStoreChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener("change", onStoreChange)
  return () => query.removeEventListener("change", onStoreChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function useReducedMotionQuery() {
  // Server snapshot is false so first paint never gates on it; React swaps in
  // the real client value right after hydration without a markup mismatch.
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  )
}

// Signed distance from the active card, wrapped to the shortest way round the
// deck so the peek is symmetric — earlier photos to the left, later to the
// right — and the loop has no seam.
function signedOffset(index: number, active: number, count: number) {
  let diff = index - active
  if (diff > count / 2) diff -= count
  if (diff < -count / 2) diff += count
  return diff
}

export function GuardianDeck() {
  const reducedMotion = useReducedMotionQuery()
  const count = heroSlides.length
  const [active, setActive] = React.useState(0)
  const [isEngaged, setIsEngaged] = React.useState(false)
  // Explicit, always-visible stop (the pause button below). Distinct from the
  // hover/focus engagement pause: once a visitor pauses, leaving the deck does
  // not resume it. This is the touch-friendly control the old design lacked.
  const [isPaused, setIsPaused] = React.useState(false)
  // Fan-open gate. Starts false on server and first client paint (so markup
  // matches, no hydration mismatch), then flips true to spread the cards.
  const [entered, setEntered] = React.useState(false)
  // Autoplay-arm gate. Held false until AUTOPLAY_START_DELAY_MS after mount so
  // the deck is still on load (calm fold), then armed once. Kept separate from
  // the engagement/pause state below so a hover never re-triggers the initial
  // hold — only the very first start is delayed.
  const [autoplayArmed, setAutoplayArmed] = React.useState(false)

  // Flip `entered` after mount so the CSS transition animates from the stacked
  // state into coverflow. Reduced motion opens immediately (snaps, no spread).
  React.useEffect(() => {
    // Reduced motion opens on the next tick (0ms) so it snaps with no spread;
    // everyone else waits ENTER_DELAY_MS so the fan-open transition can play.
    // Deferring via timeout (never a synchronous setState here) also keeps the
    // effect from triggering a cascading render.
    const id = window.setTimeout(
      () => setEntered(true),
      reducedMotion ? 0 : ENTER_DELAY_MS
    )
    return () => window.clearTimeout(id)
  }, [reducedMotion])

  // Any deliberate navigation brings a photo to the front. There is no
  // play/pause control: autoplay simply pauses whenever the visitor is engaged
  // with the deck (hovering or keyboard-focused) and resumes when they leave.
  const select = React.useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count)
    },
    [count]
  )

  // One-shot initial hold: arm autoplay only after the deck has sat still for
  // AUTOPLAY_START_DELAY_MS, so the fold is calm on load. Reduced motion never
  // arms (autoplay is disabled there anyway). Runs once per mount.
  React.useEffect(() => {
    if (reducedMotion) return
    const id = window.setTimeout(() => setAutoplayArmed(true), AUTOPLAY_START_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [reducedMotion])

  // Autoplay advances the front card once armed. It pauses while the visitor is
  // engaged (hover or focus), while explicitly paused, and never runs under
  // reduced motion — the engagement pause plus the pause button are the WCAG
  // 2.2.2 stop mechanisms. The interval is torn down and rebuilt whenever any
  // of those conditions flips; `autoplayArmed` only gates the very first start.
  React.useEffect(() => {
    if (reducedMotion || !autoplayArmed || isEngaged || isPaused) return
    const id = window.setInterval(
      () => setActive((current) => (current + 1) % count),
      AUTOPLAY_DELAY_MS
    )
    return () => window.clearInterval(id)
  }, [reducedMotion, autoplayArmed, isEngaged, isPaused, count])

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        select(active - 1)
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        select(active + 1)
      }
    },
    [active, select]
  )

  return (
    <div
      className="relative w-full"
      // Engagement pause: hovering or moving keyboard focus anywhere inside the
      // deck (cards or dots) stops autoplay; leaving resumes it. This is the
      // accessible stop mechanism that replaces the old play/pause button.
      onMouseEnter={() => setIsEngaged(true)}
      onMouseLeave={() => setIsEngaged(false)}
      onFocusCapture={() => setIsEngaged(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsEngaged(false)
        }
      }}
    >
      {/* The deck: every card is absolutely centred on the same point and
         pushed out / scaled down by its distance from the front. The active
         photo is shown whole — nothing is ever cropped by a viewport edge. */}
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Guardians at St. Joseph's Academy. Use the left and right arrow keys to browse."
        tabIndex={0}
        onKeyDown={onKeyDown}
        // Focusable so the arrow-key handler can actually fire: without a tab
        // stop nothing inside the deck could take focus and the keydown never
        // reached it. Green focus ring reads on the Coconut canvas.
        className="relative mx-auto aspect-[3/4] w-full max-w-[260px] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:max-w-[300px] lg:max-w-[380px]"
      >
        {heroSlides.map((slide, index) => {
          const diff = signedOffset(index, active, count)
          const distance = Math.abs(diff)
          const isActive = diff === 0
          const hidden = distance > MAX_PEEK

          // Resting coverflow position for this card.
          const spreadTranslate = -50 + diff * PEEK_PCT
          const spreadScale = Math.max(0, 1 - distance * SCALE_STEP)
          const spreadOpacity = hidden
            ? 0
            : Math.max(0, 1 - distance * OPACITY_STEP)

          // Before the deck fans open every card is stacked on the front card's
          // spot: neighbours sit centred at 0 opacity, then the shared 600ms
          // transition spreads and fades them into coverflow. The active photo
          // stays full-size, full-opacity the whole time so the LCP image is
          // never gated behind the reveal.
          const translate = entered ? spreadTranslate : -50
          const scale = entered ? spreadScale : isActive ? 1 : 0.94
          const opacity = entered ? spreadOpacity : isActive ? 1 : 0

          return (
            <div
              key={slide.src.src}
              aria-hidden={!isActive}
              aria-label={`${index + 1} of ${count}`}
              onClick={isActive ? undefined : () => select(index)}
              style={{
                transform: `translate(${translate}%, -50%) scale(${scale})`,
                opacity,
                zIndex: count - distance,
                transitionDuration: reducedMotion ? "0ms" : "600ms",
                pointerEvents: hidden ? "none" : "auto",
              }}
              className={cn(
                "group/card absolute left-1/2 top-1/2 aspect-[3/4] w-full origin-center overflow-hidden rounded-2xl ring-1 ring-black/5 transition-[transform,opacity] ease-[var(--ease-out-expo)] will-change-transform",
                isActive
                  ? "shadow-2xl shadow-black/40"
                  : "cursor-pointer shadow-lg shadow-black/30 hover:ring-2 hover:ring-primary/40"
              )}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 32vw, 60vw"
                className="object-cover"
                style={{ objectPosition: slide.objectPosition }}
                placeholder="blur"
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                draggable={false}
              />
              {/* Peeked cards sit a step back — a soft off-white wash fades
                 them toward the canvas (atmospheric recession) so the front
                 photo stays dominant on the light surface. On hover the wash
                 lifts (0.55 -> 0.25), brightening the neighbour so it reads as
                 clickable — the affordance the passive peeked cards lacked. */}
              {!isActive ? (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-background/55 transition-colors duration-300 group-hover/card:bg-background/25"
                />
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Compact indicator row on the Coconut canvas: the visible dots stay
         legible (ink at rest, Palm when active), but the tap targets
         shrink to h-7 (28px, still clears the 24px WCAG 2.5.8 minimum) and the
         top margin tightens so the controls stay quiet under the photos. */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {/* Explicit, always-visible autoplay stop, the touch-friendly control
           the deck was missing. Quiet at rest (muted glyph), Palm
           only on hover/focus so it never competes with the CTA. Reduced-motion
           visitors have no autoplay, so the button is hidden for them. */}
        {!reducedMotion ? (
          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            aria-pressed={isPaused}
            className="mr-1 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isPaused ? (
              <Play className="size-3.5" fill="currentColor" />
            ) : (
              <Pause className="size-3.5" fill="currentColor" />
            )}
          </button>
        ) : null}
        <div
          className="flex items-center gap-1.5"
          role="tablist"
          aria-label="Choose slide"
        >
        {heroSlides.map((_, index) => {
          const isActive = index === active
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive}
              aria-selected={isActive}
              onClick={() => select(index)}
              className="flex h-7 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span
                className={cn(
                  "h-2 rounded-full bg-foreground/25 transition-[width,background-color]",
                  isActive ? "w-4 bg-primary" : "w-2"
                )}
              />
            </button>
          )
        })}
        </div>
      </div>
    </div>
  )
}
