'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { trackInteraction } from '@/lib/analytics';

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
    description: 'Plataforma de ranking y gestion del club Padel Pro Bahia. Ranking global, torneos, jugadores, categorias, partidos en curso y sistema de clubes. Frontend inmersivo con escena 3D interactiva.',
    tags: ['React', 'Vite', 'Firebase', 'Redux', 'Three.js', 'Framer Motion'],
    color: '#00f5ff',
    status: 'Live',
    demo: 'https://www.padelproranking.com/',
    year: '2025',
  },
  {
    id: 2,
    title: 'Padel Pro — Backend',
    description: 'API y CMS headless de la plataforma Padel Pro. Gestion de jugadores, torneos, resultados y categorias. Cloudinary como gestor de imagenes y PostgreSQL como base de datos.',
    tags: ['Strapi', 'PostgreSQL', 'Cloudinary', 'Node.js', 'REST API'],
    color: '#ff0080',
    status: 'Live',
    demo: '#',
    year: '2025',
  },
  {
    id: 3,
    title: 'Resera Mobile',
    description: 'Aplicacion movil multiplataforma (iOS/Android) construida con React Native y Expo. Navegacion nativa, autenticacion segura, manejo de imagenes y soporte offline.',
    tags: ['React Native', 'Expo', 'NativeWind', 'Expo Router', 'TypeScript'],
    color: '#7c00ff',
    status: 'En desarrollo',
    demo: 'https://resera-front-tymc.vercel.app/',
    year: '2026',
  },
  {
    id: 4,
    title: 'Storti-Faggiano',
    description: 'Sitio web a medida de un estudio de arquitectura. Galeria de proyectos, animaciones fluidas y formulario de contacto integrado.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    color: '#00ff88',
    status: 'Completado',
    demo: 'https://storti-faggiano.vercel.app/',
    year: '2026',
  },
  {
    id: 5,
    title: 'HormiWhite Web',
    description: 'Landing institucional de empresa de construccion. Orientado a conversion, con integracion a WhatsApp y formularios de captacion de leads.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'ManyChat'],
    color: '#ffee00',
    status: 'Completado',
    demo: 'https://hormiwhite.vercel.app/',
    year: '2026',
  },
  {
    id: 6,
    title: 'Equivalente Agro',
    description: 'Sitio institucional de agencia de marketing agropecuario. Experiencias 3D interactivas, animaciones inmersivas, formulario de contacto con EmailJS y optimizacion SEO.',
    tags: ['React', 'Vite', 'Three.js', 'Firebase', 'Framer Motion', 'SEO'],
    color: '#367C2B',
    status: 'Live',
    demo: 'https://www.equivalenteagro.com.ar/',
    year: '2025',
  },
  {
    id: 7,
    title: 'De Ternera',
    description: 'PWA de compras de carne de calidad online. Catalogo de productos, carrito de compras, sistema de turnos y pedidos. UI moderna con Chakra UI y gestion de estado con Redux.',
    tags: ['React', 'Chakra UI', 'Redux', 'Framer Motion', 'PWA', 'Axios'],
    color: '#cc3300',
    status: 'Live',
    demo: 'https://www.deternera.com.ar/',
    year: '2024',
  },
  {
    id: 8,
    title: 'El Mundo de la Parrilla',
    description: 'Sitio institucional de restaurante parrilla tradicional en Bahia Blanca. Menu interactivo con filtros, galeria de fotos y reservas por WhatsApp. Version bilingue espanol/ingles.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'WhatsApp API'],
    color: '#ff4400',
    status: 'Live',
    demo: 'https://www.elmundodelaparrilla.com/',
    year: '2024',
  },
  {
    id: 9,
    title: 'Gregories — Alquimystic',
    description: 'E-commerce completo con panel de administracion, carrito de compras, checkout, autenticacion de usuarios y gestion de productos. Visualizacion 3D con Three.js y analytics integrados.',
    tags: ['React', 'TypeScript', 'Firebase', 'Mantine UI', 'Three.js', 'Zustand'],
    color: '#ff6600',
    status: 'En desarrollo',
    demo: 'https://www.grupogregori.com.ar/',
    year: '2026',
  },
  {
    id: 10,
    title: 'Portfolio v2',
    description: 'Este mismo portfolio. Next.js 14 App Router, esfera de energia 3D en Three.js, PostgreSQL con Prisma, analytics propio y panel de administracion con estadisticas en tiempo real.',
    tags: ['Next.js', 'Three.js', 'PostgreSQL', 'Prisma', 'Railway'],
    color: '#cc00ff',
    status: 'Live',
    demo: '#',
    year: '2026',
  },
  {
    id: 16,
    title: 'Catalogo Digital Morton',
    description: 'Catalogos y cartas digitales con QR, adaptados a cada negocio. Uno de mis primeros proyectos propios: recorri los paradores de Monte Hermoso ofreciendolo puerta a puerta. Gestion de productos e identidad visual incluida.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Catalogo Digital'],
    color: '#f59e0b',
    status: 'Live',
    demo: 'https://catalogo-digital-morton.vercel.app/',
    year: '2022',
  },
  {
    id: 17,
    title: 'Tecnogen Argentina',
    description: 'Sitio web institucional de empresa de tecnologia y servicios. Diseno profesional, presentacion de soluciones, seccion de contacto y SEO optimizado.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'SEO'],
    color: '#3b82f6',
    status: 'Live',
    demo: 'https://www.tecnogenargentina.com/',
    year: '2025',
  },
  {
    id: 18,
    title: 'Maia — Magical World',
    description: 'Web personal de lectora de tarot. Diseno mistico e inmersivo, presentacion de servicios, galeria visual, formulario de consultas y experiencia fluida con animaciones y paleta oscura.',
    tags: ['React', 'Vite', 'Framer Motion', 'Tailwind CSS'],
    color: '#a855f7',
    status: 'Live',
    demo: 'https://maia-magical-world.vercel.app/',
    year: '2025',
  },
  {
    id: 11,
    title: 'Sixt — Bot de Reservas',
    description: 'Sistema de automatizacion completo de Sixt Renta Car Bahia Blanca. Bot conversacional via WhatsApp con ManyChat: consulta de disponibilidad, cotizaciones automaticas, confirmacion de reservas y seguimiento post-alquiler.',
    tags: ['ManyChat', 'WhatsApp API', 'n8n', 'Automatizacion'],
    color: '#ff9900',
    status: 'Live',
    demo: '#',
    year: '2026',
    type: 'automation',
  },
  {
    id: 12,
    title: 'HormiWhite — Bot de Atencion',
    description: 'Bot conversacional de HormiWhite en WhatsApp. Respuestas automaticas a consultas frecuentes, derivacion al equipo de ventas, seguimiento de clientes con n8n y notificaciones internas en tiempo real.',
    tags: ['ManyChat', 'n8n', 'WhatsApp API', 'Automatizacion'],
    color: '#e8e8e8',
    status: 'Live',
    demo: '#',
    year: '2026',
    type: 'automation',
  },
  {
    id: 13,
    title: 'Dra. Ana Julia Lastre',
    description: 'Automatizacion de gestion de turnos medicos. Bot de WhatsApp que permite solicitar, confirmar y cancelar turnos 24/7, recordatorios automaticos 24h antes de la consulta y sincronizacion con agenda de la profesional.',
    tags: ['ManyChat', 'n8n', 'WhatsApp API', 'Google Calendar', 'Automatizacion'],
    color: '#00d4aa',
    status: 'Live',
    demo: '#',
    year: '2026',
    type: 'automation',
  },
  {
    id: 14,
    title: 'Gregories — Automatizacion',
    description: 'Suite de automatizaciones integradas en la tienda Gregories. Notificaciones de pedidos en tiempo real, recupero de carritos abandonados via WhatsApp, seguimiento de envios y alertas de stock.',
    tags: ['n8n', 'ManyChat', 'WhatsApp API', 'Zapier', 'Automatizacion'],
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
    tags: ['n8n', 'ManyChat', 'WhatsApp API', 'Firebase', 'Automatizacion'],
    color: '#00f5ff',
    status: 'Live',
    demo: '#',
    year: '2026',
    type: 'automation',
  },
];

const FILTERS = ['Todos', 'Automatizacion', 'React', 'Next.js', 'React Native', 'Firebase', 'TypeScript', 'Framer Motion'];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isAuto = project.type === 'automation';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="neon-card relative overflow-hidden group"
      style={hovered ? { borderColor: project.color, boxShadow: `0 0 24px ${project.color}20` } : {}}
      onClick={() => trackInteraction('project_click', project.title)}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-0 group-hover:w-full transition-all duration-700"
        style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }}
      />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: project.color }}>
              {isAuto ? '⚡ Auto' : String(project.id).padStart(2, '0')} / {project.year}
            </p>
            <h3 className="font-display text-base sm:text-lg font-bold text-cyber-white group-hover:text-white transition-colors leading-snug">
              {project.title}
            </h3>
          </div>
          <span
            className="flex-shrink-0 text-xs font-mono px-2 py-1 border"
            style={{ borderColor: `${project.color}50`, color: project.color }}
          >
            {project.status}
          </span>
        </div>

        {/* Description */}
        <p className="font-mono text-xs sm:text-sm text-cyber-white/60 leading-relaxed">
          {project.description}
        </p>

        {/* Tags — informativas, no clickeables */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs font-mono text-cyber-white/40 bg-cyber-white/5 px-2 py-0.5 rounded-sm cursor-default select-none">
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        {project.demo && project.demo !== '#' && (
          <div className="pt-1">
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs transition-colors text-cyber-white/40 hover:text-cyber-cyan"
              onClick={e => e.stopPropagation()}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver sitio
            </a>
          </div>
        )}
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-6 h-6" style={{ borderTop: `1px solid ${project.color}30`, borderLeft: `1px solid ${project.color}30` }} />
    </motion.div>
  );
}

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  useEffect(() => {
    const handler = (e: Event) => {
      setActiveFilter((e as CustomEvent<string>).detail);
    };
    window.addEventListener('projectFilterChange', handler);
    return () => window.removeEventListener('projectFilterChange', handler);
  }, []);

  const filtered = activeFilter === 'Todos'
    ? projects
    : projects.filter(p => p.tags.includes(activeFilter));

  return (
    <section id="projects" ref={ref} className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-navy/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-10"
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
          className="flex flex-wrap gap-2 mb-10 items-center"
        >
          <span className="font-mono text-xs text-cyber-white/30 uppercase tracking-widest mr-1">Filtrar:</span>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-widest border transition-all duration-200 cursor-pointer ${
                activeFilter === f
                  ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_10px_rgba(0,245,255,0.15)]'
                  : 'border-cyber-cyan/25 text-cyber-white/50 hover:border-cyber-cyan/70 hover:text-cyber-cyan/90 hover:bg-cyber-cyan/5'
              }`}
            >
              {activeFilter === f && (
                <svg className="w-2.5 h-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="4" />
                </svg>
              )}
              {f}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
