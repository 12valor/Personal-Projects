"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
// 1. IMPORT THE SCHEDULER HERE
import PostingScheduler from "./PostingScheduler";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/youtube/analytics")
      .then((res) => res.json())
      .then((d) => {
        if (!d.error) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-400">Loading Dashboard...</div>;
  if (!data) return null;

  const growthData = data.growth?.map((row: any) => ({
    date: new Date(row[0]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    views: Number(row[1]) || 0,
    subsNet: (Number(row[2]) || 0) - (Number(row[3]) || 0), 
    watchTime: Number(row[4]) || 0 
  })) || [];

  const trafficData = data.traffic?.map((row: any) => ({
    name: row[0]?.replace('YT_', '').replace('_', ' ') || 'Unknown',
    value: Number(row[1]) || 0
  })) || [];

  const geoData = data.geo?.map((row: any) => ({
    name: row[0] || 'Unknown',
    value: Number(row[1]) || 0
  })) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* ROW 1: GROWTH TRACKERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">👥 Subscriber Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                <XAxis dataKey="date" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{borderRadius: '8px'}} />
                <Line type="monotone" dataKey="subsNet" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">⏱️ Watch Time (Minutes)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0"/>
                <XAxis dataKey="date" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{borderRadius: '8px'}} />
                <Area type="monotone" dataKey="watchTime" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 2: AUDIENCE & TAGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Traffic Sources</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                  {trafficData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" fontSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Top Locations</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical">
                <CartesianGrid horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={30} tick={{fontSize: 11, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">🔥 Best Performing Tags</h3>
          <div className="overflow-y-auto h-48">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 text-xs border-b">
                <tr>
                  <th className="pb-2 font-medium">Tag</th>
                  <th className="pb-2 font-medium text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.topTags?.map((tag: any, i: number) => (
                  <tr key={i}>
                    <td className="py-3 font-medium text-gray-700 truncate max-w-[120px]">#{tag.tag}</td>
                    <td className="py-3 text-right text-gray-500">{Number(tag.views).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. NEW: POSTING SCHEDULER (Inserted Here) */}
      <div className="mt-2">
        <PostingScheduler data={data.heatmap} />
      </div>

    </div>
  );
}