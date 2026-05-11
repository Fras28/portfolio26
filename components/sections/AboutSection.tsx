'use client';

import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import Image from 'next/image';

const skills = [
  { name: 'Frontend',   items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { name: 'Backend',    items: ['Node.js', 'NestJS', 'Express', 'Strapi', 'REST APIs', 'WebSockets'] },
  { name: 'Database',   items: ['PostgreSQL', 'MongoDB', 'Prisma', 'Redis'] },
  { name: 'DevOps',     items: ['Docker', 'Railway', 'Vercel', 'GitHub Actions', 'Linux'] },
  { name: 'Mobile',     items: ['React Native', 'Expo', 'NativeWind', 'Expo Router'] },
  { name: 'Automation', items: ['Python', 'Puppeteer', 'n8n', 'ManyChat', 'Zapier'] },
];

function SkillBar({ level, color = '#00f5ff' }: { level: number; color?: string }) {
  return (
    <div className="w-full h-1 bg-cyber-navy relative overflow-hidden">
      <motion.div
        className="h-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  );
}

export default function AboutSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="about" ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-dark/50 to-transparent pointer-events-none" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-3/4 bg-gradient-to-b from-transparent via-cyber-cyan/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="font-mono text-cyber-pink text-xs tracking-widest uppercase mb-2">
            {'>'} Protocolo de identificación
          </p>
          <h2 className="section-title text-4xl sm:text-5xl font-black">
            <span className="text-cyber-white">SOBRE</span>{' '}
            <span className="text-gradient-cyber">MÍ</span>
          </h2>
          <div className="mt-4 w-24 h-px bg-gradient-to-r from-cyber-cyan to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Photo + bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            {/* Photo */}
            <div className="relative w-64 h-64 mx-auto lg:mx-0">
              {/* Rotating ring */}
              <div className="absolute -inset-3 border border-cyber-cyan/30 rounded-none animate-spin-slow" />
              <div className="absolute -inset-6 border border-cyber-pink/15 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />

              {/* Photo frame */}
              <div className="relative w-full h-full cyber-border overflow-hidden">
                <div className="glitch-img absolute inset-0"
                  style={{ backgroundImage: 'url(/images/franco.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <Image
                  src="/images/franco.png"
                  alt="Franco Selvarolo"
                  fill
                  className="object-cover"
                  style={{ filter: 'contrast(1.1) saturate(0.9)' }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 mix-blend-color-dodge bg-gradient-to-br from-cyber-cyan/10 to-cyber-pink/10" />
              </div>

              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan" />

              {/* Status */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="font-mono text-xs text-cyber-green tracking-widest px-3 py-1 border border-cyber-green/30 bg-cyber-black">
                  ● ONLINE
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-4 font-mono text-sm text-cyber-white/70 leading-relaxed">
              <p>
                <span className="text-cyber-cyan">&gt; </span>
                Soy desarrollador web y especialista en automatizaciones. Actualmente trabajo
                para <span className="text-cyber-cyan">Equivalente</span>, agencia de marketing
                agropecuario, donde desarrollo el sitio web y los sistemas de captación digital
                del equipo.
              </p>
              <p>
                <span className="text-cyber-pink">&gt; </span>
                También trabajo con <span className="text-cyber-pink">Madison Marketing Bahía Blanca</span>,
                diseñando flujos de automatización con ManyChat y n8n para campañas de sus clientes.
              </p>
              <p>
                <span className="text-cyber-purple">&gt; </span>
                En paralelo desarrollo proyectos propios bajo <span className="text-cyber-purple">Morton Desarrollos</span>:
                apps web, móviles y soluciones a medida con React, Next.js, React Native, Nest.js y Strapi.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '3+',    label: 'Años exp.' },
                { value: '20+',   label: 'Proyectos' },
                { value: '100%',  label: 'Dedicación' },
              ].map(stat => (
                <div key={stat.label} className="neon-card p-4 text-center">
                  <p className="font-display text-2xl font-black text-cyber-cyan">{stat.value}</p>
                  <p className="font-mono text-xs text-cyber-white/40 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="font-display text-lg font-bold text-cyber-cyan uppercase tracking-widest">
              Stack técnico
            </h3>

            {skills.map((group, gi) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + gi * 0.1 }}
                className="neon-card p-4 space-y-3"
              >
                <p className="font-mono text-xs text-cyber-pink uppercase tracking-widest">
                  {String(gi + 1).padStart(2, '0')} {group.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <span
                      key={item}
                      className="px-2 py-1 text-xs font-mono border border-cyber-cyan/20 text-cyber-white/60 hover:border-cyber-cyan/60 hover:text-cyber-cyan transition-all duration-200 cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Download CV */}
            <motion.a
              href="/cv.pdf"
              download
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-cyber w-full justify-center mt-4"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar CV
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
