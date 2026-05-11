'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar         from '@/components/layout/Navbar';
import Footer         from '@/components/layout/Footer';
import HeroSection    from '@/components/sections/HeroSection';
import AboutSection   from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ContactSection from '@/components/sections/ContactSection';

const CursorFX = dynamic(() => import('@/components/layout/CursorFX'), { ssr: false });

export default function Home() {
  // Track page visit
  useEffect(() => {
    fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/' }),
    }).catch(() => {});
  }, []);

  return (
    <>
      <CursorFX />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
