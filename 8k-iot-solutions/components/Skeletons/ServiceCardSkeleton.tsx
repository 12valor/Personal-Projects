import { Skeleton } from '../Skeleton';

export default function ServiceCardSkeleton({ isHighlighted = false }: { isHighlighted?: boolean }) {
  const borderColor = isHighlighted ? 'ring-indigo-50 border-zinc-200' : 'border-zinc-200';
  
  return (
    <div className={`flex flex-col bg-white rounded-2xl border ${borderColor} shadow-sm overflow-hidden h-[450px]`}>
      {/* Header Block Skeleton */}
      <div className="px-8 pt-8 pb-8 bg-zinc-50 border-b border-zinc-100 h-[210px] flex flex-col">
        {/* Title */}
        <Skeleton className="h-7 w-48 mb-4" />
        {/* Description */}
        <div className="space-y-2 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
        {/* Pricing */}
        <div className="mt-auto flex items-baseline gap-2">
           <Skeleton className="h-4 w-8" />
           <Skeleton className="h-12 w-32" />
        </div>
      </div>

      {/* Body Block Skeleton */}
      <div className="p-8 flex flex-col flex-1 bg-white">
        {/* Features List */}
        <div className="space-y-4 flex-1 mb-8">
            <div className="flex gap-3"><Skeleton className="h-5 w-5 rounded-full shrink-0" /><Skeleton className="h-5 w-48" /></div>
            <div className="flex gap-3"><Skeleton className="h-5 w-5 rounded-full shrink-0" /><Skeleton className="h-5 w-56" /></div>
            <div className="flex gap-3"><Skeleton className="h-5 w-5 rounded-full shrink-0" /><Skeleton className="h-5 w-40" /></div>
        </div>

        {/* Button */}
        <Skeleton className="h-[52px] w-full rounded-xl" />
      </div>
    </div>
  );
}
