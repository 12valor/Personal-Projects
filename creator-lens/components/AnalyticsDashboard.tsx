"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import { ArrowUpRight, Clock, MapPin, Hash, Activity, MoreHorizontal } from "lucide-react";

// --- PROFESSIONAL COLOR PALETTE (Roblox/SaaS inspired) ---
// Indigo (Primary), Emerald (Growth), Amber (Warning/Attention), Rose (Alert), Violet (Secondary)
const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#F43F5E", "#8B5CF6", "#0EA5E9"];

// --- CUSTOM TOOLTIP COMPONENT ---
// Dark, blurred backdrop for high contrast and modern feel
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs p-3 rounded-lg shadow-xl border border-white/10 animate-in fade-in zoom-in-95 duration-200">
        <p className="font-semibold mb-2 text-slate-300 border-b border-white/10 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-medium text-slate-200">{entry.name}:</span>
            <span className="font-bold tabular-nums">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- SECTION HEADER COMPONENT ---
const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600">
        <Icon size={18} strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800 leading-tight">{title}</h3>
        <p className="text-[11px] font-medium text-slate-400 tracking-wide">{subtitle}</p>
      </div>
    </div>
    <button className="text-slate-300 hover:text-slate-600 transition-colors">
      <MoreHorizontal size={16} />
    </button>
  </div>
);

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

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center space-y-4 font-sans">
       <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
       <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase animate-pulse">Loading Metrics...</p>
    </div>
  );
  
  if (!data) return null;

  // Data Processing
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
    <div className="space-y-6 pb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-1">
        <div>
           <h2 className="text-lg font-bold text-slate-900 tracking-tight">Performance Overview</h2>
           <p className="text-xs font-medium text-slate-500">Key metrics for the last 28 days</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
           </span>
           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Live Sync</span>
        </div>
      </div>

      {/* ROW 1: GROWTH CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subscriber Growth (Line with Gradient) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <SectionHeader title="Subscriber Velocity" subtitle="Net change vs Previous Period" icon={ArrowUpRight} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                   <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="date" 
                  tick={{fontSize: 10, fill: '#94A3B8', fontWeight: 500}} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                  minTickGap={30}
                />
                <Tooltip content={<CustomTooltip />} cursor={{stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '4 4'}} />
                <Area 
                  type="monotone" 
                  dataKey="subsNet" 
                  stroke="#4F46E5" 
                  strokeWidth={3} 
                  fill="url(#colorSubs)" 
                  activeDot={{r: 6, strokeWidth: 0, fill: '#4F46E5'}} 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watch Time (Smooth Area) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <SectionHeader title="Watch Time" subtitle="Minutes consumed by audience" icon={Clock} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="date" 
                  tick={{fontSize: 10, fill: '#94A3B8', fontWeight: 500}} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                  minTickGap={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="watchTime" 
                  stroke="#F59E0B" 
                  fill="url(#colorTime)" 
                  strokeWidth={3} 
                  activeDot={{r: 6, strokeWidth: 0, fill: '#F59E0B'}}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 2: BREAKDOWNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Traffic Sources (Donut Chart) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <SectionHeader title="Traffic Sources" subtitle="Where viewers find you" icon={Activity} />
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                   data={trafficData} 
                   cx="50%" cy="50%" 
                   innerRadius={55} outerRadius={75} 
                   paddingAngle={4} 
                   dataKey="value"
                   stroke="none"
                   animationDuration={1000}
                >
                  {trafficData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle" 
                  iconSize={8}
                  formatter={(value) => <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Stat */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
               <span className="text-2xl font-bold text-slate-800 tracking-tight">
                 {trafficData.reduce((acc:number, curr:any) => acc + curr.value, 0) > 0 ? "100%" : "0%"}
               </span>
            </div>
          </div>
        </div>

        {/* Top Locations (Rounded Horizontal Bar) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <SectionHeader title="Top Geographies" subtitle="Audience location by views" icon={MapPin} />
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical" margin={{left: 0, right: 10, top: 0, bottom: 0}}>
                <CartesianGrid horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={30} 
                  tick={{fontSize: 11, fontWeight: 600, fill: '#64748B'}} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#F8FAFC'}} />
                <Bar 
                  dataKey="value" 
                  fill="#8B5CF6" 
                  radius={[0, 6, 6, 0]} 
                  barSize={16} 
                  animationDuration={1500}
                  background={{ fill: '#F8FAFC', radius: [0, 6, 6, 0] }} // Light background track for modern feel
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tags Leaderboard (Modern List) */}
        <div className="bg-white p-0 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 pb-2">
            <SectionHeader title="Top Tags" subtitle="Keywords driving traffic" icon={Hash} />
          </div>
          
          <div className="overflow-y-auto max-h-[240px] px-2 pb-2 scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="py-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider rounded-l-md">Keyword</th>
                  <th className="py-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right rounded-r-md">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.topTags?.map((tag: any, i: number) => (
                  <tr key={i} className="group hover:bg-indigo-50/50 transition-colors cursor-default">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-300 w-4">#{i + 1}</span>
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate max-w-[100px]">
                          {tag.tag}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                       <span className="inline-block px-2 py-0.5 bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-700 rounded text-[10px] font-bold tabular-nums transition-colors">
                         {Number(tag.views).toLocaleString()}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}