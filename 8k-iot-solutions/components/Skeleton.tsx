import React from 'react';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[#f2f2f2] rounded-md ${className || ''}`}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-zinc-200/60 to-transparent animate-shimmer" />
    </div>
  );
}
