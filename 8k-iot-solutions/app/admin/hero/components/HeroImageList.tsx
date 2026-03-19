'use client';

import { deleteHeroImage, setActiveHeroImage } from '../actions';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroImageList({ images }: { images: any[] }) {
  if (images.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-lg border border-dashed border-zinc-300">
        <p className="text-zinc-500">No hero images found. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div 
          key={image.id} 
          className={`relative bg-white rounded-lg border overflow-hidden shadow-sm transition-all ${
            image.isActive ? 'ring-2 ring-zinc-900 border-transparent' : 'border-zinc-200'
          }`}
        >
          {image.isActive && (
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                Active
              </span>
            </div>
          )}
          
          <div className="relative aspect-video bg-zinc-100">
            <Image 
              src={image.url} 
              alt={image.alt || 'Hero Image'} 
              fill 
              className="object-cover"
            />
          </div>
          
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-zinc-900 truncate">
                {image.label || 'Untitled Image'}
              </h4>
              <p className="text-xs text-zinc-500 truncate mt-1">
                {image.alt || 'No alt text provided'}
              </p>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveHeroImage(image.id)}
                disabled={image.isActive}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-colors ${
                  image.isActive 
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                Set Active
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this image?')) {
                    deleteHeroImage(image.id);
                  }
                }}
                className="p-1.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete Image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
