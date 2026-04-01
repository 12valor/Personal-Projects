import { getProjectsByCategory } from '@/lib/projects';
import ProjectGrid from '@/components/ProjectGrid';
import PageHeaderParallax from '@/components/PageHeaderParallax';
import BackToServicesLink from '@/components/BackToServicesLink';
import ProjectBreadcrumbs from '@/components/ProjectBreadcrumbs';

export const metadata = {
  title: "Hardware Projects",
};

export default async function HardwareProjectsPage() {
  const projects = await getProjectsByCategory('hardware');

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] font-poppins">
      {/* Enhanced Blueprint Grid Background Visibility */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-100 animate-blueprintShift" 
        style={{
          backgroundImage: 'linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/40 via-[#FAFAFA]/60 to-[#FAFAFA] opacity-40 z-0" />

      {/* Spacer to account for fixed navbar - Tightened */}
      <div className="relative z-10 h-[20px] md:h-[30px]" />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header Section */}
        <PageHeaderParallax>
          <div className="mb-6 md:mb-8">
            <BackToServicesLink />
            <ProjectBreadcrumbs currentPage="Hardware Projects" />
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-0 leading-[1.1]">
              Hardware Projects
            </h1>
          </div>
        </PageHeaderParallax>

        {/* Project Grid */}
        <div className="mt-8 md:mt-12">
           <ProjectGrid projects={projects} />
        </div>
      </main>
    </div>
  );
}
