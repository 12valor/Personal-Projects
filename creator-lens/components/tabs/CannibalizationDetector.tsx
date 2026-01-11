"use client";
import { useMemo } from "react";

export default function CannibalizationDetector({ videos }: { videos: any[] }) {
  
  const conflicts = useMemo(() => {
    if (!videos) return [];
    
    // Simple heuristic: Word overlap in titles > 50%
    const pairs: any[] = [];
    
    videos.forEach((v1, i) => {
      videos.slice(i + 1).forEach(v2 => {
        const words1 = v1.title.toLowerCase().split(" ").filter((w:string) => w.length > 3);
        const words2 = v2.title.toLowerCase().split(" ").filter((w:string) => w.length > 3);
        const intersection = words1.filter((w:string) => words2.includes(w));
        
        const overlap = intersection.length / Math.min(words1.length, words2.length);
        
        if (overlap > 0.5) {
          pairs.push({
            v1, v2,
            overlap: Math.round(overlap * 100),
            winner: parseInt(v1.views) > parseInt(v2.views) ? v1 : v2
          });
        }
      });
    });

    return pairs.slice(0, 5); // Top 5 conflicts
  }, [videos]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Content Cannibalization</h2>
      <p className="text-gray-500">Videos that are competing against each other for the same search traffic.</p>

      {conflicts.length === 0 ? (
        <div className="p-8 bg-green-50 text-green-700 rounded-2xl border border-green-100 text-center">
          ✅ No significant cannibalization detected. Your topics are well-spaced.
        </div>
      ) : (
        <div className="space-y-4">
          {conflicts.map((pair, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
              
              {/* Conflict Badge */}
              <div className="flex flex-col items-center justify-center w-24 shrink-0">
                 <span className="text-2xl">⚔️</span>
                 <span className="text-xs font-bold text-red-600 mt-1">{pair.overlap}% Overlap</span>
              </div>

              {/* The Comparison */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                
                {/* Video 1 */}
                <div className={`p-3 rounded-xl border ${pair.winner === pair.v1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">{pair.winner === pair.v1 ? 'Winning Traffic' : 'Losing Traffic'}</p>
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{pair.v1.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{parseInt(pair.v1.views).toLocaleString()} views</p>
                </div>

                {/* Video 2 */}
                <div className={`p-3 rounded-xl border ${pair.winner === pair.v2 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                   <p className="text-xs font-bold text-gray-500 uppercase mb-1">{pair.winner === pair.v2 ? 'Winning Traffic' : 'Losing Traffic'}</p>
                   <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{pair.v2.title}</h4>
                   <p className="text-xs text-gray-500 mt-1">{parseInt(pair.v2.views).toLocaleString()} views</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}