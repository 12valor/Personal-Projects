import ProjectGridSkeleton from '@/components/Skeletons/ProjectGridSkeleton';
import { Skeleton } from '@/components/Skeleton';

export default function LoadingHardwareProjects() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <div className="h-[90px] md:h-[110px]" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        
        {/* Header Section Skeleton */}
        <div className="mb-12 md:mb-16">
          <div className="inline-flex items-center text-sm font-semibold text-zinc-300 mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Services
          </div>
          
          <Skeleton className="h-10 md:h-12 w-3/4 max-w-md mb-4" />
          
          <div className="space-y-2 max-w-2xl">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
          </div>
        </div>

        {/* Project Grid Skeleton */}
        <ProjectGridSkeleton />
      </main>
    </div>
  );
}
