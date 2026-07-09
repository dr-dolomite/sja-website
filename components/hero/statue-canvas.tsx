"use client"

import { Suspense, useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Center, useGLTF } from "@react-three/drei"
import * as THREE from "three"

const MODEL_PATH = "/models/st-joseph.glb"

// Normalized statue height (world units) after centering — the raw scan's
// bounding box is arbitrary (~999 units tall), so we measure it at runtime
// and scale to this instead of hardcoding a magic factor.
const TARGET_HEIGHT = 2.6

// Three-quarter portrait framing: camera sits slightly below the statue's
// eye-line and off-center so the gaze reads as looking slightly down at the
// viewer (dignity), while the offset x gives the three-quarter angle.
// NEEDS IN-BROWSER VERIFICATION against the actual scan orientation.
const CAMERA_POSITION: [number, number, number] = [0.7, 0.75, 5.2]
const CAMERA_TARGET: [number, number, number] = [0, 0.15, 0]
const CAMERA_FOV = 28

// Corrective rest rotation for the raw scan's baked-in tilt (FBX export used
// an unsupported transform-inheritance mode, so the source lean survives):
// -0.48 rad Z uprights the figure, -1.15 rad Y turns it from profile to a
// three-quarter face toward the viewer. Verified visually in-browser.
const MODEL_REST_ROTATION: [number, number, number] = [0, -1.15, -0.48]

const ENTRANCE_DURATION = 0.8 // seconds
const ENTRANCE_FROM_SCALE = 0.97
const IDLE_SWAY_PERIOD = 12 // seconds, full oscillation cycle
const IDLE_SWAY_AMPLITUDE = 0.06 // rad
const PARALLAX_Y_AMPLITUDE = 0.08 // rad
const PARALLAX_X_AMPLITUDE = 0.03 // rad
const DAMP_LAMBDA = 4

function Lighting() {
  return (
    <>
      {/* Faint green-tinted ground bounce so the statue doesn't look lit in
          a vacuum against the deep green hero background. */}
      <hemisphereLight args={["#f7f2e2", "#1f3d2b", 1.1]} />
      {/* Photogrammetry scans bake their own lighting into the texture —
          the baked albedo runs dark, so total light here is deliberately
          bright to keep the figure warm and legible against the deep green. */}
      <ambientLight intensity={1.7} />
      {/* Warm gold key light, upper front-left. */}
      <directionalLight position={[-2.6, 3.4, 3]} intensity={2.2} color="#f5d67a" />
      {/* Cool faint rim/fill from behind-right, separates silhouette from the green. */}
      <directionalLight position={[2.2, 1.4, -3]} intensity={0.8} color="#bcd9d6" />
    </>
  )
}

function StatueModel({
  reduced,
  modelRotation = MODEL_REST_ROTATION,
  targetHeight = TARGET_HEIGHT,
}: {
  reduced: boolean
  modelRotation?: [number, number, number]
  targetHeight?: number
}) {
  // drei's useGLTF wires three-stdlib's MeshoptDecoder automatically when the
  // 3rd argument (useMeshopt) is true — which is also its default. This GLB
  // was compressed with EXT_meshopt_compression (not Draco), so we pass
  // useDraco=false to skip the unnecessary DRACOLoader and rely on the
  // built-in meshopt wiring rather than re-implementing it by hand.
  const { scene } = useGLTF(MODEL_PATH, false, true)

  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    return size.y > 0 ? targetHeight / size.y : 1
  }, [scene, targetHeight])

  const groupRef = useRef<THREE.Group>(null)
  const mountTimeRef = useRef<number | null>(null)

  useFrame((state, delta) => {
    const group = groupRef.current
    if (!group || reduced) return // reduced motion: static rest pose, no updates

    if (mountTimeRef.current === null) {
      mountTimeRef.current = state.clock.elapsedTime
    }

    const entranceElapsed = state.clock.elapsedTime - mountTimeRef.current
    const entranceT = Math.min(entranceElapsed / ENTRANCE_DURATION, 1)
    const eased = 1 - Math.pow(1 - entranceT, 3)
    group.scale.setScalar(ENTRANCE_FROM_SCALE + eased * (1 - ENTRANCE_FROM_SCALE))

    const idleSwayY =
      Math.sin(state.clock.elapsedTime * ((Math.PI * 2) / IDLE_SWAY_PERIOD)) *
      IDLE_SWAY_AMPLITUDE
    const targetY = idleSwayY + state.pointer.x * PARALLAX_Y_AMPLITUDE
    const targetX = -state.pointer.y * PARALLAX_X_AMPLITUDE

    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetY, DAMP_LAMBDA, delta)
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetX, DAMP_LAMBDA, delta)
  })

  return (
    <group ref={groupRef} scale={reduced ? 1 : ENTRANCE_FROM_SCALE}>
      {/* Rest-pose correction sits inside the animated group so idle sway /
          parallax rotate around the corrected upright pose. Center wraps the
          rotated model so centering accounts for the corrected bounds. */}
      <Center scale={scale}>
        <group rotation={modelRotation}>
          <primitive object={scene} />
        </group>
      </Center>
    </group>
  )
}

interface StatueCanvasProps {
  reduced?: boolean
  modelRotation?: [number, number, number]
  targetHeight?: number
  cameraPosition?: [number, number, number]
  cameraTarget?: [number, number, number]
  cameraFov?: number
  preserveDrawingBuffer?: boolean
}

export default function StatueCanvas({
  reduced = false,
  modelRotation,
  targetHeight,
  cameraPosition = CAMERA_POSITION,
  cameraTarget = CAMERA_TARGET,
  cameraFov = CAMERA_FOV,
  preserveDrawingBuffer = false,
}: StatueCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer }}
      camera={{ position: cameraPosition, fov: cameraFov, near: 0.1, far: 50 }}
      frameloop={reduced ? "demand" : "always"}
      style={{ width: "100%", height: "100%", display: "block" }}
      onCreated={({ gl, scene, camera }) => {
        gl.setClearAlpha(0)
        scene.background = null
        camera.lookAt(...cameraTarget)
      }}
    >
      <Lighting />
      {/* Enhancement-not-gate: nothing renders here until the model is
          ready; the transparent canvas lets the hero's own content show
          through, so the page is never blocked on this loading. */}
      <Suspense fallback={null}>
        <StatueModel
          reduced={reduced}
          modelRotation={modelRotation}
          targetHeight={targetHeight}
        />
      </Suspense>
    </Canvas>
  )
}

// Preloading must happen only inside this module (itself dynamically
// imported with ssr:false by statue-scene.tsx) so three.js never enters the
// initial bundle.
useGLTF.preload(MODEL_PATH, false, true)
