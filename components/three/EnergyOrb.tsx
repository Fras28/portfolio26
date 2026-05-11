'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, Trail, Point, Points } from '@react-three/drei';
import * as THREE from 'three';

// ── Inner glowing core ──
function Core() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.z += 0.003;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.8, 64, 64]} />
      <MeshDistortMaterial
        color="#00f5ff"
        emissive="#00b4d8"
        emissiveIntensity={2}
        roughness={0}
        metalness={0.8}
        distort={0.4}
        speed={3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// ── Wireframe outer shell ──
function Shell() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y -= 0.008;
    meshRef.current.rotation.x += 0.003;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.4, 1]} />
      <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.15} />
    </mesh>
  );
}

// ── Orbiting ring ──
function OrbitRing({ radius, color, speed, tilt }: {
  radius: number; color: string; speed: number; tilt: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z += speed;
  });

  const points = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    }
    return new Float32Array(pts);
  }, [radius]);

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[points, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </line>
    </group>
  );
}

// ── Floating particles ──
function ParticleField() {
  const count = 200;
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      // Cyan / Pink / Purple
      const choice = Math.random();
      if (choice < 0.5) { col[i*3]=0; col[i*3+1]=0.96; col[i*3+2]=1; }       // cyan
      else if (choice < 0.8) { col[i*3]=1; col[i*3+1]=0; col[i*3+2]=0.5; }   // pink
      else { col[i*3]=0.48; col[i*3+1]=0; col[i*3+2]=1; }                     // purple
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// ── Energy bolt (trailing sphere) ──
function EnergyBolt({ color, radius, speed, offset }: {
  color: string; radius: number; speed: number; offset: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t * 0.7) * radius * 0.5;
    ref.current.position.z = Math.sin(t) * radius;
  });

  return (
    <Trail width={0.8} length={8} color={color} attenuation={(t) => t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Trail>
  );
}

// ── Main scene ──
function OrbScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={4} color="#00f5ff" distance={10} />
      <pointLight position={[3, 3, 3]} intensity={2} color="#ff0080" distance={8} />
      <pointLight position={[-3, -3, -3]} intensity={1.5} color="#7c00ff" distance={8} />

      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <Core />
        <Shell />
        <OrbitRing radius={1.8} color="#00f5ff" speed={0.012} tilt={0.4} />
        <OrbitRing radius={2.2} color="#ff0080" speed={-0.008} tilt={1.1} />
        <OrbitRing radius={2.6} color="#7c00ff" speed={0.006} tilt={0.8} />
        <EnergyBolt color="#00f5ff" radius={2.0} speed={0.8} offset={0} />
        <EnergyBolt color="#ff0080" radius={2.3} speed={-0.6} offset={2.1} />
        <EnergyBolt color="#7c00ff" radius={1.9} speed={0.5} offset={4.2} />
      </Float>

      <ParticleField />
      <Stars radius={20} depth={10} count={1000} factor={2} saturation={0} fade speed={0.5} />
    </>
  );
}

// ── Exported component ──
export default function EnergyOrb() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <OrbScene />
      </Canvas>
    </div>
  );
}
