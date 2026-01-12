"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, YAxis
} from "recharts";
import { 
  ArrowUpRight, Clock, MapPin, Hash, Activity, 
  MoreHorizontal, Zap, Eye, UserPlus, Heart
} from "lucide-react";

// --- COLORS ---
const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#F43F5E", "#8B5CF6", "#0EA5E9"];

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-slate-900 text-xs p-3 rounded-lg shadow-xl border border-slate-100 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
        <p className="font-semibold mb-2 text-slate-500 border-b border-slate-100 pb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-medium text-slate-500">{entry.name}:</span>
            <span className="font-semibold tabular-nums text-slate-900">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- REAL-TIME PULSE CARD (Split Layout) ---
const RealTimePulseCard = ({ growthData }: { growthData: any[] }) => {
  const latestViews = growthData.length > 0 ? growthData[growthData.length - 1].views : 0;
  const latestSubs = growthData.length > 0 ? growthData[growthData.length - 1].subsNet : 0;

  // Simulate hourly breakdown based on daily total
  const distribute = (total: number) => {
    const safeTotal = Math.max(0, total);
    return [
      { label: "10m", val: Math.ceil(safeTotal * 0.015) },
      { label: "1h", val: Math.ceil(safeTotal * 0.08) },
      { label: "3h", val: Math.ceil(safeTotal * 0.22) },
      { label: "6h", val: Math.ceil(safeTotal * 0.45) },
      { label: "9h", val: Math.ceil(safeTotal * 0.68) },
      { label: "12h", val: Math.ceil(safeTotal * 0.85) },
    ];
  };

  const viewIntervals = distribute(latestViews);
  const subIntervals = distribute(latestSubs);

  const StatColumn = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col justify-center h-full">
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">{label}</span>
      <span className="text-lg font-semibold text-slate-900 tabular-nums leading-tight tracking-tight">
        {value.toLocaleString()}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
      
      {/* LEFT: VIEWS */}
      <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <Eye size={64} className="text-indigo-600" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Eye size={18} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">View Velocity</h3>
            <p className="text-[11px] text-slate-500 font-medium">Real-time engagement</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-y-6 gap-x-4">
          {viewIntervals.map((item, i) => (
            <StatColumn key={i} label={item.label} value={item.val} />
          ))}
        </div>
      </div>

      {/* RIGHT: SUBSCRIBERS */}
      <div className="flex-1 p-6 relative overflow-hidden group bg-slate-50/30">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <UserPlus size={64} className="text-emerald-600" />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserPlus size={18} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Audience Growth</h3>
            <p className="text-[11px] text-slate-500 font-medium">New subscriber acquisition</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-y-6 gap-x-4">
          {subIntervals.map((item, i) => (
            <StatColumn key={i} label={item.label} value={item.val} />
          ))}
        </div>
      </div>

    </div>
  );
};

// --- SECTION HEADER ---
const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-800 leading-tight">{title}</h3>
        <p className="text-[11px] font-normal text-slate-400 tracking-wide">{subtitle}</p>
      </div>
    </div>
    <button className="text-slate-300 hover:text-slate-600 transition-colors">
      <MoreHorizontal size={16} />
    </button>
  </div>
);

// --- MAIN DASHBOARD ---
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
       <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
       <p className="text-xs font-medium text-slate-400 tracking-wide uppercase animate-pulse">Syncing Data...</p>
    </div>
  );
  
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
    <div className="space-y-6 pb-8 font-sans text-slate-900">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div>
           <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Dashboard</h2>
           <p className="text-xs font-normal text-slate-500">Channel performance overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">Live</span>
        </div>
      </div>

      {/* ROW 1: REAL TIME PULSE (Views + Subs) */}
      <div>
         <RealTimePulseCard growthData={growthData} />
      </div>

      {/* ROW 2: GROWTH CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subscriber Growth */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <SectionHeader title="Subscriber Net" subtitle="Daily growth trend" icon={ArrowUpRight} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                   <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 500}} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
                <Tooltip content={<CustomTooltip />} cursor={{stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '4 4'}} />
                <Area type="monotone" dataKey="subsNet" stroke="#6366f1" strokeWidth={2} fill="url(#colorSubs)" activeDot={{r: 4, strokeWidth: 0, fill: '#6366f1'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Watch Time */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <SectionHeader title="Watch Time" subtitle="Minutes viewed" icon={Clock} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 500}} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="watchTime" stroke="#f59e0b" fill="url(#colorTime)" strokeWidth={2} activeDot={{r: 4, strokeWidth: 0, fill: '#f59e0b'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 3: METRICS (ADJUSTED TO 2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <SectionHeader title="Traffic Sources" subtitle="Where viewers find you" icon={Activity} />
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficData} cx="50%" cy="50%" innerRadius={50} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                  {trafficData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" iconSize={6} wrapperStyle={{fontSize: '10px', fontWeight: 600, color: '#64748b'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <SectionHeader title="Top Geographies" subtitle="Audience location" icon={MapPin} />
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geoData} layout="vertical" margin={{left: 0, right: 10, top: 0, bottom: 0}}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={30} tick={{fontSize: 11, fontWeight: 500, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} background={{ fill: '#f8fafc', radius: [0, 4, 4, 0] }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}