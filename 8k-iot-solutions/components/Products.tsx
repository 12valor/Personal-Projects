"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    animate={{ 
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.1, 1],
      y: [y, y - 20, y],
      x: [x, x + 10, x]
    }}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {products.map((product, idx) => {
            const features = JSON.parse(product.features || "[]");
            return (
              <div
                key={product.id}
                className="group relative bg-white flex flex-col transition-all duration-300 hover:bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md h-full"
              >
                {/* Product Image Section */}
                <div className="relative h-56 w-full overflow-hidden bg-zinc-100 p-6">
                  <AntigravityCore />
                  <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-[0.03]" 
                    style={{
                      backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                  
                  {product.imageUrl && (
                    <div className="relative w-full h-full border border-zinc-200 bg-white rounded-lg overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
                      />
                    </div>
                  )}
                </div>

                {/* Content Container */}
                <div className="relative z-10 p-8 flex flex-col flex-1 justify-between">
                  <div className="mb-10">
                    <div className="flex items-baseline justify-between mb-8 gap-4">
                      <h3 className="text-3xl font-bold text-zinc-950 font-poppins tracking-tight">
                        {product.name}
                      </h3>
                      {product.price && (
                        <div className="flex-shrink-0">
                          <span className="text-3xl font-bold text-zinc-950 font-poppins tabular-nums">
                            {product.price.split('/')[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-zinc-500 font-medium text-base leading-relaxed mb-8 max-w-md">
                      {product.description}
                    </p>

                    <div className="space-y-3 mb-10">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-4 border-b border-zinc-100 pb-2">Core Specifications</span>
                      <div className="grid grid-cols-1 gap-y-3">
                         {features.map((f: string, i: number) => (
                           <div key={i} className="flex items-center gap-3 group/feat">
                              <div className="w-1 h-1 rounded-full bg-zinc-300 group-hover/feat:bg-[#1e3a8a] transition-colors" />
                              <span className="text-sm font-medium text-zinc-600 group-hover/feat:text-zinc-950 transition-colors">{f}</span>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="flex-1 flex items-center justify-center gap-3 bg-[#1e3a8a] text-white rounded-lg py-4 px-6 font-bold text-base transition-all duration-300 hover:bg-[#172554] active:scale-[0.98] shadow-lg shadow-[#1e3a8a]/10"
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
             <span className="text-5xl md:text-8xl font-black text-zinc-950 tracking-tighter font-poppins mb-2">
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

      {/* Decorative Grid Marker */}
      <div className="absolute top-0 right-0 p-4 select-none pointer-events-none">
         <span className="text-[10px] font-mono text-zinc-200 rotate-90 block tracking-widest">TS-8K-SYS-v001</span>
      </div>
    </section>
  );
}
