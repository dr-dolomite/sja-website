"use client"

import * as React from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"

// Temporary placeholder photography — swap for real Guardian photos in
// public/images/hero/ once available. One exported data array so the deck can
// be re-pointed at real assets without touching component logic.
export const heroSlides = [
  {
    src: "/images/hero/guardians-classroom.webp",
    alt: "Guardians at work in the classroom",
  },
  {
    src: "/images/hero/guardians-walking.webp",
    alt: "Guardians walking to school together",
  },
  {
    src: "/images/hero/guardian-portrait.webp",
    alt: "A Guardian between classes",
  },
  {
    src: "/images/hero/guardians-together.webp",
    alt: "Guardians side by side",
  },
  {
    src: "/images/hero/guardians-basketball.webp",
    alt: "Guardians on the court",
  },
] as const

const AUTOPLAY_DELAY_MS = 4000

// Deck tuning. Each step away from the front shifts a card sideways by
// PEEK_PCT of *its own width* (percentage transforms scale with the card
// across breakpoints, so no per-breakpoint pixel math) and shrinks/dims it.
// With five photos, only the immediate neighbours peek (MAX_PEEK = 1): the
// card that wraps from one side to the other each step stays hidden while it
// crosses, so the loop never shows a card teleporting across the deck.
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
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [isHovered, setIsHovered] = React.useState(false)

  // Any deliberate navigation brings a photo to the front and hands control to
  // the visitor — autoplay stops until they press play again.
  const select = React.useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count)
      setIsPlaying(false)
    },
    [count]
  )

  // Autoplay advances the front card. It pauses while hovered and never runs
  // under reduced motion; the interval is torn down and rebuilt whenever any
  // of those conditions flips.
  React.useEffect(() => {
    if (reducedMotion || !isPlaying || isHovered) return
    const id = window.setInterval(
      () => setActive((current) => (current + 1) % count),
      AUTOPLAY_DELAY_MS
    )
    return () => window.clearInterval(id)
  }, [reducedMotion, isPlaying, isHovered, count])

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
    <div className="relative w-full">
      {/* The deck: every card is absolutely centred on the same point and
         pushed out / scaled down by its distance from the front. The active
         photo is shown whole — nothing is ever cropped by a viewport edge. */}
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Guardians at St. Joseph's Academy"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={onKeyDown}
        className="relative mx-auto aspect-[3/4] w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[350px]"
      >
        {heroSlides.map((slide, index) => {
          const diff = signedOffset(index, active, count)
          const distance = Math.abs(diff)
          const isActive = diff === 0
          const hidden = distance > MAX_PEEK

          const translate = -50 + diff * PEEK_PCT
          const scale = Math.max(0, 1 - distance * SCALE_STEP)
          const opacity = hidden ? 0 : Math.max(0, 1 - distance * OPACITY_STEP)

          return (
            <div
              key={slide.src}
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
                "absolute left-1/2 top-1/2 aspect-[3/4] w-full origin-center overflow-hidden rounded-2xl ring-1 ring-black/10 transition-[transform,opacity] ease-[var(--ease-out-expo)] will-change-transform",
                isActive
                  ? "shadow-2xl shadow-black/30"
                  : "cursor-pointer shadow-lg shadow-black/20"
              )}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 32vw, 60vw"
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                draggable={false}
              />
              {/* Peeked cards sit a step back into the grove — a soft scrim
                 deepens the stack and keeps the front photo dominant. */}
              {!isActive ? (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-grove-deep/25"
                />
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
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
                className="flex h-11 w-6 items-center justify-center"
              >
                <span
                  className={cn(
                    "h-2 rounded-full bg-primary/25 transition-[width,background-color]",
                    isActive ? "w-4 bg-primary" : "w-2"
                  )}
                />
              </button>
            )
          })}
        </div>

        {!reducedMotion ? (
          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-pressed={isPlaying}
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
        ) : null}
      </div>
    </div>
  )
}
