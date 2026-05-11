'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trackInteraction } from '@/lib/analytics';

const schema = z.object({
  name:    z.string().min(2, 'Mínimo 2 caracteres'),
  email:   z.string().email('Email inválido'),
  subject: z.string().min(3, 'Mínimo 3 caracteres'),
  message: z.string().min(10, 'Mínimo 10 caracteres'),
});

type FormData = z.infer<typeof schema>;

const socials = [
  {
    name: 'GitHub',
    handle: '@franco',
    href: 'https://github.com/franco',
    color: '#00f5ff',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'Email',
    handle: 'fselvarolo28@gmail.com',
    href: 'mailto:fselvarolo28@gmail.com',
    color: '#7c00ff',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    handle: '+54 291 572 9501',
    href: 'https://wa.me/5492915729501',
    color: '#00ff88',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const {
    register, handleSubmit, reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus('sending');
    trackInteraction('contact_submit', 'form');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) { setStatus('success'); reset(); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  const inputClass = (error?: string) => `
    w-full bg-cyber-navy border font-mono text-sm text-cyber-white placeholder-cyber-white/25
    px-4 py-3 focus:outline-none transition-all duration-200
    ${error
      ? 'border-red-500/60 focus:border-red-500'
      : 'border-cyber-cyan/20 focus:border-cyber-cyan focus:shadow-neon-cyan'
    }
  `;

  return (
    <section id="contact" ref={ref} className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-dark/60 to-cyber-black pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <p className="font-mono text-cyber-pink text-xs tracking-widest uppercase mb-2">
            {'>'} Establecer conexión
          </p>
          <h2 className="section-title text-4xl sm:text-5xl font-black">
            <span className="text-cyber-white">HABLEMOS</span>
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent" />
          <p className="mt-6 font-mono text-sm text-cyber-white/50 max-w-md mx-auto">
            Tenés un proyecto en mente o querés colaborar? Mandame un mensaje y respondo a la brevedad.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="neon-card p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-mono text-xs text-cyber-cyan/70 uppercase tracking-widest block mb-2">
                    Nombre
                  </label>
                  <input
                    {...register('name')}
                    placeholder="Tu nombre"
                    className={inputClass(errors.name?.message)}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs font-mono text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="font-mono text-xs text-cyber-cyan/70 uppercase tracking-widest block mb-2">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    placeholder="tu@email.com"
                    className={inputClass(errors.email?.message)}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs font-mono text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-cyber-cyan/70 uppercase tracking-widest block mb-2">
                  Asunto
                </label>
                <input
                  {...register('subject')}
                  placeholder="¿De qué se trata?"
                  className={inputClass(errors.subject?.message)}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs font-mono text-red-400">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="font-mono text-xs text-cyber-cyan/70 uppercase tracking-widest block mb-2">
                  Mensaje
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  placeholder="Contame sobre tu proyecto..."
                  className={inputClass(errors.message?.message) + ' resize-none'}
                />
                {errors.message && (
                  <p className="mt-1 text-xs font-mono text-red-400">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-cyber w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full" />
                    Enviando...
                  </>
                ) : 'Enviar mensaje'}
              </button>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-cyber-green font-mono text-sm text-center"
                >
                  ✓ Mensaje enviado. ¡Te respondo pronto!
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 font-mono text-sm text-center"
                >
                  ✗ Error al enviar. Intentá de nuevo.
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="flex flex-col justify-center gap-6"
          >
            <h3 className="font-display text-lg font-bold text-cyber-white uppercase tracking-widest">
              Otras formas de contacto
            </h3>

            {socials.map((s, i) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                onClick={() => trackInteraction('social_click', s.name)}
                whileHover={{ x: 8 }}
                className="neon-card p-5 flex items-center gap-4 group"
                style={{ '--hover-color': s.color } as React.CSSProperties}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center border transition-all duration-300"
                  style={{
                    borderColor: `${s.color}40`,
                    color: s.color,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-cyber-white group-hover:text-cyber-cyan transition-colors">
                    {s.name}
                  </p>
                  <p className="font-mono text-xs text-cyber-white/40">{s.handle}</p>
                </div>
                <div className="ml-auto">
                  <svg className="w-4 h-4 text-cyber-white/20 group-hover:text-cyber-cyan transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
