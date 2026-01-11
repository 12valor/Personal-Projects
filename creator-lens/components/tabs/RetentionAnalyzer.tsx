"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RetentionAnalyzer({ data, videos }: { data: any[], videos: any[] }) {
  if (!data || !videos) return <div className="p-10 text-center text-gray-400">Loading Retention...</div>;

  // Merge Analytics Data (Avg %) with Video Metadata (Title)
  const mergedData = data.map((row: any) => {
    const videoId = row[0];
    const avgPercent = row[1];
    const vidMeta = videos.find((v: any) => v.id === videoId);
    return {
      name: vidMeta ? vidMeta.title.substring(0, 15) + "..." : videoId,
      fullTitle: vidMeta?.title || "Unknown Video",
      retention: parseFloat(avgPercent.toFixed(1)),
      views: row[2]
    };
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Retention Analyzer</h2>
      <p className="text-gray-500">Which videos keep people watching the longest?</p>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mergedData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px' }}
                cursor={{fill: 'transparent'}}
                formatter={(val: number) => [`${val}%`, "Avg View Percentage"]}
              />
              <Bar dataKey="retention" radius={[0, 4, 4, 0]} barSize={20}>
                {mergedData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.retention > 50 ? "#10b981" : "#f59e0b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          *Green bars indicate strong retention (&gt;50%). Orange indicates room for improvement.
        </p>
      </div>
    </div>
  );
}