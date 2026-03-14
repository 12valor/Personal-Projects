import { Skeleton } from '@/components/Skeleton';

export default function LoadingProjectDetail() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Spacer */}
      <div className="h-[75px] md:h-[90px]" />

      <main className="pb-20">
        {/* Hero Section Skeleton */}
        <div className="w-full h-[40vh] md:h-[60vh] relative bg-zinc-900 overflow-hidden">
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10" />
          
          {/* Hero Content positioned at the bottom */}
          <div className="absolute bottom-0 w-full z-20">
            <div className="max-w-4xl mx-auto px-6 pb-8 md:pb-12">
              <div className="inline-flex items-center text-sm font-medium text-zinc-500 mb-6 drop-shadow-md">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Projects
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                 <Skeleton className="h-6 w-16 rounded-full" />
                 <Skeleton className="h-6 w-20 rounded-full" />
                 <Skeleton className="h-6 w-14 rounded-full" />
              </div>
              <Skeleton className="h-12 md:h-16 lg:h-20 w-3/4 max-w-2xl mb-4 bg-zinc-800" />
              <Skeleton className="h-12 md:h-16 lg:h-20 w-1/2 max-w-lg mb-4 bg-zinc-800" />
            </div>
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Main Content (Left Column) */}
            <div className="md:col-span-2 space-y-10">
              <section>
                <h2 className="text-2xl font-poppins font-semibold text-zinc-900 mb-4">Project Overview</h2>
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-11/12" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-poppins font-semibold text-zinc-900 mb-4">Key Features</h2>
                <ul className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-start gap-4">
                      <Skeleton className="mt-1 flex-shrink-0 w-6 h-6 rounded-full" />
                      <div className="w-full space-y-2 mt-1">
                          <Skeleton className="h-5 w-11/12" />
                          <Skeleton className="h-5 w-2/3" />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar (Right Column) */}
            <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-zinc-200 pt-8 md:pt-0 md:pl-8">
              <div className="sticky top-[140px]">
                <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4">Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <span className="block text-sm font-medium text-zinc-500 mb-1">Category</span>
                    <Skeleton className="h-6 w-24" />
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-zinc-500 mb-1">Client</span>
                    <Skeleton className="h-6 w-32" />
                  </div>

                  <div>
                    <span className="block text-sm font-medium text-zinc-500 mb-2">Technologies</span>
                    <div className="flex flex-wrap gap-2">
                       <Skeleton className="h-6 w-16" />
                       <Skeleton className="h-6 w-20" />
                       <Skeleton className="h-6 w-14" />
                       <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
