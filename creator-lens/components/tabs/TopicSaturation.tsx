"use client";

export default function TopicSaturation({ traffic }: { traffic: any[] }) {
  if (!traffic) return <div className="p-10 text-center text-gray-400">Loading Traffic Data...</div>;

  // Map API codes to readable names
  const mapping: Record<string, string> = {
    "YT_SEARCH": "Search (High Demand)",
    "SUBSCRIBER": "Subscribers",
    "RELATED_VIDEO": "Suggested (Competitive)",
    "BROWSE": "Home Page (Viral)",
    "EXT_URL": "External"
  };

  const formattedTraffic = traffic.map((row: any) => ({
    source: mapping[row[0]] || row[0],
    views: row[1],
    // Calculate saturation based on source type logic
    status: row[0] === "YT_SEARCH" ? "Underserved" : row[0] === "RELATED_VIDEO" ? "Oversaturated" : "Balanced",
    color: row[0] === "YT_SEARCH" ? "bg-green-100 text-green-700" : row[0] === "RELATED_VIDEO" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Topic Demand & Saturation</h2>
      <p className="text-gray-500">Analyze how viewers are discovering your content to judge competition.</p>

      <div className="grid grid-cols-1 gap-4">
        {formattedTraffic.map((item: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{item.source}</h3>
              <p className="text-sm text-gray-500">{item.views.toLocaleString()} views generated</p>
            </div>

            <div className="text-right">
              <span className={`px-4 py-2 rounded-lg text-sm font-bold ${item.color}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}