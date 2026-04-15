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


  return (
    <section className="relative py-20 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product, idx) => {
          const features = JSON.parse(product.features || "[]");
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm flex flex-col transition-all duration-500 hover:shadow-xl hover:shadow-zinc-100 hover:-translate-y-1 h-full"
            >
              {/* Product Image Section */}
              <div className="relative h-56 w-full overflow-hidden bg-zinc-50 border-b border-zinc-100">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <Layers size={48} strokeWidth={1} />
                  </div>
                )}
                {/* Subtle Overlay for consistency */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content Container */}
              <div className="relative z-10 p-8 flex flex-col flex-1 justify-between bg-white">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-900 transition-colors duration-500">
                       <ShoppingCart size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
                    </div>
                    {product.price && (
                      <span className="text-[13px] font-bold text-brand-900 bg-brand-50/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-brand-100 italic">
                        {product.price}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-950 font-poppins tracking-tight mb-3">
                    {product.name}
                  </h3>
                  <p className="text-zinc-500 font-medium text-sm leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {features.slice(0, 3).map((f: string, i: number) => (
                      <span key={i} className="text-[11px] font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-lg uppercase tracking-wider">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl py-4 font-bold text-sm transition-all duration-300 shadow-xl shadow-zinc-200 group/btn"
                  >
                    <span>Start Project</span>
                    <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
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
