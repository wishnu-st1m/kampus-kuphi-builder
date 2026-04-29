import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Clay-style 3D coffee journey scene.
 * Driven by external scroll progress (0..1).
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

export const Hero3DScene = ({ progress }: SceneProps) => {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.4, 5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#00000000"]} />
      <SceneContent progress={progress} />
    </Canvas>
  );
};

const SceneContent = ({ progress }: SceneProps) => {
  // smoothed progress
  const smooth = useRef(progress);
  useFrame(() => {
    smooth.current = lerp(smooth.current, progress, 0.15);
  });

  return (
    <>
      {/* Lighting — soft clay look */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-4, 2, -2]} intensity={0.4} color="#ffd9a8" />
      <Environment preset="sunset" />

      <CameraRig progressRef={smooth} />

      <group position={[0, -0.2, 0]}>
        <Bean progressRef={smooth} />
        <Grinder progressRef={smooth} />
        <Machine progressRef={smooth} />
        <Pour progressRef={smooth} />
        <Cup progressRef={smooth} />
      </group>

      <ContactShadows
        position={[0, -1.1, 0]}
        opacity={0.35}
        scale={8}
        blur={2.6}
        far={2}
        color="#3a1f10"
      />
    </>
  );
};

type RigProps = { progressRef: React.MutableRefObject<number> };

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

/* ---------- Bean (stage 0 -> 1) ---------- */
const Bean = ({ progressRef }: RigProps) => {
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
        {/* Bean body — squashed sphere */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.7, 48, 48]} />
          <meshStandardMaterial color={CLAY.bean} roughness={0.85} metalness={0.05} />
        </mesh>
        {/* Bean crease */}
        <mesh rotation={[0, 0, 0]} scale={[0.05, 1.05, 0.72]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color={CLAY.beanHi} roughness={1} />
        </mesh>
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
const Machine = ({ progressRef }: RigProps) => {
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
      {/* Power light */}
      <mesh ref={light} position={[0.5, 0.55, 0.49]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={CLAY.accent} emissive={CLAY.accent} emissiveIntensity={1} />
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
const Cup = ({ progressRef }: RigProps) => {
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
