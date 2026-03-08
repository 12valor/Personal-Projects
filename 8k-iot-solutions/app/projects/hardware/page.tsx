import { getProjectsByCategory } from '@/lib/projects';
import ProjectGrid from '@/components/ProjectGrid';
import Link from 'next/link';

export default async function HardwareProjectsPage() {
  const projects = await getProjectsByCategory('hardware');

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      {/* Spacer to account for fixed navbar */}
      <div className="h-[90px] md:h-[110px]" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <Link href="/#services" className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-zinc-800 transition-colors mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Services
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-poppins font-bold tracking-tight text-zinc-900 mb-4">
            Hardware Engineering
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl">
            Explore our portfolio of custom embedded systems, IoT sensor networks, and physical prototypes engineered for durability and precision.
          </p>
        </div>

        {/* Project Grid */}
        <ProjectGrid projects={projects} />
      </main>
    </div>
  );
}
