"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  ArrowRight, 
  Layers, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Globe,
  Camera,
  Lightbulb,
  Lock,
  Home
} from 'lucide-react';
import ContactModal from './ContactModal';

const FloatingIcon = ({ icon: Icon, delay = 0, x = 0, y = 0 }: { icon: any, delay?: number, x?: number, y?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ 
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.1, 1],
      y: [y, y - 20, y],
      x: [x, x + 10, x]
    }}
    viewport={{ once: false }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className="absolute text-[#1e3a8a]/20"
    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
  >
    <Icon size={32} strokeWidth={1} />
  </motion.div>
);

const AntigravityCore = () => (
  <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
    {/* Wireframe Field */}
    <div className="absolute inset-0 opacity-[0.05]" 
      style={{
        backgroundImage: `
          linear-gradient(to right, #1e3a8a 1px, transparent 1px),
          linear-gradient(to bottom, #1e3a8a 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        transform: 'perspective(500px) rotateX(60deg) translateY(-50%)',
      }}
    />
    
    {/* Central Core Glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#1e3a8a]/5 blur-[60px] rounded-full" />
    
    <FloatingIcon icon={Camera} delay={0} x={-60} y={-40} />
    <FloatingIcon icon={Lightbulb} delay={1} x={60} y={-30} />
    <FloatingIcon icon={Lock} delay={2} x={-40} y={40} />
    <FloatingIcon icon={Home} delay={3} x={50} y={50} />
  </div>
);

interface Product {
  id: string;
  name: string;
  description: string;
  price?: string | null;
  imageUrl?: string | null;
  features: string; // JSON string
  slug: string;
  isActive: boolean;
}

export default function Products({ initialProducts }: { initialProducts: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const products = initialProducts.filter(p => p.isActive);


  return (
    <section className="relative pt-4 pb-24">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12">
          {products.map((product, idx) => {
            const features = (() => {
              try {
                return JSON.parse(product.features || "[]");
              } catch {
                return [];
              }
            })();
            return (
              <div
                key={product.id}
                className="group relative bg-white/90 backdrop-blur-sm flex flex-col transition-all duration-500 ease-out border border-zinc-200/60 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 h-full"
              >
                {/* Product Image Section */}
                <div className="relative h-60 w-full overflow-hidden bg-zinc-50 border-b border-zinc-200/50">
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill
                      className="object-cover grayscale-[10%] transition-transform duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <AntigravityCore />
                      <Layers className="text-zinc-300 w-12 h-12 animate-pulse" strokeWidth={1} />
                    </div>
                  )}
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] to-transparent pointer-events-none" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 p-8 sm:p-10 flex flex-col flex-1 justify-between">
                  <div className="mb-8">
                    <div className="flex items-start justify-between mb-6 gap-4">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-poppins tracking-tight leading-tight">
                        {product.name}
                      </h3>
                      {product.price && (
                        <div className="flex flex-col items-end shrink-0 text-right">
                          <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-poppins tracking-tight tabular-nums">
                            {product.price.includes('/') ? product.price.split('/')[0] : product.price}
                          </span>
                          {product.price.includes('/') && (
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                              per {product.price.split('/')[1]}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="text-zinc-500 font-medium text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                      {product.description}
                    </p>

                    <div className="space-y-4">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block border-b border-zinc-100/80 pb-2">Core Specifications</span>
                      <div className="flex flex-wrap gap-2 pt-1">
                         {features.map((f: string, i: number) => (
                           <span 
                             key={i} 
                             className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-50 border border-zinc-200/60 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-300 transition-all duration-300 cursor-default"
                           >
                              {f}
                           </span>
                         ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mt-6">
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2.5 bg-zinc-950 text-white font-poppins font-semibold text-sm sm:text-base py-4 rounded-2xl hover:bg-zinc-800 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 active:scale-[0.98]"
                    >
                      <span>Contact Us</span>
                      <ArrowRight size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in-up">
           <h2 className="flex flex-col items-center leading-none mb-6">
             <span className="text-6xl sm:text-7xl md:text-[10rem] font-black text-zinc-950 tracking-tighter font-poppins -mb-2 md:-mb-6">
               PRODUCTS
             </span>
             <span className="text-7xl md:text-9xl font-normal text-zinc-950 font-italianno">
               Coming soon
             </span>
           </h2>
           <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-md">
             We're currently preparing something special for you.
           </p>
        </div>
      )}

      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </section>
  );
}
