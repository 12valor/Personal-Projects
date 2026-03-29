"use client";

import React from 'react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import SchoolLogos from '@/components/SchoolLogos';
import ServicesSection from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SectionUrlSync from '@/components/SectionUrlSync';
import FAQ from '@/components/FAQ';
import Team from '@/components/Team';

export default function HomeContent({ 
  initialTestimonials = [], 
  heroImages = [],
  schoolLogos = [],
  heroSection,
  heroCards = [],
  faqs = [],
  teamMembers = []
}: { 
  initialTestimonials?: any[], 
  heroImages?: any[],
  schoolLogos?: any[],
  heroSection?: any,
  heroCards?: any[],
  faqs?: any[],
  teamMembers?: any[]
}) {
  return (
    <div className="relative font-sans antialiased text-gray-900 bg-white selection:bg-brand-200 z-0">
      <SectionUrlSync />
      
      <div 
        className="fixed inset-0 z-[-10] pointer-events-none opacity-[0.6] animate-blueprintShift" 
        style={{
          backgroundImage: 'linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />
      
      <Hero 
        heroImages={heroImages} 
        heroSection={heroSection} 
        heroCards={heroCards} 
        schoolLogos={schoolLogos} 
      />
      <SchoolLogos logos={schoolLogos} />
      <Testimonials initialTestimonials={initialTestimonials} />
      <About />
      <ServicesSection />
      <Team members={teamMembers} />
      <FAQ faqs={faqs} />
      <React.Suspense fallback={<div className="py-12 bg-slate-950 text-center text-white">Loading contact...</div>}>
        <Contact />
      </React.Suspense>
      <Footer />
    </div>
  );
}
