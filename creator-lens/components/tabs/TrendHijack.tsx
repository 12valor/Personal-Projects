"use client";
import { useMemo } from "react";

export default function TrendHijack({ searchTerms }: { searchTerms: any[] }) {
  
  const trends = useMemo(() => {
    if (!searchTerms || searchTerms.length === 0) return [];

    // 1. Calculate Average Search Volume to determine baseline
    const totalViews = searchTerms.reduce((acc, row) => acc + row[1], 0);
    const avgViews = totalViews / searchTerms.length;

    // 2. Process Terms
    return searchTerms.map((row) => {
      const views = row[1];
      // Logic: If views are 1.5x higher than average, it's a "Dominant" trend.
      // Otherwise, it's an "Emerging" trend.
      const phase = views > (avgViews * 1.5) ? "Dominant" : "Rising";
      
      return {
        term: row[0],
        views: views,
        phase: phase
      };
    }).slice(0, 8); // Top 8 terms
  }, [searchTerms]);

  if (!searchTerms) return <div className="p-8 text-center text-gray-400">Loading Search Data...</div>;
  if (searchTerms.length === 0) return <div className="p-8 text-center text-gray-400">No significant search traffic detected yet.</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Trend Hijack Radar</h2>
        <p className="text-gray-500">Real keywords driving traffic to you right now.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trends.map((t, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                 t.phase === "Rising" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
               }`}>
                 {t.phase === "Rising" ? "🚀" : "🔥"}
               </div>
               <div>
                 <h3 className="font-bold text-gray-900 line-clamp-1" title={t.term}>{t.term}</h3>
                 <p className="text-xs text-gray-500">{t.views.toLocaleString()} search views</p>
               </div>
            </div>
            
            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
               t.phase === "Rising" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
            }`}>
              {t.phase}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}