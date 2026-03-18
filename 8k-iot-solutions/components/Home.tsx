"use client";

import Hero from '@/components/Hero';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import ServicesSection from '@/components/Services';
import Process from '@/components/Process';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SectionUrlSync from '@/components/SectionUrlSync';

export default function HomeContent({ initialTestimonials = [] }: { initialTestimonials?: any[] }) {
  return (
    <div className="relative font-sans antialiased text-gray-900 bg-white selection:bg-brand-200 z-0">
      <SectionUrlSync />
      
      {/* GLOBAL FIXED BACKGROUND GRID */}
      <div 
        className="fixed inset-0 z-[-10] pointer-events-none opacity-[0.15] animate-blueprintShift" 
        style={{
          backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />
      
      <Hero />
      <Testimonials initialTestimonials={initialTestimonials} />
      <About />
      <ServicesSection />
      <Process />
      <Contact />
      <Footer />
    </div>
  );
}
