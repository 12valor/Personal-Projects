import { Skeleton } from '../Skeleton';

export default function ProjectCardSkeleton() {
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden ring-1 ring-zinc-200 shadow-sm block">
      {/* Image Container Skeleton */}
      <Skeleton className="w-full aspect-[4/3] rounded-none" />

      {/* Content Container Skeleton */}
      <div className="p-5 flex flex-col flex-1 pb-6">
        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-12" />
        </div>
        
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2 mt-1" />
        
        {/* Description Skeleton */}
        <div className="mt-auto space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}
