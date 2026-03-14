"use client";

import React from 'react';
import Image from 'next/image';
import { useInView, getFadeUpClasses, getStaggerStyle } from '@/lib/animations';

const testimonials = [
  {
    name: "Sir Jayson",
    position: "Thesis Adviser, TUPV",
    text: "The technical precision 8K IoT Solutions brings to hardware prototyping is impressive. Their parking detection system is a testament to their engineering growth.",
    avatar: "/avatars/jayson.jpg" // Ensure these paths exist or use placeholders
  },
  {
    name: "Sherack Dojillo",
    position: "Project Partner",
    text: "Collaborating with AG on IoT projects like the automatic fish skin dryer showed me how hardware and software can truly be integrated seamlessly.",
    avatar: "/avatars/sherack.jpg"
  },
  {
    name: "Technowatch Admin",
    position: "Client",
    text: "8K built our organizational platform with a focus on speed and clean UI. Their student-led approach doesn't compromise on professional standards.",
    avatar: "/avatars/tech.jpg"
  },
  {
    name: "Adriano's Coffee",
    position: "Business Owner",
    text: "From marketing logos to technical advice, 8K has been an essential partner in launching our physical and digital presence.",
    avatar: "/avatars/coffee.jpg"
  }
];

// Duplicate for seamless looping
const duplicatedTestimonials = [...testimonials, ...testimonials];

const Testimonials = () => {
  const [setRef, inView] = useInView();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <section className="relative py-10 md:py-12 bg-transparent overflow-hidden z-0" ref={setRef as any}>

      {/* Floating Gradient Orbs for Depth */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <div className="relative z-10">
        {/* Continuous Horizontal Scroll Track */}
        <div className="flex overflow-hidden">
          <div className="flex animate-scroll-horizontal whitespace-nowrap py-6">
            {duplicatedTestimonials.map((item, idx) => (
              <div 
                key={idx} 
                className="inline-block w-[350px] sm:w-[450px] mx-4 bg-white border border-gray-100 p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group select-none"
              >
                <div className="flex items-center gap-4 mb-6">
                  {/* Avatar Frame */}
                  <div 
                    className={`relative z-10 ${getFadeUpClasses(inView, 'translate-y-12')}`}
                    style={getStaggerStyle(inView, 0)}
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-100 group-hover:border-brand-500 transition-colors duration-300">
                      <Image 
                        src={item.avatar} 
                        alt={item.name}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-gray-900 text-lg leading-tight">
                      {item.name}
                    </h4>
                    <p className="font-poppins text-xs font-semibold text-brand-600 uppercase tracking-widest mt-1">
                      {item.position}
                    </p>
                  </div>
                </div>

                <blockquote className="font-poppins text-gray-600 text-[15px] leading-relaxed italic whitespace-normal line-clamp-3">
                  &quot;{item.text}&quot;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;