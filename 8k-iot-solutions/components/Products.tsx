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
  ShoppingCart
} from 'lucide-react';
import ContactModal from './ContactModal';

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

  // Bento Grid Span Logic
  const getSpanClass = (index: number) => {
    const layout = [
      "md:col-span-2 md:row-span-2", // 0: Large
      "md:col-span-1 md:row-span-2", // 1: Tall
      "md:col-span-1 md:row-span-1", // 2: Small
      "md:col-span-1 md:row-span-1", // 3: Small
      "md:col-span-2 md:row-span-1", // 4: Wide
    ];
    return layout[index % layout.length];
  };

  return (
    <section className="relative py-20 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        {products.map((product, idx) => {
          const features = JSON.parse(product.features || "[]");
          const spanClass = getSpanClass(idx);
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`group relative overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-200 hover:-translate-y-1 ${spanClass}`}
            >
              {/* Product Background Image/Pattern */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-50 to-zinc-100 opacity-50" />
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-[1]" />
              </div>

              {/* Content Container */}
              <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-zinc-900 rounded-2xl shadow-lg shadow-zinc-200 group-hover:scale-110 transition-transform duration-500">
                       <Layers size={20} className="text-white" />
                    </div>
                    {product.price && (
                      <span className="text-[13px] font-bold text-brand-900 bg-brand-50/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-brand-100 italic">
                        {product.price}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-950 font-poppins tracking-tight mb-3">
                    {product.name}
                  </h3>
                  <p className="text-zinc-500 font-medium text-sm md:text-base leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {features.slice(0, 3).map((f: string, i: number) => (
                      <span key={i} className="text-[11px] font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-lg uppercase tracking-wider">
                        {f}
                      </span>
                    ))}
                    {features.length > 3 && (
                      <span className="text-[11px] font-bold text-zinc-300 px-1 py-1 uppercase tracking-wider">
                        +{features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl py-4 font-bold text-sm transition-all duration-300 shadow-xl shadow-zinc-200 group/btn"
                  >
                    <span>Start Project</span>
                    <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                  
                  <div className="h-14 w-14 rounded-2xl border border-zinc-200 flex items-center justify-center bg-white/50 backdrop-blur-sm group-hover:bg-zinc-50 transition-colors">
                     <Cpu size={20} className="text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* Decorative Corner Glow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-zinc-400/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          );
        })}
      </div>

      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Background Decorative Mesh Tip */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none opacity-[0.03] z-[-1]" 
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </section>
  );
}
