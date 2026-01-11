"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AudienceLoyalty({ data }: { data: any[] }) {
  if (!data) return <div className="p-10 text-center text-gray-400">Loading Loyalty Data...</div>;

  // API returns: ["SUBSCRIBED", views, avgDuration]
  // We format this for the chart
  const chartData = data.map((row: any) => ({
    name: row[0] === "SUBSCRIBED" ? "Loyal (Subscribers)" : "Casual (Non-Subs)",
    value: row[1],
    duration: (row[2] / 60).toFixed(1) // Convert seconds to minutes
  }));

  const COLORS = ['#3b82f6', '#e5e7eb'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Audience Loyalty</h2>
      <p className="text-gray-500">Breakdown of who is actually watching your content.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CHART */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Viewer Composition</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => val.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* METRICS */}
        <div className="space-y-4">
          {chartData.map((item: any, i: number) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-900">{item.name}</h4>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase">Total Views</p>
                  <p className="text-xl font-black text-gray-800">{item.value.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase">Avg Watch Time</p>
                  <p className="text-xl font-black text-blue-600">{item.duration} min</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}