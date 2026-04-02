import React from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import About from '@/components/About';
import SchoolLogos from '@/components/SchoolLogos';
import Footer from '@/components/Footer';
import SectionUrlSync from '@/components/SectionUrlSync';
import Testimonials from '@/components/Testimonials';

/* ─────────────────────────────────────────────────────────────
 * Below-the-fold sections: dynamically imported to reduce the
 * initial JS bundle. Each uses a layout-preserving skeleton
 * matching the real component's height so there's zero CLS.
 * ───────────────────────────────────────────────────────────── */

const ServicesSection = dynamic(() => import('@/components/Services'), {
  loading: () => (
    <section id="services" className="relative w-full pt-4 lg:pt-6 pb-2 md:pb-4 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header skeleton */}
        <div className="text-center mb-10 md:mb-12">
          <div className="h-12 w-72 bg-zinc-100 rounded-xl mx-auto mb-4 animate-pulse" />
          <div className="h-5 w-96 max-w-full bg-zinc-100 rounded-lg mx-auto animate-pulse" />
        </div>
        {/* Card skeletons */}
        <div className="grid grid-cols-1 gap-12 lg:gap-16 pb-12 md:pb-16">
          <div className="h-[420px] lg:h-[320px] bg-zinc-50 rounded-[2.5rem] border border-zinc-100 animate-pulse" />
          <div className="h-[420px] lg:h-[320px] bg-zinc-50 rounded-[2.5rem] border border-zinc-100 animate-pulse" />
        </div>
      </div>
    </section>
  ),
});

const Team = dynamic(() => import('@/components/Team'), {
  loading: () => (
    <section id="team" className="relative pt-4 lg:pt-8 pb-24 lg:pb-32 bg-transparent overflow-hidden font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="h-12 w-64 bg-zinc-100 rounded-xl mx-auto mb-4 animate-pulse" />
          <div className="h-5 w-80 max-w-full bg-zinc-100 rounded-lg mx-auto animate-pulse" />
        </div>
        {/* Team card skeleton */}
        <div className="space-y-24 lg:space-y-40">
          <div className="flex flex-col lg:flex-row gap-10 items-stretch">
            <div className="w-full lg:w-[480px] aspect-[4/5] bg-blue-50/60 rounded-[40px] animate-pulse" />
            <div className="flex-1 bg-zinc-50 rounded-[40px] p-16 animate-pulse min-h-[300px]" />
          </div>
        </div>
      </div>
    </section>
  ),
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => (
    <section id="faq" className="relative pt-4 pb-24 md:pb-32 bg-transparent overflow-hidden font-poppins">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header skeleton */}
        <div className="text-center mb-16 md:mb-24">
          <div className="h-12 w-72 bg-zinc-100 rounded-xl mx-auto mb-6 animate-pulse" />
          <div className="h-5 w-96 max-w-full bg-zinc-100 rounded-lg mx-auto animate-pulse" />
        </div>
        {/* FAQ item skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[72px] bg-zinc-50 rounded-2xl border border-zinc-100 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  ),
});

const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => (
    <section id="contact" className="relative py-16 lg:py-24 bg-slate-950 overflow-hidden font-poppins">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Left side skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="h-16 w-48 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-20 w-full max-w-md bg-white/5 rounded-xl animate-pulse" />
            <div className="space-y-4 pt-8 border-t border-white/5">
              <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
          {/* Right side form skeleton */}
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="bg-white/[0.02] p-8 lg:p-12 rounded-[2.5rem] border border-white/10 min-h-[500px] animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  ),
});

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
    <div className="relative font-sans antialiased text-gray-900 bg-white selection:bg-brand-200 z-0 overflow-x-hidden">
      <SectionUrlSync />
      
      {/* Blueprint grid — GPU-composited: translates an oversized child instead of animating background-position */}
      <div 
        className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden" 
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0 w-[200%] h-[200%] opacity-[0.6] animate-blueprintShift will-change-transform" 
          style={{
            backgroundImage: 'linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>
      
      {/* Above-the-fold: statically imported for instant render */}
      <Hero 
        heroImages={heroImages} 
        heroSection={heroSection} 
        heroCards={heroCards} 
        schoolLogos={schoolLogos} 
      />
      <SchoolLogos logos={schoolLogos} />
      <Testimonials initialTestimonials={initialTestimonials} />
      <About />

      {/* Below-the-fold: dynamically imported to reduce initial bundle */}
      <ServicesSection />
      <Team members={teamMembers} />
      <FAQ faqs={faqs} />
      <Contact />
      <Footer />
    </div>
  );
}
