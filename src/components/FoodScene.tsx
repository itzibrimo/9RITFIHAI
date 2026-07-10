import { Suspense, useRef, useState, useEffect, lazy } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

const LazyCanvas = lazy(() =>
  Promise.resolve({ default: FoodCanvas })
);

function Avocado({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouse.current.x * 0.2 + state.elapsed * 0.15,
      0.02
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouse.current.y * 0.1,
      0.02
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.15}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={0.08}
          distort={0.25}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function Leaf({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
      <mesh position={position} rotation={rotation}>
        <torusGeometry args={[0.3, 0.08, 8, 24, Math.PI]} />
        <meshPhysicalMaterial
          color="#2ECC9A"
          roughness={0.3}
          metalness={0.4}
          emissive="#2ECC9A"
          emissiveIntensity={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function Berry({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.7}>
      <mesh position={position}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshPhysicalMaterial
          color="#C9A962"
          roughness={0.1}
          metalness={0.85}
          emissive="#C9A962"
          emissiveIntensity={0.12}
        />
      </mesh>
    </Float>
  );
}

function FoodComposition() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#2ECC9A" />
      <pointLight position={[-5, -3, 3]} intensity={0.8} color="#C9A962" />
      <spotLight position={[0, 8, 0]} intensity={0.6} angle={0.3} penumbra={1} color="#FAFAF9" />

      <Avocado position={[0, 0, 0]} color="#2ECC9A" scale={1.4} />
      <Avocado position={[-1.8, 0.5, -0.5]} color="#1FA87A" scale={0.7} />
      <Avocado position={[1.6, -0.3, 0.3]} color="#34D399" scale={0.55} />

      <Leaf position={[0.3, 1.2, 0.2]} rotation={[0.5, 0.3, 0.8]} />
      <Leaf position={[-0.5, 0.9, -0.3]} rotation={[0.2, -0.4, 1.2]} />

      <Berry position={[0.8, 0.6, 0.8]} />
      <Berry position={[-0.6, -0.4, 0.6]} />
      <Berry position={[0.2, -0.7, -0.4]} />

      <Environment preset="night" />
    </>
  );
}

function FoodCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <FoodComposition />
      </Suspense>
    </Canvas>
  );
}

export default function FoodScene() {
  const [supportsWebGL, setSupportsWebGL] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl || (navigator.hardwareConcurrency ?? 4) < 4) setSupportsWebGL(false);
  }, []);

  if (!supportsWebGL || reducedMotion) {
    return (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(46,204,154,0.15),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,169,98,0.08),transparent_50%)]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Suspense
        fallback={
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(46,204,154,0.12),transparent_65%)]" />
        }
      >
        <LazyCanvas />
      </Suspense>
    </div>
  );
}
