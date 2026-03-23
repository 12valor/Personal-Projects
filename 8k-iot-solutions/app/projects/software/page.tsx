import { getProjectsByCategory } from '@/lib/projects';
import ProjectGrid from '@/components/ProjectGrid';
import BackToServicesButton from '@/components/BackToServicesButton';

export const metadata = {
  title: "Software Solutions",
};

export default async function SoftwareProjectsPage() {
  const projects = await getProjectsByCategory('software');

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] font-sans">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-[#FAFAFA]/90 to-[#FAFAFA] opacity-80" />
      </div>

      {/* Spacer to account for fixed navbar */}
      <div className="relative z-10 h-[90px] md:h-[110px]" />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <BackToServicesButton className="inline-flex items-center text-sm font-semibold text-indigo-500 hover:text-indigo-700 transition-colors mb-6 cursor-pointer" />
          
          <h1 className="text-4xl md:text-5xl font-poppins font-bold tracking-tight text-zinc-900 mb-4">
            Software Solutions
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl">
            Discover our scalable web platforms, custom dashboards, and data-driven applications built to solve complex operational challenges.
          </p>
        </div>

        {/* Project Grid */}
        <ProjectGrid projects={projects} />
      </main>
    </div>
  );
}
