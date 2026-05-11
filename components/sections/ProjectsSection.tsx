'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';
import { trackInteraction } from '@/lib/analytics';

// ── Edit your projects here ──
const projects = [
  {
    id: 1,
    title: 'Padel Pro Ranking',
    description: 'Plataforma completa de ranking y gestión para el club Padel Pro Bahía. Incluye ranking global, torneos, jugadores, categorías, partidos en curso y sistema de clubes. Frontend inmersivo con escena 3D interactiva.',
    tags: ['React', 'Vite', 'Firebase', 'Redux', 'Three.js', 'Framer Motion'],
    color: '#00f5ff',
    status: 'Live',
    github: 'https://github.com/franco',
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
    github: 'https://github.com/franco',
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
    github: 'https://github.com/franco',
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
    github: 'https://github.com/franco',
    demo: 'https://storti-faggiano.vercel.app/',
    year: '2026',
  },
  {
    id: 5,
    title: 'HormiWhite Web',
    description: 'Landing page y sitio institucional para empresa de construcción. Optimizado para conversión, con integración a WhatsApp, ManyChat y formularios de captación de leads.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'ManyChat'],
    color: '#ffee00',
    status: 'Completado',
    github: 'https://github.com/franco',
    demo: 'https://hormiwhite.vercel.app/',
    year: '2026',
  },
  {
    id: 6,
    title: 'Equivalente Agro',
    description: 'Sitio institucional para agencia de marketing agropecuario. Experiencias 3D interactivas, animaciones inmersivas con Framer Motion, formulario de contacto con EmailJS y optimización SEO avanzada con meta tags para redes sociales.',
    tags: ['React', 'Vite', 'Three.js', 'Firebase', 'Framer Motion', 'SEO'],
    color: '#367C2B',
    status: 'Live',
    github: 'https://github.com/franco',
    demo: 'https://www.equivalenteagro.com.ar/',
    year: '2025',
  },
  {
    id: 7,
    title: 'De Ternera',
    description: 'PWA de compras de carne de calidad online. Catálogo de productos, carrito de compras, sistema de turnos y pedidos. UI moderna con Chakra UI, animaciones con Framer Motion y gestión de estado con Redux.',
    tags: ['React', 'Chakra UI', 'Redux', 'Framer Motion', 'PWA', 'Axios'],
    color: '#cc3300',
    status: 'Live',
    github: 'https://github.com/franco',
    demo: 'https://www.deternera.com.ar/',
    year: '2024',
  },
  {
    id: 8,
    title: 'El Mundo de la Parrilla',
    description: 'Sitio institucional para restaurante parrilla tradicional de Bahía Blanca. Menú interactivo con filtros, galería de fotos, sección de eventos y reservas directas por WhatsApp. Sitio bilingüe español/inglés.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'WhatsApp API'],
    color: '#ff4400',
    status: 'Live',
    github: 'https://github.com/franco',
    demo: 'https://www.elmundodelaparrilla.com/',
    year: '2024',
  },
  {
    id: 9,
    title: 'Gregories — Alquimystic',
    description: 'E-commerce completo con panel de administración, carrito de compras, checkout, autenticación de usuarios, gestión de productos y pedidos. Visualización 3D de productos con Three.js y analytics integrados.',
    tags: ['React', 'TypeScript', 'Firebase', 'Mantine UI', 'Three.js', 'Zustand'],
    color: '#ff6600',
    status: 'En desarrollo',
    github: 'https://github.com/franco',
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
    github: 'https://github.com/franco',
    demo: '#',
    year: '2026',
  },
];

const filters = ['Todos', 'React', 'Next.js', 'React Native', 'Firebase', 'TypeScript'];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    trackInteraction('project_click', project.title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="neon-card relative overflow-hidden group cursor-pointer"
      style={hovered ? { borderColor: project.color, boxShadow: `0 0 20px ${project.color}20` } : {}}
    >
      {/* Top accent bar */}
      <motion.div
        className="h-px w-0 group-hover:w-full transition-all duration-700"
        style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }}
        animate={{ width: hovered ? '100%' : '0%' }}
      />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: project.color }}>
              {String(project.id).padStart(2, '0')} / {project.year}
            </p>
            <h3 className="font-display text-base sm:text-lg font-bold text-cyber-white group-hover:text-white transition-colors">
              {project.title}
            </h3>
          </div>
          <span
            className="flex-shrink-0 text-xs font-mono px-2 py-1 border"
            style={{
              borderColor: `${project.color}60`,
              color: project.color,
            }}
          >
            {project.status}
          </span>
        </div>

        {/* Description */}
        <p className="font-mono text-sm text-cyber-white/60 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs font-mono text-cyber-white/40 border border-cyber-white/10 px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-2" onClick={handleClick}>
          {project.demo && project.demo !== '#' && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs hover:text-cyber-cyan transition-colors text-cyber-white/50"
              onClick={e => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver sitio
            </a>
          )}
        </div>
      </div>

      {/* Animated corner */}
      <div className="absolute bottom-0 right-0 w-8 h-8" style={{ borderTop: `1px solid ${project.color}40`, borderLeft: `1px solid ${project.color}40` }} />
    </motion.div>
  );
}

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const filtered = activeFilter === 'Todos'
    ? projects
    : projects.filter(p => p.tags.includes(activeFilter));

  return (
    <section id="projects" ref={ref} className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-navy/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
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
          className="flex flex-wrap gap-3 mb-10"
        >
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 font-mono text-xs uppercase tracking-widest border transition-all duration-200 ${
                activeFilter === f
                  ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10'
                  : 'border-cyber-white/20 text-cyber-white/40 hover:border-cyber-white/40'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
