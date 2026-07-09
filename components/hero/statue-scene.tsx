"use client"

import dynamic from "next/dynamic"
import { useState, useSyncExternalStore } from "react"

// three.js/R3F must never enter the initial bundle: load client-only, no SSR.
const StatueCanvas = dynamic(() => import("./statue-canvas"), {
  ssr: false,
  loading: () => null, // Enhancement-not-gate: hero is complete without the statue
})

const CAPABLE_QUERY = "(min-width: 1024px) and (pointer: fine)"
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

interface SceneCapability {
  hydrated: boolean
  capable: boolean
  reducedMotion: boolean
}

const SERVER_SNAPSHOT: SceneCapability = { hydrated: false, capable: false, reducedMotion: false }

let webglSupportCache: boolean | null = null
function checkWebGLSupport(): boolean {
  if (webglSupportCache !== null) return webglSupportCache
  try {
    const canvas = document.createElement("canvas")
    webglSupportCache = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    )
  } catch {
    webglSupportCache = false
  }
  return webglSupportCache
}

// Module-level cache: computed lazily, only ever touched on the client.
let cachedSnapshot: SceneCapability = SERVER_SNAPSHOT

function computeSnapshot(): SceneCapability {
  return {
    hydrated: true,
    capable: window.matchMedia(CAPABLE_QUERY).matches && checkWebGLSupport(),
    reducedMotion: window.matchMedia(REDUCED_MOTION_QUERY).matches,
  }
}

// useSyncExternalStore (rather than a mount effect + setState) is the
// React-recommended way to read a browser-only external source like
// matchMedia: it serves SERVER_SNAPSHOT during SSR/hydration and switches to
// the real, live value on the client without a manual "mounted" effect.
function subscribe(onStoreChange: () => void) {
  const capabilityQuery = window.matchMedia(CAPABLE_QUERY)
  const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  const update = () => {
    cachedSnapshot = computeSnapshot()
    onStoreChange()
  }
  capabilityQuery.addEventListener("change", update)
  motionQuery.addEventListener("change", update)
  update() // resolve real values immediately once past hydration
  return () => {
    capabilityQuery.removeEventListener("change", update)
    motionQuery.removeEventListener("change", update)
  }
}

function getSnapshot(): SceneCapability {
  return cachedSnapshot
}

function useSceneCapability(): SceneCapability {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT)
}

interface StatueSceneProps {
  className?: string
}

export default function StatueScene({ className }: StatueSceneProps) {
  const { hydrated, capable, reducedMotion } = useSceneCapability()
  const [posterFailed, setPosterFailed] = useState(false)

  // Render nothing before hydration/first client render to avoid an
  // SSR/hydration mismatch — capability detection only makes sense client-side.
  if (!hydrated) return null

  return (
    <div aria-hidden="true" className={className} style={{ width: "100%", height: "100%" }}>
      {capable ? (
        <StatueCanvas reduced={reducedMotion} />
      ) : !posterFailed ? (
        // eslint-disable-next-line @next/next/no-img-element -- decorative client-only fallback poster; not worth next/image's overhead
        <img
          src="/images/st-joseph-poster.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={() => setPosterFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom center",
            display: "block",
          }}
        />
      ) : null}
    </div>
  )
}
