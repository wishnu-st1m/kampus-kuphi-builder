import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState, Suspense } from "react";
import * as THREE from "three";

// Preload GLB models so swap from clay → realistic is instant.
useGLTF.preload("/models/bean.glb");
useGLTF.preload("/models/machine.glb");
useGLTF.preload("/models/cup.glb");

/**
 * Clay-style 3D coffee journey scene.
 * Driven by external scroll progress (0..1).
 * Supports an "eco" mode that lowers dpr, disables shadows/env for low-end devices.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, mn = 0, mx = 1) => Math.min(mx, Math.max(mn, v));

// Soft clay palette
const CLAY = {
  bean: "#5a2e1a",
  beanHi: "#8b4a2b",
  body: "#f5e6d3",
  bodyDark: "#d9b896",
  metal: "#cfd2d6",
  metalDark: "#8a8f96",
  espresso: "#3a1f10",
  crema: "#c9874a",
  cup: "#fff8ee",
  cupRim: "#e9d6bd",
  saucer: "#f1ddc2",
  accent: "#e0793a",
};

type SceneProps = { progress: number };

/** Probe GPU renderer string via WEBGL_debug_renderer_info. Returns lowercased name or "". */
const probeGPU = (): { renderer: string; tier: "low" | "mid" | "high" } => {
  if (typeof document === "undefined") return { renderer: "", tier: "mid" };
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return { renderer: "", tier: "low" }; // no webgl → definitely eco
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const raw = ext ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string) : "";
    const r = (raw || "").toLowerCase();

    // Heuristic tiers based on common GPU substrings
    const lowHints = [
      "swiftshader", "llvmpipe", "software", "mali-4", "mali-t6", "mali-t7",
      "mali-g31", "mali-g51", "mali-g52", "mali-g57",
      "adreno (3", "adreno (4", "adreno (5", "adreno (61", "adreno (62",
      "powervr sgx", "powervr ge", "intel(r) hd graphics 4", "intel hd graphics 4",
      "videocore", "tegra 3", "tegra 4",
    ];
    const highHints = [
      "rtx", "radeon rx", "radeon pro", "apple m", "apple a1", "apple a2",
      "adreno (7", "adreno (8", "mali-g78", "mali-g710", "mali-g715",
      "geforce gtx 16", "geforce gtx 20", "geforce gtx 30", "geforce gtx 40",
      "intel iris", "intel(r) iris",
    ];
    if (lowHints.some((h) => r.includes(h))) return { renderer: r, tier: "low" };
    if (highHints.some((h) => r.includes(h))) return { renderer: r, tier: "high" };
    return { renderer: r, tier: "mid" };
  } catch {
    return { renderer: "", tier: "mid" };
  }
};

/** Detect low-end device → eco mode by default */
const detectEco = (): boolean => {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData === true;
  const slowNet = /(^|-)(2g|slow-2g)$/.test(nav.connection?.effectiveType ?? "");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Screen-size signals (use both CSS px and physical px)
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  const physicalPixels = w * h * dpr * dpr;
  const isSmallScreen = w <= 480; // small phones
  const isMobile = w <= 768;
  const isHugeRender = physicalPixels > 4_000_000; // e.g. retina laptop / tablet — heavy fillrate

  // GPU signal
  const gpu = probeGPU();

  // Hard eco triggers ONLY — keep realistic by default
  if (saveData || slowNet || reduceMotion) return true;
  if (gpu.tier === "low") return true;
  if (cores <= 2 || mem <= 2) return true;
  // Very small phones with non-high GPU → eco
  if (isSmallScreen && gpu.tier !== "high" && mem <= 4) return true;
  return false;
};

export const Hero3DScene = ({ progress }: SceneProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [eco, setEco] = useState<boolean>(() => detectEco());
  const [inView, setInView] = useState(true);

  // Pause rendering when hero is offscreen
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Responsive camera tuning — small screens need wider FOV / further dolly
  const isSmall = typeof window !== "undefined" && window.innerWidth < 640;
  const fov = isSmall ? 46 : 38;
  const camZ = isSmall ? 5.6 : 5;

  return (
    <div ref={wrapperRef} className="relative w-full h-full">
      <Canvas
        shadows={!eco}
        dpr={eco ? [1, 1.25] : [1, 1.75]}
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 0.4, camZ], fov }}
        gl={{
          antialias: !eco,
          alpha: true,
          powerPreference: eco ? "low-power" : "high-performance",
        }}
        performance={{ min: 0.5 }}
        style={{ background: "transparent" }}
      >
        <SceneContent progress={progress} eco={eco} />
      </Canvas>

      {/* Eco toggle */}
      <button
        type="button"
        onClick={() => setEco((v) => !v)}
        aria-pressed={eco}
        title={eco ? "Mode Hemat aktif — tap untuk kualitas penuh" : "Aktifkan Mode Hemat"}
        className="absolute bottom-3 right-3 z-30 pointer-events-auto px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-background/70 backdrop-blur-md border border-coffee-dark/20 text-coffee-dark hover:bg-background/90 transition-colors"
      >
        {eco ? "⚡ Mode Hemat" : "✨ Kualitas Penuh"}
      </button>
    </div>
  );
};

const SceneContent = ({ progress, eco }: SceneProps & { eco: boolean }) => {
  // smoothed progress
  const smooth = useRef(progress);
  useFrame(() => {
    smooth.current = lerp(smooth.current, progress, 0.15);
  });

  const shadowSize = eco ? 512 : 1024;

  return (
    <>
      {/* Lighting — soft clay look */}
      <ambientLight intensity={eco ? 0.75 : 0.55} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={eco ? 1.4 : 1.6}
        castShadow={!eco}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-4, 2, -2]} intensity={0.4} color="#ffd9a8" />
      {!eco && <Environment preset="sunset" />}

      <CameraRig progressRef={smooth} />

      <Suspense fallback={null}>
        <group position={[0, -0.2, 0]}>
          <Bean progressRef={smooth} eco={eco} />
          <Grinder progressRef={smooth} />
          <Machine progressRef={smooth} eco={eco} />
          <Pour progressRef={smooth} />
          <Cup progressRef={smooth} eco={eco} />
        </group>
      </Suspense>

      {!eco && (
        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.35}
          scale={8}
          blur={2.6}
          far={2}
          color="#3a1f10"
        />
      )}
    </>
  );
};

type RigProps = { progressRef: React.MutableRefObject<number> };
type StageProps = RigProps & { eco?: boolean };

const CameraRig = ({ progressRef }: RigProps) => {
  useFrame((state) => {
    const p = progressRef.current;
    // Camera glides slightly to follow active object on Y axis
    const y = lerp(0.4, 0.1, p);
    const z = lerp(5, 4.4, Math.sin(p * Math.PI));
    state.camera.position.x = lerp(state.camera.position.x, Math.sin(p * Math.PI * 2) * 0.25, 0.1);
    state.camera.position.y = lerp(state.camera.position.y, y, 0.1);
    state.camera.position.z = lerp(state.camera.position.z, z, 0.1);
    state.camera.lookAt(0, lerp(0.1, -0.1, p), 0);
  });
  return null;
};

const subProg = (p: number, i: number, stages = 5) => clamp(p * stages - i);

/** Loads a GLB and applies cast/receive shadow + soft material upgrade. */
const RealisticModel = ({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: {
  url: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) => {
  const { scene } = useGLTF(url);
  const cloned = useRef<THREE.Group>();
  if (!cloned.current) {
    cloned.current = scene.clone(true);
    cloned.current.traverse((obj) => {
      const m = obj as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && "roughness" in mat) {
          mat.envMapIntensity = 0.9;
        }
      }
    });
  }
  return (
    <primitive
      object={cloned.current}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
};

/* ---------- Bean (stage 0 -> 1) ---------- */
const Bean = ({ progressRef, eco = true }: StageProps) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current;
    const s0 = subProg(p, 0);
    const s1 = subProg(p, 1);
    const visible = s0 * (1 - s1);
    // drop in, then move up & shrink toward grinder hopper
    const yIn = lerp(3, 0.2, s0);
    const yOut = lerp(0, 1.4, s1);
    ref.current.position.set(0, yIn + yOut, 0);
    const scale = lerp(1, 0.25, s1) * (visible > 0.02 ? 1 : 0);
    ref.current.scale.setScalar(scale);
    ref.current.rotation.y += 0.01;
    ref.current.rotation.z = lerp(-0.3, 0.5, s0) + s1 * 2;
    (ref.current as any).visible = visible > 0.02;
  });

  return (
    <group ref={ref}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        {eco ? (
          <>
            {/* Clay bean — sphere */}
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.7, 48, 48]} />
              <meshStandardMaterial color={CLAY.bean} roughness={0.85} metalness={0.05} />
            </mesh>
            <mesh rotation={[0, 0, 0]} scale={[0.05, 1.05, 0.72]}>
              <sphereGeometry args={[0.7, 32, 32]} />
              <meshStandardMaterial color={CLAY.beanHi} roughness={1} />
            </mesh>
          </>
        ) : (
          <RealisticModel url="/models/bean.glb" scale={1.2} position={[0, -0.1, 0]} />
        )}
      </Float>
    </group>
  );
};

/* ---------- Grinder (stage 1 -> 2) ---------- */
const Grinder = ({ progressRef }: RigProps) => {
  const ref = useRef<THREE.Group>(null);
  const burr = useRef<THREE.Mesh>(null);
  const grounds = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const p = progressRef.current;
    const s1 = subProg(p, 1);
    const s2 = subProg(p, 2);
    const visible = s1 * (1 - s2);
    ref.current.position.y = lerp(-2.5, 0, s1) + lerp(0, 1, s2);
    ref.current.scale.setScalar(visible > 0.02 ? 1 : 0);
    (ref.current as any).visible = visible > 0.02;
    if (burr.current) burr.current.rotation.y += dt * 8 * s1;
    if (grounds.current) {
      const g = clamp((s1 - 0.5) * 2);
      grounds.current.scale.set(g * 1.2, g * 0.4, g * 1.2);
      (grounds.current as any).visible = g > 0.05;
    }
  });

  return (
    <group ref={ref}>
      {/* Hopper (cone) */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.4, 0.55, 32]} />
        <meshStandardMaterial color={CLAY.metal} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Beans inside hopper */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color={CLAY.bean} roughness={0.9} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.7, 0.9]} />
        <meshStandardMaterial color={CLAY.bodyDark} roughness={0.85} />
      </mesh>
      {/* Burr (visible disc) */}
      <mesh ref={burr} position={[0, 0.55, 0.46]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.05, 12, 24]} />
        <meshStandardMaterial color={CLAY.metalDark} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Spout */}
      <mesh position={[0, -0.25, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.12, 0.18, 24]} />
        <meshStandardMaterial color={CLAY.metalDark} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Ground pile */}
      <mesh ref={grounds} position={[0, -0.55, 0]} castShadow>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color={CLAY.bean} roughness={1} />
      </mesh>
    </group>
  );
};

/* ---------- Machine (stage 2 -> 3) ---------- */
const Machine = ({ progressRef, eco = true }: StageProps) => {
  const ref = useRef<THREE.Group>(null);
  const light = useRef<THREE.Mesh>(null);
  const steam = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const p = progressRef.current;
    const s2 = subProg(p, 2);
    const s3 = subProg(p, 3);
    const visible = s2 * (1 - s3 * 0.4);
    ref.current.position.y = lerp(-2.5, -0.1, s2);
    ref.current.scale.setScalar(visible > 0.02 ? 1 : 0);
    (ref.current as any).visible = visible > 0.02;

    if (light.current) {
      const mat = light.current.material as THREE.MeshStandardMaterial;
      const on = s2 > 0.3 ? 1 : 0;
      mat.emissiveIntensity = on * (0.7 + Math.sin(state.clock.elapsedTime * 4) * 0.3);
    }
    if (steam.current) {
      const t = clamp((s2 - 0.4) * 1.6);
      steam.current.children.forEach((c, i) => {
        const m = c as THREE.Mesh;
        m.position.y = 1.2 + t * 0.6 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.opacity = t * (0.6 - i * 0.15);
      });
    }
  });

  return (
    <group ref={ref}>
      {/* Steam puffs */}
      <group ref={steam} position={[-0.5, 0, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 0.18 - 0.18, 1.2, 0]}>
            <sphereGeometry args={[0.1 + i * 0.03, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.4} roughness={1} />
          </mesh>
        ))}
      </group>
      {eco ? (
        <>
          {/* Body */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 1.1, 0.95]} />
            <meshStandardMaterial color={CLAY.bodyDark} roughness={0.8} />
          </mesh>
          {/* Top deck */}
          <mesh position={[0, 1.08, 0]} castShadow>
            <boxGeometry args={[1.5, 0.08, 0.85]} />
            <meshStandardMaterial color={CLAY.metal} metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Pressure gauge */}
          <mesh position={[-0.45, 0.55, 0.48]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 32]} />
            <meshStandardMaterial color={CLAY.cup} roughness={0.6} />
          </mesh>
          {/* Group head */}
          <mesh position={[0, -0.12, 0.45]} castShadow>
            <cylinderGeometry args={[0.18, 0.16, 0.18, 24]} />
            <meshStandardMaterial color={CLAY.metalDark} metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Portafilter handle */}
          <mesh position={[0.5, -0.18, 0.45]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.45, 16]} />
            <meshStandardMaterial color={CLAY.bean} roughness={0.9} />
          </mesh>
          {/* Drip tray */}
          <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.08, 0.85]} />
            <meshStandardMaterial color={CLAY.metal} metalness={0.5} roughness={0.5} />
          </mesh>
        </>
      ) : (
        /* Realistic GLB espresso machine */
        <RealisticModel url="/models/machine.glb" scale={1.6} position={[0, -0.5, 0]} />
      )}
      {/* Power light (kept for both modes — animated indicator) */}
      <mesh ref={light} position={[0.5, 0.55, 0.49]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={CLAY.accent} emissive={CLAY.accent} emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

/* ---------- Pour stream (stage 3 -> 4) ---------- */
const Pour = ({ progressRef }: RigProps) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current;
    const s3 = subProg(p, 3);
    const s4 = subProg(p, 4);
    const visible = s3 * (1 - s4 * 0.7);
    const h = lerp(0.05, 0.55, Math.min(s3 * 1.3, 1));
    ref.current.scale.set(1, h / 0.55, 1);
    ref.current.position.y = -0.2 - h / 2 + 0.1;
    (ref.current as any).visible = visible > 0.02;
  });
  return (
    <mesh ref={ref} position={[0, -0.3, 0.45]}>
      <cylinderGeometry args={[0.025, 0.025, 0.55, 12]} />
      <meshStandardMaterial color={CLAY.espresso} roughness={0.4} metalness={0.2} />
    </mesh>
  );
};

/* ---------- Cup (stages 3-4) ---------- */
const Cup = ({ progressRef, eco = true }: StageProps) => {
  const ref = useRef<THREE.Group>(null);
  const fill = useRef<THREE.Mesh>(null);
  const crema = useRef<THREE.Mesh>(null);
  const steam = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const p = progressRef.current;
    const s3 = subProg(p, 3);
    const s4 = subProg(p, 4);
    const appear = clamp(s3 * 1.2);
    ref.current.position.y = lerp(-2.5, -0.85, appear);
    ref.current.scale.setScalar(appear > 0.02 ? lerp(0.6, 1, clamp(s3 + s4)) : 0);
    (ref.current as any).visible = appear > 0.02;

    if (fill.current) {
      const fillH = lerp(0.02, 0.42, clamp(s4));
      fill.current.scale.y = fillH / 0.42;
      fill.current.position.y = 0.05 - (0.42 - fillH) / 2;
      (fill.current as any).visible = s4 > 0.05;
    }
    if (crema.current) {
      (crema.current as any).visible = s4 > 0.5;
      crema.current.position.y = 0.05 + (lerp(-0.42, 0, clamp(s4))) / 2 + 0.21 * (s4 / s4 || 0);
      // simpler: place at top of fill
      const fillH = lerp(0.02, 0.42, clamp(s4));
      crema.current.position.y = 0.05 - (0.42 - fillH) / 2 + fillH / 2 + 0.005;
    }
    if (steam.current) {
      const t = clamp((s4 - 0.7) * 3);
      steam.current.children.forEach((c, i) => {
        const m = c as THREE.Mesh;
        const mat = m.material as THREE.MeshStandardMaterial;
        mat.opacity = t * 0.55;
        m.position.y = 0.5 + t * 0.4 + Math.sin(state.clock.elapsedTime * 1.8 + i) * 0.08;
        m.position.x = (i - 1) * 0.12 + Math.sin(state.clock.elapsedTime + i) * 0.05;
      });
    }
  });

  return (
    <group ref={ref} position={[0, -0.85, 0]}>
      {eco ? (
        <>
          {/* Saucer */}
          <mesh position={[0, -0.18, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.85, 0.8, 0.06, 48]} />
            <meshStandardMaterial color={CLAY.saucer} roughness={0.85} />
          </mesh>
          {/* Cup body (slight cone) */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.45, 0.45, 48, 1, false]} />
            <meshStandardMaterial color={CLAY.cup} roughness={0.7} />
          </mesh>
          {/* Cup rim (torus) */}
          <mesh position={[0, 0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.55, 0.025, 16, 48]} />
            <meshStandardMaterial color={CLAY.cupRim} roughness={0.7} />
          </mesh>
          {/* Handle */}
          <mesh position={[0.6, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.18, 0.04, 12, 24, Math.PI]} />
            <meshStandardMaterial color={CLAY.cup} roughness={0.7} />
          </mesh>
        </>
      ) : (
        /* Realistic GLB espresso cup with saucer */
        <RealisticModel url="/models/cup.glb" scale={1.0} position={[0, -0.2, 0]} />
      )}
      {eco && (
        <>
          {/* Espresso fill */}
          <mesh ref={fill} position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.52, 0.43, 0.42, 40]} />
            <meshStandardMaterial color={CLAY.espresso} roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Crema */}
          <mesh ref={crema} position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.52, 0.52, 0.02, 40]} />
            <meshStandardMaterial color={CLAY.crema} roughness={0.6} />
          </mesh>
        </>
      )}
      {/* Steam ribbons */}
      <group ref={steam} position={[0, 0.3, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 0.12, 0.5, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0} roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
