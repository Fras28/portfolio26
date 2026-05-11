'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const EnergyOrb = dynamic(() => import('@/components/three/EnergyOrb'), { ssr: false });

const TYPEWRITER_STRINGS = [
  'Full Stack Developer',
  'Web App Builder',
  'Automation Engineer',
  'UI/UX Enthusiast',
];

function Typewriter() {
  const [text, setText]     = useState('');
  const [idx, setIdx]       = useState(0);
  const [deleting, setDel]  = useState(false);

  useEffect(() => {
    const full = TYPEWRITER_STRINGS[idx % TYPEWRITER_STRINGS.length];
    const speed = deleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!deleting && text === full) {
        setTimeout(() => setDel(true), 1800);
      } else if (deleting && text === '') {
        setDel(false);
        setIdx(i => i + 1);
      } else {
        setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, deleting, idx]);

  return (
    <span className="neon-cyan font-mono">
      {text}
      <span className="animate-type-cursor text-cyber-pink">▮</span>
    </span>
  );
}

// Corner decorations
function CornerDecor({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const classes = {
    tl: 'top-4 left-4 border-t-2 border-l-2',
    tr: 'top-4 right-4 border-t-2 border-r-2',
    bl: 'bottom-4 left-4 border-b-2 border-l-2',
    br: 'bottom-4 right-4 border-b-2 border-r-2',
  };
  return (
    <div className={`absolute w-8 h-8 border-cyber-cyan ${classes[pos]}`} />
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-grid overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyber-cyan/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyber-pink/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyber-purple/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 w-fit"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green" />
            </span>
            <span className="font-mono text-xs text-cyber-green tracking-widest uppercase">
              Disponible para proyectos
            </span>
          </motion.div>

          {/* Name */}
          <div>
            <p className="font-mono text-cyber-cyan/50 text-sm tracking-widest mb-2 uppercase">
              {'>'} Inicializando sistema...
            </p>
            <h1 className="section-title text-5xl sm:text-6xl xl:text-7xl font-black leading-none">
              <span className="block text-cyber-white animate-glitch">FRANCO</span>
              <span className="block text-gradient-cyber">SELVAROLO</span>
            </h1>
          </div>

          {/* Typewriter */}
          <div className="font-mono text-xl sm:text-2xl h-8">
            <Typewriter />
          </div>

          {/* Description */}
          <p className="font-mono text-cyber-white/60 text-sm leading-relaxed max-w-md">
            Construyo experiencias web inmersivas con tecnología de última generación.
            Del concepto al deploy, del frontend al backend.
          </p>

          {/* Skill tags */}
          <div className="flex flex-wrap gap-2">
            {['React', 'Next.js', 'NestJS', 'React Native', 'Strapi', 'PostgreSQL', 'Firebase', 'Railway'].map(s => (
              <span
                key={s}
                className="px-3 py-1 border border-cyber-cyan/30 text-cyber-cyan/70 font-mono text-xs hover:border-cyber-cyan hover:text-cyber-cyan transition-all duration-200"
              >
                {s}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#projects" className="btn-cyber">
              Ver proyectos
            </a>
            <a href="#contact" className="btn-cyber btn-cyber-pink">
              Contactar
            </a>
          </div>
        </motion.div>

        {/* 3D Orb side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative w-full h-[500px] lg:h-[600px]"
        >
          <CornerDecor pos="tl" />
          <CornerDecor pos="tr" />
          <CornerDecor pos="bl" />
          <CornerDecor pos="br" />
          <EnergyOrb />

          {/* HUD overlay */}
          <div className="absolute bottom-8 left-8 font-mono text-xs text-cyber-cyan/40 space-y-1 pointer-events-none">
            <p>SYS: ONLINE</p>
            <p>CORE: 97.4%</p>
            <p>NET: ACTIVE</p>
          </div>
          <div className="absolute top-8 right-8 font-mono text-xs text-cyber-pink/40 text-right space-y-1 pointer-events-none">
            <p>v2.0.26</p>
            <p>BUILD: STABLE</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-cyber-white/30 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-cyber-cyan/50 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
