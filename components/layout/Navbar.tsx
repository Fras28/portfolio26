'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '#about',      label: 'Sobre mí',   code: '01' },
  { href: '#projects',   label: 'Proyectos',  code: '02' },
  { href: '#experience', label: 'Experiencia',code: '03' },
  { href: '#contact',    label: 'Contacto',   code: '04' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [active, setActive]       = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-cyber-black/90 backdrop-blur-md border-b border-cyber-cyan/20' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 border border-cyber-cyan relative">
              <div className="absolute inset-0 bg-cyber-cyan/10" />
              <div className="absolute inset-1 bg-cyber-cyan/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyber-cyan" />
            </div>
            <span className="font-display text-sm font-bold tracking-widest text-cyber-cyan group-hover:animate-glitch">
              FS<span className="text-cyber-pink">.DEV</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="group relative flex flex-col items-start gap-0.5"
              >
                <span className="text-cyber-cyan/40 font-mono text-xs">{link.code}</span>
                <span className="text-cyber-white/70 font-mono text-xs tracking-widest uppercase hover:text-cyber-cyan transition-colors duration-200">
                  {link.label}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyber-cyan group-hover:w-full transition-all duration-300" />
              </a>
            ))}

            <a
              href="/admin"
              className="btn-cyber btn-cyber-pink text-xs py-2 px-4"
            >
              Admin
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className="block w-6 h-px bg-cyber-cyan"
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              className="block w-6 h-px bg-cyber-cyan"
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className="block w-6 h-px bg-cyber-cyan"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-cyber-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setMenuOpen(false)}
                className="text-cyber-white font-display text-2xl font-bold uppercase tracking-widest hover:text-cyber-cyan transition-colors"
              >
                <span className="text-cyber-pink text-sm mr-2">{link.code}</span>
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
