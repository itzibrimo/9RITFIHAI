import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function Orb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.0015;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.current.y * 0.15, 0.02);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.current.x * 0.15 + state.elapsed * 0.05, 0.02);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={2.2}>
        <icosahedronGeometry args={[1, 4]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#8B5CF6"
          roughness={0.1}
          metalness={0.85}
          emissive="#8B5CF6"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl || (navigator.hardwareConcurrency ?? 4) < 4) setSupportsWebGL(false);
  }, []);

  if (!supportsWebGL) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.25),transparent_60%)]" />
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#8B5CF6" />
          <pointLight position={[-5, -3, -5]} intensity={0.6} color="#D4AF37" />
          <Orb />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
