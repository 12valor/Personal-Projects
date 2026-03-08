import { Skeleton } from '@/components/Skeleton';

export default function LoadingRoot() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col items-center justify-center">
      {/* 
        A very subtle, minimal layout skeleton specifically designed for root/global page transitions.
        This provides a smooth "fade in" feel without flashing heavy structural mockups if we aren't 
        sure exactly which page the user is navigating to.
      */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center opacity-50">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-4 w-full flex flex-col items-center">
              <Skeleton className="h-6 w-full max-w-2xl" />
              <Skeleton className="h-6 w-4/5 max-w-xl" />
              <Skeleton className="h-6 w-3/4 max-w-lg" />
          </div>
      </div>
    </div>
  );
}
