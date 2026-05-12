'use client';

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

// ── Edit your experience here ──
const experiences = [
  {
    type: 'work',
    title: 'Desarrollador Web & Automatizaciones',
    company: 'Equivalente — Agencia de Marketing Agropecuario',
    period: '2025 — Presente',
    description: 'Desarrollo web y automatizaciones para el equipo interno de la agencia. Creación del sitio institucional con experiencias 3D interactivas, integración con Firebase y estrategias de captación digital.',
    tags: ['React', 'Three.js', 'Firebase', 'Framer Motion', 'n8n', 'ManyChat'],
    color: '#00f5ff',
  },
  {
    type: 'work',
    title: 'Especialista en Automatizaciones',
    company: 'Madison Marketing — Bahía Blanca',
    period: '2025 — Presente',
    description: 'Diseño e implementación de flujos de automatización para clientes de la agencia. Bots conversacionales con ManyChat, integraciones y workflows con n8n: atención automática, gestión de consultas y notificaciones internas.',
    tags: ['ManyChat', 'n8n', 'WhatsApp API', 'Zapier'],
    color: '#ff0080',
  },
  {
    type: 'work',
    title: 'Full Stack Developer',
    company: 'Morton Desarrollos — Freelance',
    period: '2023 — Presente',
    description: 'Desarrollo de aplicaciones web y móviles para clientes de distintas industrias. Proyectos propios y para terceros: e-commerce, dashboards, landings y apps React Native.',
    tags: ['Next.js', 'React Native', 'Node.js', 'Strapi', 'PostgreSQL'],
    color: '#7c00ff',
  },
  {
    type: 'work',
    title: 'Desarrollador — Equipo Tecnológico',
    company: 'Municipalidad de Bahía Blanca',
    period: '2022 — 2023',
    description: 'Participación en el equipo de desarrollo tecnológico municipal. Trabajo en sistemas internos, herramientas digitales para gestión pública y experiencia en entornos de desarrollo institucional.',
    tags: ['Desarrollo Web', 'Sistemas Internos', 'Gestión Pública'],
    color: '#00aaff',
  },
  {
    type: 'education',
    title: 'Full Stack Web Developer',
    company: 'Henry Bootcamp',
    period: '2022 — 2023',
    description: 'Bootcamp intensivo de más de 800 horas de programación. Formación en desarrollo web full stack con JavaScript, React, Redux, Node.js, Express, PostgreSQL y metodologías ágiles. Proyecto final grupal con deploy en producción.',
    tags: ['JavaScript', 'React', 'Redux', 'Node.js', 'Express', 'PostgreSQL'],
    color: '#00ff88',
    cert: 'https://certificates.soyhenry.com/cert?id=98a42830-8ee6-492d-9b6a-55d092249020',
  },
];

export default function ExperienceSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="experience" ref={ref} className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-dark/40 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="font-mono text-cyber-pink text-xs tracking-widest uppercase mb-2">
            {'>'} Registro de misiones completadas
          </p>
          <h2 className="section-title text-4xl sm:text-5xl font-black">
            <span className="text-cyber-white">EXPERIENCIA</span>
          </h2>
          <div className="mt-4 w-24 h-px bg-gradient-to-r from-cyber-cyan to-transparent" />
        </motion.div>

        {/* Timeline — single column, works on all screens */}
        <div className="relative pl-6 sm:pl-8">
          {/* Vertical line */}
          <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-cyan/60 via-cyber-pink/30 to-transparent" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div
                  className="absolute -left-6 sm:-left-8 top-4 w-4 h-4 rounded-full border-2 z-10 flex items-center justify-center"
                  style={{ borderColor: exp.color, backgroundColor: '#04060f', boxShadow: `0 0 8px ${exp.color}` }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: exp.color }} />
                </div>

                {/* Card */}
                <div
                  className="neon-card p-4 sm:p-6 space-y-3"
                  style={{ borderColor: `${exp.color}30`, borderLeftColor: exp.color, borderLeftWidth: '2px' }}
                >
                  {/* Header row */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span
                      className="font-mono text-xs uppercase tracking-widest px-2 py-0.5 border"
                      style={{ color: exp.color, borderColor: `${exp.color}40` }}
                    >
                      {exp.type === 'work' ? '⚡ Trabajo' : '🎓 Educación'}
                    </span>
                    <span className="font-mono text-xs text-cyber-white/40">{exp.period}</span>
                  </div>

                  <div>
                    <h3 className="font-display text-sm sm:text-base font-bold text-cyber-white leading-snug">{exp.title}</h3>
                    <p className="font-mono text-sm mt-0.5" style={{ color: exp.color }}>{exp.company}</p>
                  </div>

                  <p className="font-mono text-xs sm:text-sm text-cyber-white/60 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2 py-0.5 bg-cyber-white/5 text-cyber-white/40 rounded-sm cursor-default select-none"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {'cert' in exp && exp.cert && (
                    <a
                      href={exp.cert as string}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs transition-colors pt-1"
                      style={{ color: exp.color }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Ver certificado
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
