'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState, createContext, useContext } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere } from '@react-three/drei';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { trackInteraction } from '@/lib/analytics';

// ── Project data ──
type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  color: string;
  status: string;
  demo: string;
  year: string;
  type?: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: 'Padel Pro Ranking',
    description: 'Plataforma completa de ranking y gestión para el club Padel Pro Bahía. Incluye ranking global, torneos, jugadores, categorías, partidos en curso y sistema de clubes. Frontend inmersivo con escena 3D interactiva.',
    tags: ['React', 'Vite', 'Firebase', 'Redux', 'Three.js', 'Framer Motion'],
    color: '#00f5ff',
    status: 'Live',
    demo: 'https://www.padelproranking.com/',
    year: '2025',
  },
  {
    id: 2,
    title: 'Padel Pro — Backend',
    description: 'API y CMS headless para la plataforma Padel Pro. Gestión de jugadores, torneos, resultados y categorías. Integración con Cloudinary para imágenes y PostgreSQL como base de datos.',
    tags: ['Strapi', 'PostgreSQL', 'Cloudinary', 'Node.js', 'REST API'],
    color: '#ff0080',
    status: 'Live',
    demo: '#',
    year: '2025',
  },
  {
    id: 3,
    title: 'Resera Mobile',
    description: 'Aplicación móvil multiplataforma (iOS/Android) construida con React Native y Expo. Navegación nativa, autenticación segura, manejo de imágenes y soporte offline.',
    tags: ['React Native', 'Expo', 'NativeWind', 'Expo Router', 'TypeScript'],
    color: '#7c00ff',
    status: 'En desarrollo',
    demo: 'https://resera-front-tymc.vercel.app/',
    year: '2026',
  },
  {
    id: 4,
    title: 'Storti-Faggiano',
    description: 'Sitio web profesional para estudio de arquitectura. Diseño a medida, galería de proyectos, animaciones fluidas y formulario de contacto.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    color: '#00ff88',
    status: 'Completado',
    demo: 'https://storti-faggiano.vercel.app/',
    year: '2026',
  },
  {
    id: 5,
    title: 'HormiWhite Web',
    description: 'Landing page y sitio institucional para empresa de construcción. Optimizado para conversión, con integración a WhatsApp y formularios de captación de leads.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'ManyChat'],
    color: '#ffee00',
    status: 'Completado',
    demo: 'https://hormiwhite.vercel.app/',
    year: '2026',
  },
  {
    id: 6,
    title: 'Equivalente Agro',
    description: 'Sitio institucional para agencia de marketing agropecuario. Experiencias 3D interactivas, animaciones inmersivas, formulario de contacto con EmailJS y optimización SEO.',
    tags: ['React', 'Vite', 'Three.js', 'Firebase', 'Framer Motion', 'SEO'],
    color: '#367C2B',
    status: 'Live',
    demo: 'https://www.equivalenteagro.com.ar/',
    year: '2025',
  },
  {
    id: 7,
    title: 'De Ternera',
    description: 'PWA de compras de carne de calidad online. Catálogo de productos, carrito de compras, sistema de turnos y pedidos. UI moderna con Chakra UI y gestión de estado con Redux.',
    tags: ['React', 'Chakra UI', 'Redux', 'Framer Motion', 'PWA', 'Axios'],
    color: '#cc3300',
    status: 'Live',
    demo: 'https://www.deternera.com.ar/',
    year: '2024',
  },
  {
    id: 8,
    title: 'El Mundo de la Parrilla',
    description: 'Sitio institucional para restaurante parrilla tradicional de Bahía Blanca. Menú interactivo con filtros, galería de fotos y reservas por WhatsApp. Sitio bilingüe español/inglés.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'WhatsApp API'],
    color: '#ff4400',
    status: 'Live',
    demo: 'https://www.elmundodelaparrilla.com/',
    year: '2024',
  },
  {
    id: 9,
    title: 'Gregories — Alquimystic',
    description: 'E-commerce completo con panel de administración, carrito de compras, checkout, autenticación de usuarios y gestión de productos. Visualización 3D con Three.js y analytics integrados.',
    tags: ['React', 'TypeScript', 'Firebase', 'Mantine UI', 'Three.js', 'Zustand'],
    color: '#ff6600',
    status: 'En desarrollo',
    demo: 'https://www.grupogregori.com.ar/',
    year: '2026',
  },
  {
    id: 10,
    title: 'Portfolio v2',
    description: 'Este mismo portfolio. Next.js 14 App Router, esfera de energía 3D en Three.js, PostgreSQL con Prisma, analytics propio y panel de administración con estadísticas en tiempo real.',
    tags: ['Next.js', 'Three.js', 'PostgreSQL', 'Prisma', 'Railway'],
    color: '#cc00ff',
    status: 'Live',
    demo: '#',
    year: '2026',
  },
  {
    id: 16,
    title: 'Catálogo Digital Morton',
    description: 'Sistema de catálogos y cartas digitales para comercios. Uno de mis primeros proyectos propios: recorrí los paradores de Monte Hermoso ofreciéndolo puerta a puerta. Menú interactivo con QR, gestión de productos y diseño adaptado a cada negocio.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Catálogo Digital'],
    color: '#f59e0b',
    status: 'Live',
    demo: 'https://catalogo-digital-morton.vercel.app/',
    year: '2022',
  },
  {
    id: 17,
    title: 'Tecnogen Argentina',
    description: 'Sitio web institucional para empresa de tecnología y servicios. Diseño profesional, presentación de soluciones, sección de contacto y optimización para posicionamiento web.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'SEO'],
    color: '#3b82f6',
    status: 'Live',
    demo: 'https://www.tecnogenargentina.com/',
    year: '2025',
  },
  {
    id: 18,
    title: 'Maia — Magical World',
    description: 'Sitio web para lectora de tarot. Diseño místico e inmersivo, presentación de servicios, galería visual, formulario de consultas y experiencia de usuario fluida con animaciones y paleta oscura.',
    tags: ['React', 'Vite', 'Framer Motion', 'Tailwind CSS'],
    color: '#a855f7',
    status: 'Live',
    demo: 'https://maia-magical-world.vercel.app/',
    year: '2025',
  },
  {
    id: 11,
    title: 'Sixt — Bot de Reservas',
    description: 'Sistema de automatización completo para Sixt Renta Car Bahía Blanca. Bot conversacional con ManyChat para WhatsApp: consulta de disponibilidad, cotizaciones automáticas, confirmación de reservas y seguimiento post-alquiler.',
    tags: ['ManyChat', 'WhatsApp API', 'n8n', 'Automatización'],
    color: '#ff9900',
    status: 'Live',
    demo: '#',
    year: '2026',
    type: 'automation',
  },
  {
    id: 12,
    title: 'HormiWhite — Bot de Atención',
    description: 'Bot conversacional por WhatsApp para HormiWhite. Respuestas automáticas a consultas frecuentes, derivación al equipo de ventas, seguimiento de clientes con n8n y notificaciones internas en tiempo real.',
    tags: ['ManyChat', 'n8n', 'WhatsApp API', 'Automatización'],
    color: '#e8e8e8',
    status: 'Live',
    demo: '#',
    year: '2026',
    type: 'automation',
  },
  {
    id: 13,
    title: 'Dra. Ana Julia Lastre',
    description: 'Automatización de gestión de turnos médicos. Bot de WhatsApp que permite solicitar, confirmar y cancelar turnos 24/7, recordatorios automáticos 24h antes de la consulta y sincronización con agenda de la profesional.',
    tags: ['ManyChat', 'n8n', 'WhatsApp API', 'Google Calendar', 'Automatización'],
    color: '#00d4aa',
    status: 'Live',
    demo: '#',
    year: '2026',
    type: 'automation',
  },
  {
    id: 14,
    title: 'Gregories — Automatización',
    description: 'Suite de automatizaciones para tienda online Gregories. Notificaciones de pedidos en tiempo real, recupero de carritos abandonados vía WhatsApp, seguimiento de envíos y alertas de stock.',
    tags: ['n8n', 'ManyChat', 'WhatsApp API', 'Zapier', 'Automatización'],
    color: '#ff6600',
    status: 'Live',
    demo: '#',
    year: '2026',
    type: 'automation',
  },
  {
    id: 15,
    title: 'Padel Pro — Automatizaciones',
    description: 'Automatizaciones integradas a la plataforma Padel Pro Ranking. Notificaciones de resultados de torneos, alertas de inscripciones, reportes semanales de ranking y recordatorios de partidos a jugadores.',
    tags: ['n8n', 'ManyChat', 'WhatsApp API', 'Firebase', 'Automatización'],
    color: '#00f5ff',
    status: 'Live',
    demo: '#',
    year: '2026',
    type: 'automation',
  },
];

// ── Context ──
type ProjectContextType = {
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
  activeFilter: string;
  filteredProjects: Project[];
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}

const FILTERS = ['Todos', 'Automatización', 'React', 'Next.js', 'React Native', 'Firebase', 'TypeScript', 'Framer Motion'];

function ProjectProvider({ children, activeFilter }: { children: React.ReactNode; activeFilter: string }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = activeFilter === 'Todos'
    ? projects
    : projects.filter(p => p.tags.includes(activeFilter));

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject, activeFilter, filteredProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

// ── Starfield (absolute, not fixed) ──
function StarfieldBackground({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const mount = mountRef.current;
    if (!mount || !container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x04060f, 1);
    mount.appendChild(renderer.domElement);

    const geo = new THREE.BufferGeometry();
    const count = 6000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 2000;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x00f5ff, size: 0.5, sizeAttenuation: true, opacity: 0.6, transparent: true });
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);
    camera.position.z = 10;

    let id = 0;
    const animate = () => {
      id = requestAnimationFrame(animate);
      stars.rotation.y += 0.0001;
      stars.rotation.x += 0.00005;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(id);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, [containerRef]);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}

// ── Floating Card in 3D ──
function FloatingCard({ project, position }: {
  project: Project;
  position: { x: number; y: number; z: number };
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setSelectedProject } = useProject();
  // Track mousedown position to distinguish click from drag
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  useFrame(({ camera }) => {
    if (groupRef.current) groupRef.current.lookAt(camera.position);
  });

  const isAuto = project.type === 'automation';
  const icon = isAuto ? '⚡' : '{ }';

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mouseDownPos.current) {
      const dx = Math.abs(e.clientX - mouseDownPos.current.x);
      const dy = Math.abs(e.clientY - mouseDownPos.current.y);
      // If mouse moved more than 4px, it was a drag — ignore
      if (dx > 4 || dy > 4) return;
    }
    setSelectedProject(project);
    trackInteraction('project_click', project.title);
  };

  const statusColor = project.status === 'Live' ? '#00ff88'
    : project.status === 'En desarrollo' ? '#ffee00'
    : project.color;

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <Html
        transform
        distanceFactor={10}
        position={[0, 0, 0]}
        style={{ pointerEvents: 'auto' }}
        zIndexRange={[10, 0]}
      >
        <div
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          onMouseEnter={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
          onMouseLeave={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
          style={{
            width: '140px',
            height: '186px',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#04060f',
            padding: '10px',
            userSelect: 'none',
            cursor: 'pointer',
            transform: hovered ? 'scale(1.15)' : 'scale(1)',
            boxShadow: hovered
              ? `0 25px 50px ${project.color}60, 0 0 30px ${project.color}40`
              : '0 15px 30px rgba(0,0,0,0.7)',
            border: hovered
              ? `2px solid ${project.color}90`
              : `1px solid ${project.color}25`,
            transition: 'all 0.25s ease',
          }}
        >
          {/* Card visual top */}
          <div style={{
            width: '100%',
            height: '108px',
            borderRadius: '6px',
            background: `linear-gradient(135deg, ${project.color}18 0%, ${project.color}06 100%)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            border: `1px solid ${project.color}20`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Scan line */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: '1px',
              background: `linear-gradient(90deg, transparent, ${project.color}60, transparent)`,
              top: '30%',
            }} />
            <span style={{ fontSize: '24px', lineHeight: 1 }}>{icon}</span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              color: project.color,
              letterSpacing: '2px',
              textTransform: 'uppercase' as const,
              opacity: 0.8,
            }}>
              {isAuto ? 'automation' : 'web / app'}
            </span>
            {/* Status dot */}
            <div style={{
              position: 'absolute', top: '8px', right: '8px',
              width: '6px', height: '6px', borderRadius: '50%',
              background: statusColor,
              boxShadow: `0 0 6px ${statusColor}`,
            }} />
          </div>

          {/* Card info bottom */}
          <div style={{ marginTop: '8px', padding: '0 2px' }}>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              fontWeight: 'bold',
              color: '#e8f4f8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: '3px',
            }}>{project.title}</p>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '8px',
              color: project.color,
              opacity: 0.8,
            }}>{project.year} · {project.tags[0]}</p>
          </div>
        </div>
      </Html>
    </group>
  );
}

// ── Modal ──
function ProjectModal() {
  const { selectedProject, setSelectedProject } = useProject();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!selectedProject) return null;

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = (y - rect.height / 2) / 18;
    const rotateY = (rect.width / 2 - x) / 18;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.5s ease-out';
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-cyber-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) setSelectedProject(null); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-sm w-full mx-4"
      >
        {/* Close */}
        <button
          onClick={() => setSelectedProject(null)}
          className="absolute -top-10 right-0 text-cyber-white/50 hover:text-cyber-white transition-colors z-10"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div style={{ perspective: '1000px' }} className="w-full">
          <div
            ref={cardRef}
            className="relative cursor-default rounded-xl p-5 space-y-4 transition-all duration-500 ease-out"
            style={{
              background: '#04060f',
              border: `1px solid ${selectedProject.color}40`,
              boxShadow: `0 0 40px ${selectedProject.color}20, 0 25px 50px rgba(0,0,0,0.6)`,
              transformStyle: 'preserve-3d',
              borderTop: `2px solid ${selectedProject.color}`,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: selectedProject.color }}>
                  {selectedProject.type === 'automation' ? '⚡ Automatización' : '{ } Desarrollo'} · {selectedProject.year}
                </p>
                <h3 className="font-display text-lg font-black text-cyber-white leading-tight">
                  {selectedProject.title}
                </h3>
              </div>
              <span
                className="flex-shrink-0 text-xs font-mono px-2 py-1 border"
                style={{ color: selectedProject.color, borderColor: `${selectedProject.color}40` }}
              >
                {selectedProject.status}
              </span>
            </div>

            {/* Description */}
            <p className="font-mono text-xs text-cyber-white/60 leading-relaxed">
              {selectedProject.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {selectedProject.tags.map(tag => (
                <span
                  key={tag}
                  className="font-mono text-xs px-2 py-0.5 border text-cyber-white/40 border-cyber-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            {selectedProject.demo && selectedProject.demo !== '#' && (
              <a
                href={selectedProject.demo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 font-mono text-xs uppercase tracking-widest transition-all duration-200"
                style={{
                  background: `${selectedProject.color}15`,
                  border: `1px solid ${selectedProject.color}60`,
                  color: selectedProject.color,
                }}
                onClick={() => trackInteraction('demo_click', selectedProject.title)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver sitio
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Galaxy of project cards ──
function ProjectGalaxy({ projects }: { projects: Project[] }) {
  const positions = useMemo(() => {
    const n = projects.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    return projects.map((_, i) => {
      const y = 1 - (i / Math.max(n - 1, 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = (2 * Math.PI * i) / goldenRatio;
      const layer = 11 + (i % 3) * 3.5;
      return {
        x: Math.cos(theta) * r * layer,
        y: y * layer,
        z: Math.sin(theta) * r * layer,
      };
    });
  }, [projects.length]);

  return (
    <>
      {/* Wireframe sphere shells */}
      {[10, 14, 18].map((r, i) => (
        <Sphere key={r} args={[r, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#00f5ff"
            transparent
            opacity={[0.06, 0.04, 0.02][i]}
            wireframe
          />
        </Sphere>
      ))}

      {projects.map((project, i) => (
        <FloatingCard key={project.id} project={project} position={positions[i]} />
      ))}
    </>
  );
}

// ── Main Section ──
export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeFilter === 'Todos'
    ? projects
    : projects.filter(p => p.tags.includes(activeFilter));

  return (
    <ProjectProvider activeFilter={activeFilter}>
      <section id="projects" ref={ref} className="relative py-16 sm:py-24">

        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="font-mono text-cyber-pink text-xs tracking-widest uppercase mb-2">
              {'>'} Base de datos de misiones
            </p>
            <h2 className="section-title text-4xl sm:text-5xl font-black">
              <span className="text-cyber-white">MIS</span>{' '}
              <span className="text-gradient-cyber">PROYECTOS</span>
            </h2>
            <div className="mt-4 w-24 h-px bg-gradient-to-r from-cyber-cyan to-transparent" />
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mt-6"
          >
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-widest border transition-all duration-200 ${
                  activeFilter === f
                    ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10'
                    : 'border-cyber-white/20 text-cyber-white/40 hover:border-cyber-white/40'
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>


        {/* 3D Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative w-full overflow-hidden"
          style={{ height: '600px' }}
        >
          <div ref={containerRef} className="absolute inset-0">
            <StarfieldBackground containerRef={containerRef} />
          </div>

          <Canvas
            camera={{ position: [0, 0, 22], fov: 60 }}
            className="absolute inset-0 z-10"
            onCreated={({ gl }) => { gl.domElement.style.pointerEvents = 'auto'; }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={0.8} color="#00f5ff" />
              <pointLight position={[-10, -10, -10]} intensity={0.4} color="#ff0080" />

              <ProjectGalaxy projects={filteredProjects} />

              <OrbitControls
                enablePan
                enableZoom
                enableRotate
                minDistance={6}
                maxDistance={45}
                autoRotate
                autoRotateSpeed={0.4}
                rotateSpeed={0.5}
                zoomSpeed={1.0}
                target={[0, 0, 0]}
              />
            </Suspense>
          </Canvas>

          {/* HUD overlay */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
            <p className="font-mono text-xs text-cyber-cyan/40 leading-relaxed">
              Arrastrá para orbitar · Scroll para zoom · Click en card para ver detalle
            </p>
          </div>
          <div className="absolute top-4 right-4 z-20 pointer-events-none text-right">
            <p className="font-mono text-xs text-cyber-pink/40">{filteredProjects.length} proyectos</p>
          </div>

          <ProjectModal />
        </motion.div>
      </section>
    </ProjectProvider>
  );
}
