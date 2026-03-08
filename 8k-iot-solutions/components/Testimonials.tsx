"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    name: "Sir Jayson",
    position: "Thesis Adviser · TUPV",
    trust: "Verified Advisor",
    text: "The technical precision 8K IoT Solutions brings to hardware prototyping is impressive. Their parking detection system is a testament to their engineering growth.",
    avatar: "" // Fallback to initials
  },
  {
    name: "Sherack Dojillo",
    position: "Project Partner · IoT Collaboration",
    trust: "Project Partner",
    text: "Collaborating with AG on IoT projects like the automatic fish skin dryer showed me how hardware and software can truly be integrated seamlessly.",
    avatar: ""
  },
  {
    name: "Technowatch Admin",
    position: "Client · Platform Development",
    trust: "Verified Client",
    text: "8K built our organizational platform with a focus on speed and clean UI. Their student-led approach doesn't compromise on professional standards.",
    avatar: ""
  },
  {
    name: "Adriano's Coffee",
    position: "Business Owner · Branding & Tech",
    trust: "Verified Client",
    text: "From marketing logos to technical advice, 8K has been an essential partner in launching our physical and digital presence.",
    avatar: ""
  }
];

// Duplicate for seamless marquee looping
const duplicatedTestimonials = [...testimonials, ...testimonials];

const getInitials = (name: string) => {
  const words = name.trim().split(' ');
  if (words.length > 1) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-24 bg-zinc-50 overflow-hidden z-0 border-t border-zinc-100">
      
      {/* --- PREMIUM BACKGROUND LAYERS --- */}
      
      {/* 1. Aurora Gradient Glows */}
      {/* Soft blue glow top-left */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
      {/* Soft indigo glow bottom-right */}
      <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-400/20 rounded-full blur-[120px] mix-blend-multiply pointer-events-none" />
      {/* Subtle brand glow center */}
      <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-brand-300/15 rounded-full blur-[100px] mix-blend-multiply pointer-events-none" />

      {/* 2. Grain/Noise Texture Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none mix-blend-overlay" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      {/* --- SECTION HEADER --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold tracking-tight text-zinc-900 mb-4">
            What People Say
          </h2>
          <p className="text-sm md:text-base text-zinc-500 font-medium max-w-2xl mx-auto">
            Feedback from collaborators, advisors, and organizations we’ve worked with.
          </p>
        </div>
      </div>

      {/* --- CARDS & MARQUEE --- */}
      <div className="relative z-10">
        <div className="flex overflow-hidden group/marquee mask-image-linear">
          <div className="flex animate-scroll-horizontal hover:[animation-play-state:paused] whitespace-nowrap py-6">
            {duplicatedTestimonials.map((item, idx) => (
              <div 
                key={idx} 
                className="relative inline-block w-[350px] sm:w-[420px] mx-4 bg-white/90 backdrop-blur-sm border border-white/60 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 ease-out group select-none whitespace-normal flex flex-col h-[280px]"
              >
                {/* Oversized Subtle Quote Mark Background */}
                <div className="absolute -top-4 right-4 text-zinc-100 opacity-60 font-serif text-9xl leading-none select-none pointer-events-none z-0">
                  &ldquo;
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mb-5 relative z-10 shrink-0">
                  {/* Avatar Frame - Uses Initials Fallback if no image */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-100 group-hover:border-zinc-200 transition-colors duration-300 shrink-0 shadow-sm">
                    {item.avatar ? (
                      <img 
                        src={item.avatar} 
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-zinc-600 font-bold font-sans text-sm">
                        {getInitials(item.name)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-zinc-900 text-[16px] leading-tight group-hover:text-brand-900 transition-colors duration-300">
                      {item.name}
                    </h4>
                    <p className="font-poppins text-[11px] font-medium text-zinc-500 mt-1">
                      {item.position}
                    </p>
                  </div>
                </div>

                {/* Testimonial Text Fragment - Clamped */}
                <blockquote className="font-poppins text-zinc-700 text-[14.5px] leading-relaxed line-clamp-3 relative z-10 flex-1">
                  "{item.text}"
                </blockquote>

                {/* Trust Signal / Verification Badge */}
                <div className="mt-4 pt-4 border-t border-zinc-100/80 flex items-center justify-between relative z-10 shrink-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium tracking-wide bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-500/80" strokeWidth={2.5} />
                    {item.trust}
                  </div>
                  <button className="text-[12px] text-zinc-400 hover:text-brand-600 font-medium transition-colors">
                    Read more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Inline styles for the smooth fade mask on the edges of the scrolling container */}
      <style dangerouslySetInnerHTML={{ __html: `
        .mask-image-linear {
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}} />
    </section>
  );
};

export default Testimonials;