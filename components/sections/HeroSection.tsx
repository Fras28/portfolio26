'use client';

import { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';

const TYPEWRITER_STRINGS = [
  'Full Stack Developer',
  'Web App Builder',
  'Automation Engineer',
  'UI/UX Enthusiast',
];

// Tags that map to project filters
const HERO_TAGS: { label: string; filter: string }[] = [
  { label: 'React',         filter: 'React' },
  { label: 'Next.js',       filter: 'Next.js' },
  { label: 'React Native',  filter: 'React Native' },
  { label: 'TypeScript',    filter: 'TypeScript' },
  { label: 'Firebase',      filter: 'Firebase' },
  { label: 'Framer Motion', filter: 'Framer Motion' },
  { label: 'Automatizacion',filter: 'Automatizacion' },
  { label: 'NestJS',        filter: 'Todos' },
];

function scrollToProjects() {
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
}

function Typewriter() {
  const [text, setText]    = useState('');
  const [idx, setIdx]      = useState(0);
  const [deleting, setDel] = useState(false);
  useEffect(() => {
    const full = TYPEWRITER_STRINGS[idx % TYPEWRITER_STRINGS.length];
    const speed = deleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!deleting && text === full) { setTimeout(() => setDel(true), 1800); }
      else if (deleting && text === '') { setDel(false); setIdx(i => i + 1); }
      else { setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)); }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx]);
  return (
    <span className="neon-cyan font-mono">
      {text}<span className="animate-type-cursor text-cyber-pink">▮</span>
    </span>
  );
}

function CornerDecor({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const classes = { tl:'top-4 left-4 border-t-2 border-l-2', tr:'top-4 right-4 border-t-2 border-r-2', bl:'bottom-4 left-4 border-b-2 border-l-2', br:'bottom-4 right-4 border-b-2 border-r-2' };
  return <div className={`absolute w-8 h-8 border-cyber-cyan ${classes[pos]}`} />;
}

function StarfieldBg({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!mount || !container) return;
    const w = container.clientWidth, h = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x04060f, 1);
    mount.appendChild(renderer.domElement);
    const geo = new THREE.BufferGeometry();
    const count = 5000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3] = (Math.random()-0.5)*2000;
      pos[i*3+1] = (Math.random()-0.5)*2000;
      pos[i*3+2] = (Math.random()-0.5)*2000;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x00f5ff, size: 0.5, sizeAttenuation: true, opacity: 0.5, transparent: true });
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);
    camera.position.z = 10;
    let id = 0;
    const animate = () => { id = requestAnimationFrame(animate); stars.rotation.y += 0.0001; stars.rotation.x += 0.00005; renderer.render(scene, camera); };
    animate();
    const onResize = () => { if (!container) return; camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(id); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); renderer.dispose(); geo.dispose(); mat.dispose(); };
  }, [containerRef]);
  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}

function GalaxySpheres() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => { if (groupRef.current) { groupRef.current.rotation.y += 0.0008; groupRef.current.rotation.x += 0.0003; } });
  return (
    <group ref={groupRef}>
      <Sphere args={[1.4, 32, 32]}><meshStandardMaterial color="#00f5ff" transparent opacity={0.06} /></Sphere>
      <Sphere args={[1.8, 14, 14]}><meshStandardMaterial color="#00f5ff" transparent opacity={0.12} wireframe /></Sphere>
    </group>
  );
}

function OrbitRing({ rx, ry, color, r, speed }: { rx: number; ry: number; color: string; r: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.z += speed; });
  return (
    <mesh ref={ref} rotation={[rx, ry, 0]}>
      <torusGeometry args={[r, 0.01, 2, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

type CardData = { title: string; year: string; color: string; isAuto: boolean; tags: string[] };

const HERO_CARDS: CardData[] = [
  { title: 'Padel Pro Ranking',       year: '2025', color: '#00f5ff', isAuto: false, tags: ['React', 'Firebase', 'Framer Motion'] },
  { title: 'Padel Pro Backend',       year: '2025', color: '#ff0080', isAuto: false, tags: ['React'] },
  { title: 'Resera Mobile',           year: '2026', color: '#7c00ff', isAuto: false, tags: ['React Native', 'TypeScript'] },
  { title: 'Storti-Faggiano',         year: '2026', color: '#00ff88', isAuto: false, tags: ['React', 'Framer Motion'] },
  { title: 'HormiWhite Web',          year: '2026', color: '#ffee00', isAuto: false, tags: ['React'] },
  { title: 'Equivalente Agro',        year: '2025', color: '#367C2B', isAuto: false, tags: ['React', 'Firebase', 'Framer Motion'] },
  { title: 'De Ternera',              year: '2024', color: '#cc3300', isAuto: false, tags: ['React', 'Framer Motion'] },
  { title: 'El Mundo de la Parrilla', year: '2024', color: '#ff4400', isAuto: false, tags: ['React'] },
  { title: 'Gregories Alquimystic',   year: '2026', color: '#ff6600', isAuto: false, tags: ['React', 'TypeScript', 'Firebase', 'Framer Motion'] },
  { title: 'Portfolio v2',            year: '2026', color: '#cc00ff', isAuto: false, tags: ['Next.js', 'TypeScript'] },
  { title: 'Catalogo Digital Morton', year: '2022', color: '#f59e0b', isAuto: false, tags: ['React'] },
  { title: 'Tecnogen Argentina',      year: '2025', color: '#3b82f6', isAuto: false, tags: ['React'] },
  { title: 'Maia Magical World',      year: '2025', color: '#a855f7', isAuto: false, tags: ['React', 'Framer Motion'] },
  { title: 'Sixt Bot Reservas',       year: '2026', color: '#ff9900', isAuto: true,  tags: ['Automatizacion'] },
  { title: 'HormiWhite Bot',          year: '2026', color: '#e8e8e8', isAuto: true,  tags: ['Automatizacion'] },
  { title: 'Dra Ana Julia Lastre',    year: '2026', color: '#00d4aa', isAuto: true,  tags: ['Automatizacion'] },
  { title: 'Gregories Auto',          year: '2026', color: '#ff6600', isAuto: true,  tags: ['Automatizacion'] },
  { title: 'Padel Pro Auto',          year: '2026', color: '#00f5ff', isAuto: true,  tags: ['Automatizacion'] },
];

function HeroFloatingCard({ card, position, zRange = [10, 0] as [number, number], interactive = true }: { card: CardData; position: [number, number, number]; zRange?: [number, number]; interactive?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  useFrame(({ camera }) => { if (groupRef.current) groupRef.current.lookAt(camera.position); });

  return (
    <group ref={groupRef} position={position}>
      <Html transform distanceFactor={18} position={[0, 0, 0]} style={{ pointerEvents: interactive ? 'auto' : 'none' }} zIndexRange={zRange}>
        <div
          onMouseDown={(e) => { mouseDownPos.current = { x: e.clientX, y: e.clientY }; }}
          onClick={(e) => {
            e.stopPropagation();
            if (mouseDownPos.current) {
              const dx = Math.abs(e.clientX - mouseDownPos.current.x);
              const dy = Math.abs(e.clientY - mouseDownPos.current.y);
              if (dx > 4 || dy > 4) return;
            }
            scrollToProjects();
          }}
          onMouseEnter={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
          onMouseLeave={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
          style={{
            width: '72px', height: '96px', borderRadius: '7px',
            background: '#04060f', padding: '6px', userSelect: 'none', cursor: 'pointer',
            transform: hovered ? 'scale(1.2)' : 'scale(1)',
            boxShadow: hovered ? `0 12px 28px ${card.color}55, 0 0 14px ${card.color}35` : '0 6px 18px rgba(0,0,0,0.75)',
            border: hovered ? `1px solid ${card.color}80` : `1px solid ${card.color}20`,
            transition: 'all 0.25s ease',
          }}
        >
          <div style={{
            width: '100%', height: '54px', borderRadius: '4px',
            background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}05 100%)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '3px', border: `1px solid ${card.color}15`, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${card.color}45, transparent)`, top: '35%' }} />
            <span style={{ fontSize: '14px', lineHeight: 1 }}>{card.isAuto ? '⚡' : '{ }'}</span>
            <span style={{ fontFamily: 'monospace', fontSize: '6px', color: card.color, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.7 }}>
              {card.isAuto ? 'auto' : 'web'}
            </span>
          </div>
          <div style={{ marginTop: '5px', padding: '0 1px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '6.5px', fontWeight: 'bold', color: '#e8f4f8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '1px' }}>
              {card.title}
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '6px', color: card.color, opacity: 0.7 }}>{card.year}</p>
          </div>
        </div>
      </Html>
    </group>
  );
}

function FloatingCards({ cards, zRange, interactive }: { cards: CardData[]; zRange?: [number, number]; interactive?: boolean }) {
  const positions = useMemo<[number, number, number][]>(() => {
    const n = cards.length;
    const golden = (1 + Math.sqrt(5)) / 2;
    return cards.map((_, i) => {
      const y = 1 - (i / Math.max(n - 1, 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = (2 * Math.PI * i) / golden;
      const layer = 5 + (i % 3) * 1.5;
      return [Math.cos(theta) * r * layer, y * layer, Math.sin(theta) * r * layer];
    });
  }, [cards]);
  return (
    <>
      {cards.map((card, i) => (
        <HeroFloatingCard key={card.title} card={card} position={positions[i]} zRange={zRange} interactive={interactive} />
      ))}
    </>
  );
}

/**
 * Mobile: canvas de fondo con tarjetas decorativas (z-index bajo).
 * Las cards tienen zRange={[2,0]} — quedan DETRÁS del overlay (z-5).
 * El texto queda encima de todo (z-10).
 */
function MobileGalaxy({ cards }: { cards: CardData[] }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 60 }}
      style={{ width: '100%', height: '100%', background: '#04060f', touchAction: 'pan-y' }}
      onCreated={({ gl }) => {
        // Pasar eventos wheel al scroll de la página
        gl.domElement.addEventListener('wheel', (e) => { window.scrollBy({ top: e.deltaY }); }, { passive: true });
        // Pasar touch vertical al scroll nativo de la página
        gl.domElement.style.touchAction = 'pan-y';
        gl.domElement.addEventListener('touchmove', (e) => {
          if (e.touches.length === 1) e.stopPropagation();
        }, { passive: true });
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#00f5ff" />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#ff0080" />
        <GalaxySpheres />
        <OrbitRing rx={Math.PI / 2} ry={0}           color="#00f5ff" r={3.5}  speed={0.003}  />
        <OrbitRing rx={Math.PI / 3} ry={Math.PI / 4} color="#ff0080" r={4.8}  speed={-0.002} />
        <OrbitRing rx={Math.PI / 6} ry={Math.PI / 2} color="#7c00ff" r={6.2}  speed={0.0015} />
        {/* Cards decorativas — z bajo para quedar detrás del overlay */}
        <FloatingCards cards={cards} zRange={[2, 0]} interactive={false} />
        {/* enableRotate={false}: el auto-rotate funciona igual, pero no captura touch del usuario */}
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} autoRotate autoRotateSpeed={0.4} />
      </Suspense>
    </Canvas>
  );
}

function HeroGalaxy({ containerRef, cards }: { containerRef: React.RefObject<HTMLDivElement>; cards: CardData[] }) {
  return (
    <>
      <StarfieldBg containerRef={containerRef} />
      <Canvas
        camera={{ position: [0, 0, 22], fov: 55 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        className="z-10"
        onCreated={({ gl }) => {
          // Allow page scroll when hovering the 3D canvas
          gl.domElement.addEventListener('wheel', (e) => {
            window.scrollBy({ top: e.deltaY });
          }, { passive: true });
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#00f5ff" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff0080" />
          <GalaxySpheres />
          <OrbitRing rx={Math.PI / 2} ry={0}           color="#00f5ff" r={3.5}  speed={0.003}  />
          <OrbitRing rx={Math.PI / 3} ry={Math.PI / 4} color="#ff0080" r={4.8}  speed={-0.002} />
          <OrbitRing rx={Math.PI / 6} ry={Math.PI / 2} color="#7c00ff" r={6.2}  speed={0.0015} />
          <FloatingCards cards={cards} />
          <OrbitControls enablePan={false} enableZoom={false} enableRotate autoRotate autoRotateSpeed={0.5} rotateSpeed={0.4} />
        </Suspense>
      </Canvas>
    </>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heroFilter, setHeroFilter] = useState('Todos');

  const visibleCards = useMemo(
    () => heroFilter === 'Todos' ? HERO_CARDS : HERO_CARDS.filter(c => c.tags.includes(heroFilter)),
    [heroFilter]
  );

  return (
    <section id="hero" className="relative flex items-start lg:items-center bg-grid" style={{ minHeight: '100svh' }}>

      {/* ── Mobile: canvas de fondo con tarjetas decorativas (z-index bajo) ── */}
      <div className="absolute inset-0 lg:hidden" style={{ touchAction: 'pan-y', overflow: 'hidden', pointerEvents: 'none' }}>
        <MobileGalaxy cards={visibleCards} />
      </div>
      {/* Overlay mobile z-5 — separa visualmente las tarjetas del texto */}
      <div
        className="absolute inset-0 lg:hidden pointer-events-none"
        style={{
          zIndex: 5,
          background: 'rgba(4,6,15,0.68)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* ── Desktop: canvas en la mitad derecha ── */}
      <div ref={containerRef} className="absolute inset-y-0 right-0 w-1/2 hidden lg:block" style={{ touchAction: 'pan-y' }}>
        <HeroGalaxy containerRef={containerRef} cards={visibleCards} />
        <div className="absolute top-6 right-6 font-mono text-xs text-cyber-pink/40 text-right space-y-1 pointer-events-none z-20">
          <p>v2.0.26</p><p>BUILD: STABLE</p>
        </div>
        <CornerDecor pos="tl" /><CornerDecor pos="tr" />
        <CornerDecor pos="bl" /><CornerDecor pos="br" />
      </div>

      {/* ── Content layout ── */}
      <div
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <div className="w-full lg:w-1/2">

          {/* Text block */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-3 sm:gap-5 lg:gap-6 pointer-events-auto w-full"
          >
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 w-fit">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green" />
              </span>
              <span className="font-mono text-xs text-cyber-green tracking-widest uppercase">Disponible para proyectos</span>
            </div>

            {/* Title */}
            <div>
              <p className="font-mono text-cyber-cyan/50 text-xs tracking-widest mb-1 uppercase">{'>'} Inicializando sistema...</p>
              <h1 className="section-title text-4xl sm:text-5xl xl:text-7xl font-black leading-none">
                <span className="block text-cyber-white animate-glitch">FRANCO</span>
                <span className="block text-gradient-cyber">SELVAROLO</span>
              </h1>
            </div>

            {/* Typewriter */}
            <div className="font-mono text-base sm:text-xl h-7 sm:h-8">
              <Typewriter />
            </div>

            {/* Description */}
            <p className="font-mono text-cyber-white/60 text-xs sm:text-sm leading-relaxed">
              Construyo experiencias web inmersivas con tecnologia de ultima generacion.
              Del concepto al deploy, del frontend al backend.
            </p>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1.5">
              {HERO_TAGS.map(({ label, filter }) => (
                <button
                  key={label}
                  onClick={() => setHeroFilter(heroFilter === filter ? 'Todos' : filter)}
                  className={`px-2 py-0.5 border font-mono text-xs transition-all duration-200 cursor-pointer ${
                    heroFilter === filter
                      ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/15'
                      : 'border-cyber-cyan/30 text-cyber-cyan/70 hover:border-cyber-cyan hover:text-cyber-cyan hover:bg-cyber-cyan/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-2">
              <button onClick={scrollToProjects} className="btn-cyber">Ver proyectos</button>
              <a href="#contact" className="btn-cyber btn-cyber-pink">Contactar</a>
            </div>
          </motion.div>

        </div>
      </div>

      {/* HUD stats (desktop) */}
      <div className="absolute bottom-16 left-8 font-mono text-xs text-cyber-cyan/40 space-y-1 pointer-events-none z-20 hidden lg:block">
        <p>SYS: ONLINE</p><p>CORE: 97.4%</p><p>NET: ACTIVE</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20">
        <span className="font-mono text-xs text-cyber-white/30 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-cyber-cyan/50 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
