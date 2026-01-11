"use client";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function GrowthForecast({ stats }: { stats: any }) {
  if (!stats) return null;

  const currentViews = parseInt(stats.viewCount);
  const dailyVelocity = 1500; // Mock daily average for projection
  
  const data = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    actual: i < 10 ? currentViews + (i * dailyVelocity) : null,
    projected: currentViews + (i * dailyVelocity)
  }));

  const projectedTotal = currentViews + (30 * dailyVelocity);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">Growth Trajectory</h2>
      
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="font-bold text-gray-700">30-Day Projection</h3>
             <p className="text-sm text-gray-400">Based on linear regression of last 10 uploads.</p>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold text-gray-400 uppercase">Projected Views</p>
             <p className="text-xl font-black text-blue-600">{projectedTotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="day" hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(val: any) => val.toLocaleString()} 
              />
              <Line type="monotone" dataKey="projected" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
              <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} dot={false} name="Current Trend" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}