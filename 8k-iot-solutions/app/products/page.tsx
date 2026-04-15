import { prisma } from '@/lib/prisma';
import Products from '@/components/Products';
import PageHeaderParallax from '@/components/PageHeaderParallax';
import ProjectBreadcrumbs from '@/components/ProjectBreadcrumbs';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const metadata = {
  title: "Products | 8K IoT Solutions",
  description: "Explore our premium, pre-made software solutions for IoT ecosystems, fleet tracking, and industrial analytics.",
};

export default async function ProductsPage() {
  const products = await (prisma as any).product.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] font-poppins">
      {/* Blueprint Grid Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-100 animate-blueprintShift" 
        style={{
          backgroundImage: 'linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-[#FAFAFA]/60 to-[#FAFAFA] opacity-40 z-0" />

      {/* Spacer for fixed navbar */}
      <div className="relative z-10 h-[80px] md:h-[100px]" />
      
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 py-8">
        
        {/* Header Section */}
        <PageHeaderParallax>
          <div className="mb-10">
            <Link 
              href="/" 
              className="group inline-flex items-center text-sm font-bold text-zinc-400 hover:text-brand-900 transition-colors mb-6 uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            
            <ProjectBreadcrumbs currentPage="Software Products" />
            
            <div className="mt-4 md:mt-8 border-b border-zinc-200 pb-8">
              <div className="max-w-3xl text-left">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-950 mb-6">
                  Ready-to-deploy <br />
                  <span className="text-zinc-300">Software Units.</span>
                </h1>
                <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-xl">
                  Smart, reliable software units built to help you connect your hardware and manage your projects with ease.
                </p>
              </div>
            </div>
          </div>
        </PageHeaderParallax>

        {/* Product Showcase */}
        <div className="mt-4">
          <Products initialProducts={products} />
        </div>

        {/* Why choose section */}
        <div className="mt-8 mb-20 md:grid md:grid-cols-3 gap-12 border-t border-zinc-200 pt-8">
           <div>
              <h2 className="text-3xl font-bold text-zinc-950 font-poppins mb-6">Why our pre-made software?</h2>
              <p className="text-zinc-500 leading-relaxed font-medium">
                Custom development takes time. Our solutions provide a solid foundation that can be deployed in days, not months, while remaining fully customizable to your unique requirements.
              </p>
           </div>
           
           <div className="mt-12 md:mt-0 md:col-span-2 grid md:grid-cols-2 gap-x-16 gap-y-12">
              <div className="flex items-start gap-6 group">
                 <div className="shrink-0 w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-zinc-950/10 transition-transform group-hover:scale-105 duration-300">01</div>
                 <div className="pt-1.5">
                    <h4 className="font-bold text-zinc-950 mb-2 font-poppins text-lg leading-tight">Bespoke Onboarding</h4>
                    <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">Custom-configured systems with optional face-to-face installation and seamless cloud-based delivery.</p>
                 </div>
              </div>
              <div className="flex items-start gap-6 group">
                 <div className="shrink-0 w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-zinc-950/10 transition-transform group-hover:scale-105 duration-300">02</div>
                 <div className="pt-1.5">
                    <h4 className="font-bold text-zinc-950 mb-2 font-poppins text-lg leading-tight">Software-First Architecture</h4>
                    <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">High-performance digital products engineered to solve complex data challenges and streamline operations.</p>
                 </div>
              </div>
              <div className="flex items-start gap-6 group">
                 <div className="shrink-0 w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-zinc-950/10 transition-transform group-hover:scale-105 duration-300">03</div>
                 <div className="pt-1.5">
                    <h4 className="font-bold text-zinc-950 mb-2 font-poppins text-lg leading-tight">Tailored Flexibility</h4>
                    <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">Fully adaptable frameworks designed to be customized to your exact requirements, keeping you in full control.</p>
                 </div>
              </div>
              <div className="flex items-start gap-6 group">
                 <div className="shrink-0 w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-zinc-950/10 transition-transform group-hover:scale-105 duration-300">04</div>
                 <div className="pt-1.5">
                    <h4 className="font-bold text-zinc-950 mb-2 font-poppins text-lg leading-tight">Dedicated Support</h4>
                    <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">Direct access to our technical team for continuous support, updates, and proactive system optimizations.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
