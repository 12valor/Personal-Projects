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
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
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
            
            <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="max-w-3xl">
                <h1 className="text-5xl md:text-8xl font-black tracking-tight text-zinc-950 mb-6 leading-[0.9]">
                  Pre-made <br />
                  <span className="text-zinc-400">Solutions.</span>
                </h1>
                <p className="text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-2xl">
                  Scalable software products ready to integrate with your existing infrastructure, powered by 8K's industrial IoT engine.
                </p>
              </div>

              {/* Stats/Badges */}
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-3 bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-900">
                       <Zap size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-zinc-400 uppercase tracking-tighter">Performance</span>
                      <span className="text-sm font-bold text-zinc-950">High Availability</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                       <ShieldCheck size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-zinc-400 uppercase tracking-tighter">Security</span>
                      <span className="text-sm font-bold text-zinc-950">Enterprise Grade</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </PageHeaderParallax>

        {/* Product Showcase */}
        <div className="mt-12 md:mt-24">
          <div className="flex items-center gap-4 mb-12">
             <div className="h-[1px] flex-1 bg-zinc-200" />
             <div className="flex items-center gap-2 text-zinc-400">
               <Sparkles size={16} />
               <span className="text-xs font-bold uppercase tracking-[0.2em]">Available Software</span>
             </div>
             <div className="h-[1px] flex-1 bg-zinc-200" />
          </div>
          
          <Products initialProducts={products} />
        </div>

        {/* Why choose section */}
        <div className="mt-32 mb-20 md:grid md:grid-cols-3 gap-12 border-t border-zinc-200 pt-20">
           <div>
              <h2 className="text-3xl font-bold text-zinc-950 font-poppins mb-6">Why our pre-made software?</h2>
              <p className="text-zinc-500 leading-relaxed font-medium">
                Custom development takes time. Our solutions provide a solid foundation that can be deployed in days, not months, while remaining fully customizable to your unique requirements.
              </p>
           </div>
           
           <div className="mt-12 md:mt-0 space-y-10 md:col-span-2 grid md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="flex gap-5">
                 <div className="shrink-0 w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-white">01</div>
                 <div>
                    <h4 className="font-bold text-zinc-950 mb-2 font-poppins text-lg">Instant Deployment</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">Docker-ready and cloud-native architectures for immediate rollout on your preferred infrastructure.</p>
                 </div>
              </div>
              <div className="flex gap-5">
                 <div className="shrink-0 w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center text-white">02</div>
                 <div>
                    <h4 className="font-bold text-zinc-950 mb-2 font-poppins text-lg">Scalable API</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">Full REST and WebSocket support for seamless integration with your existing hardware and mobile apps.</p>
                 </div>
              </div>
              <div className="flex gap-5">
                 <div className="shrink-0 w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-200">03</div>
                 <div>
                    <h4 className="font-bold text-zinc-950 mb-2 font-poppins text-lg">Custom Branding</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">Whitelabel solutions that reflect your brand identity with customizable themes and domain configuration.</p>
                 </div>
              </div>
              <div className="flex gap-5">
                 <div className="shrink-0 w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-900 border border-zinc-200">04</div>
                 <div>
                    <h4 className="font-bold text-zinc-950 mb-2 font-poppins text-lg">24/7 Monitoring</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">Built-in health checks and anomaly detection to ensure your IoT fleet stays online and secure.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
