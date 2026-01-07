"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Download, Search } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';

// --- TYPES ---
type Tab = 'analytics' | 'content' | 'users' | 'reports' | 'updates';

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-white/10 p-4 rounded shadow-2xl backdrop-blur-md z-50">
        {label && <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">{label}</p>}
        <p className="text-base font-bold text-white">
          {payload[0].value} <span className="text-ytRed text-[10px] uppercase tracking-wider">Count</span>
        </p>
      </div>
    );
  }
  return null;
};

// --- KPI CARD COMPONENT ---
const KPICard = ({ title, value, subtext }: { title: string, value: string | number, subtext: string }) => (
  <div className="bg-panel border border-border p-8 shadow-sm hover:border-ytRed/50 transition-colors rounded-sm">
    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">{title}</h3>
    <div className="text-5xl font-black text-foreground mb-2 tracking-tight">{value}</div>
    <p className="text-sm text-ytRed font-bold">{subtext}</p>
  </div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('analytics');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data State
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [systemMsg, setSystemMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return router.push('/');
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (profile?.role !== 'admin') return router.push('/');

        // Parallel Fetching
        const [subRes, usrRes, repRes, comRes] = await Promise.all([
          supabase.from('submissions').select('*').order('created_at', { ascending: false }),
          supabase.from('profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('reports').select('*').order('created_at', { ascending: false }),
          supabase.from('comments').select('created_at, tags')
        ]);

        setSubmissions(subRes.data || []);
        setUsers(usrRes.data || []);
        setReports(repRes.data || []);
        setComments(comRes.data || []);
      } catch (e) {
        console.error("Data Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [supabase, router]);

  // --- EXPORT CSV ---
  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return alert("No data to export.");
    const headers = Object.keys(data[0]);
    const csvContent = [headers.join(','), ...data.map(row => headers.map(f => `"${String(row[f] || '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // --- FILTERS ---
  const filteredSubmissions = useMemo(() => submissions.filter(s => s.channel_name?.toLowerCase().includes(searchQuery.toLowerCase())), [submissions, searchQuery]);
  const filteredUsers = useMemo(() => users.filter(u => u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())), [users, searchQuery]);

  // --- ANALYTICS CALCULATION ---
  const stats = useMemo(() => {
    if (loading) return null;
    
    // 1. Tags Logic (Comprehensive List)
    const tagCounts: Record<string, number> = {};
    comments.forEach(c => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t: string) => {
          if (t) tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      }
    });
    // Convert to array and sort by count descending
    const allTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([label, value]) => ({ label, value }));
      
    const finalTags = allTags.length > 0 ? allTags : [{ label: "No Data", value: 0 }];

    // 2. Timeline Logic
    const timelineMap: Record<string, number> = {};
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      timelineMap[d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })] = 0;
    }
    submissions.forEach(s => {
      const d = new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (timelineMap[d] !== undefined) timelineMap[d]++;
    });
    const timelineData = Object.entries(timelineMap).map(([label, value]) => ({ label, value }));

    // 3. Content Type Distribution
    const videoCount = submissions.filter(s => s.submission_type === 'video').length;
    const channelCount = submissions.length - videoCount;
    const contentTypeData = [
      { name: 'Video Only', value: videoCount },
      { name: 'Full Channel', value: channelCount },
    ];

    return { 
      allTags: finalTags,
      openCount: submissions.filter(s => !s.is_locked).length,
      timelineData,
      contentTypeData
    };
  }, [submissions, comments, loading]);

  // --- ACTIONS ---
  const toggleLock = async (id: string, current: boolean) => {
    setSubmissions(p => p.map(s => s.id === id ? { ...s, is_locked: !current } : s));
    await supabase.from('submissions').update({ is_locked: !current }).eq('id', id);
  };
  const toggleHide = async (id: string, current: boolean) => {
    setSubmissions(p => p.map(s => s.id === id ? { ...s, is_hidden: !current } : s));
    await supabase.from('submissions').update({ is_hidden: !current }).eq('id', id);
  };
  const toggleBan = async (id: string, current: boolean) => {
    if(!confirm("Modify user ban status?")) return;
    setUsers(p => p.map(u => u.id === id ? { ...u, is_banned: !current } : u));
    await supabase.from('profiles').update({ is_banned: !current }).eq('id', id);
  };
  const resolveReport = async (id: string) => {
    setReports(p => p.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', id);
  };
  const sendSystemUpdate = async () => {
    if (!systemMsg.trim()) return;
    setIsSending(true);
    await supabase.rpc('broadcast_system_update', { update_message: systemMsg });
    setSystemMsg(""); setIsSending(false); alert("Broadcast sent.");
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-background text-foreground"><div className="w-8 h-8 border-2 border-ytRed border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <div className="h-20 border-b border-border flex items-center justify-between px-8 bg-panel sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-ytRed rounded-full animate-pulse shadow-[0_0_15px_#ff0000]"></div>
          <h1 className="font-black uppercase tracking-widest text-2xl">Admin<span className="text-gray-500">Panel</span></h1>
        </div>
        <button onClick={() => router.push('/')} className="px-6 py-2 border border-border text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors rounded-sm">Exit Dashboard</button>
      </div>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-80px)]">
        <div className="w-64 border-r border-border bg-panel flex flex-col overflow-y-auto">
          <div className="p-6 flex flex-col gap-2">
            <p className="text-[10px] font-bold uppercase text-gray-500 mb-4 pl-2 tracking-widest">Navigation</p>
            {[{ id: 'analytics', label: 'Platform Health', count: 0 }, { id: 'content', label: 'Manage Content', count: 0 }, { id: 'users', label: 'User Database', count: 0 }, { id: 'reports', label: 'Reports', count: reports.filter(r => r.status === 'pending').length }, { id: 'updates', label: 'System Blast', count: 0 }].map((tab) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id as Tab); setSearchQuery(""); }} className={`text-left px-4 py-4 text-xs font-bold uppercase tracking-wider border rounded-sm transition-all flex justify-between items-center group ${activeTab === tab.id ? 'bg-foreground text-background border-foreground shadow-lg' : 'border-transparent text-gray-500 hover:bg-background hover:text-foreground'}`}>
                {tab.label}
                {tab.count > 0 && <span className={`px-2 py-0.5 rounded text-[10px] font-black ${activeTab === tab.id ? 'bg-background text-foreground' : 'bg-ytRed text-white'}`}>{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-10 bg-background overflow-y-auto">
          {activeTab === 'analytics' && stats && (
            <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-end border-b border-border pb-6">
                 <div>
                   <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Analytics Overview</h2>
                   <p className="text-base text-gray-500 font-medium">Real-time platform metrics and performance data.</p>
                 </div>
               </div>
               
               {/* KPI GRID */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard title="Total Channels" value={submissions.length} subtext="Submitted All Time" />
                <KPICard title="Total Critiques" value={comments.length} subtext="Feedback Given" />
                <KPICard title="Active Threads" value={stats.openCount} subtext="Open for Review" />
                <KPICard title="Pending Action" value={reports.filter(r => r.status === 'pending').length} subtext="Reports" />
              </div>
              
              {/* CHARTS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                
                {/* 1. AREA CHART (Takes 2 cols) */}
                <div className="col-span-1 xl:col-span-2 bg-panel border border-border p-8 rounded-sm shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Submission Velocity</h3>
                    <span className="text-[10px] bg-ytRed/10 text-ytRed px-3 py-1 rounded font-black">LAST 7 DAYS</span>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.timelineData}>
                        <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="label" stroke="#666" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#dc2626', strokeWidth: 1 }} />
                        <Area type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. COMPREHENSIVE TAG LIST (Scrollable Bar Chart) */}
                <div className="col-span-1 xl:col-span-1 bg-panel border border-border p-8 rounded-sm shadow-sm flex flex-col h-[400px]">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex-shrink-0">All Tags ({stats.allTags.length})</h3>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Dynamic Height Container: Grows based on item count */}
                    <div style={{ height: Math.max(stats.allTags.length * 50, 300) }} className="w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          layout="vertical" 
                          data={stats.allTags} 
                          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={true} vertical={false} />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="label" 
                            type="category" 
                            width={100} 
                            stroke="#888" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false} 
                            interval={0}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{fill: '#ffffff05'}} />
                          <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                            {stats.allTags.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ffffff' : '#555555'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* 3. PIE CHART (Takes 1 col) */}
                <div className="col-span-1 xl:col-span-1 bg-panel border border-border p-8 rounded-sm shadow-sm h-[400px]">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">Content Split</h3>
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={stats.contentTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#dc2626" stroke="none" /> 
                          <Cell fill="#ffffff" stroke="none" />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36} 
                          iconType="circle"
                          formatter={(value) => <span className="text-[10px] font-bold uppercase text-gray-500 ml-2">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="max-w-[1600px] mx-auto animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black uppercase">Content Database</h2>
                <div className="flex gap-3">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input type="text" placeholder="Search Content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-3 bg-panel border border-border text-sm font-bold focus:outline-none focus:border-ytRed w-80 rounded-sm" />
                   </div>
                   <button onClick={() => exportToCSV(submissions, 'submissions')} className="px-6 py-3 bg-foreground text-background text-xs font-black uppercase hover:bg-gray-300 transition-colors flex items-center gap-2 rounded-sm"><Download size={14} /> CSV</button>
                </div>
              </div>
              <div className="border border-border bg-panel overflow-hidden shadow-sm rounded-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background border-b border-border text-xs font-black uppercase text-gray-500 tracking-wider"><tr><th className="p-5">Channel Name</th><th className="p-5">Type</th><th className="p-5 text-center">Indicators</th><th className="p-5 text-right">Moderation</th></tr></thead>
                  <tbody>{filteredSubmissions.length > 0 ? filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className={`border-b border-border transition-colors ${sub.is_hidden ? 'bg-gray-900/30 opacity-60' : 'hover:bg-background/50'} ${sub.is_locked ? 'border-l-4 border-l-red-600' : ''}`}>
                        <td className="p-5"><span className="font-bold text-foreground block text-base">{sub.channel_name}</span><a href={`/channel/${sub.id}`} target="_blank" className="text-xs text-gray-500 hover:text-ytRed font-medium mt-1 inline-block">View Thread →</a></td>
                        <td className="p-5 text-xs font-bold text-gray-500 uppercase">{sub.submission_type}</td>
                        <td className="p-5 text-center"><div className="flex items-center justify-center gap-2">{sub.is_locked && <span title="Locked">🔒</span>}{sub.is_hidden && <span title="Hidden">👁️‍🗨️</span>}{!sub.is_locked && !sub.is_hidden && <span className="text-gray-600">—</span>}</div></td>
                        <td className="p-5 flex justify-end gap-2"><button onClick={() => toggleLock(sub.id, sub.is_locked)} className="min-w-[90px] px-4 py-2 text-[10px] font-black uppercase border bg-background border-border text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors rounded-sm">{sub.is_locked ? 'Unlock' : 'Lock'}</button><button onClick={() => toggleHide(sub.id, sub.is_hidden)} className="min-w-[90px] px-4 py-2 text-[10px] font-black uppercase border bg-background border-border text-gray-400 hover:border-foreground hover:text-foreground transition-colors rounded-sm">{sub.is_hidden ? 'Unhide' : 'Hide'}</button></td>
                      </tr>
                    )) : <tr><td colSpan={4} className="p-10 text-center text-gray-500 text-sm font-bold uppercase">No Results Found</td></tr>}</tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="max-w-[1600px] mx-auto animate-in fade-in duration-300">
               <div className="flex justify-between items-center mb-8"><h2 className="text-3xl font-black uppercase">User Database</h2><div className="flex gap-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} /><input type="text" placeholder="Search Users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-3 bg-panel border border-border text-sm font-bold focus:outline-none focus:border-ytRed w-80 rounded-sm" /></div><button onClick={() => exportToCSV(users, 'users')} className="px-6 py-3 bg-foreground text-background text-xs font-black uppercase hover:bg-gray-300 transition-colors flex items-center gap-2 rounded-sm"><Download size={14} /> CSV</button></div></div>
               <div className="grid grid-cols-1 gap-4">{filteredUsers.length > 0 ? filteredUsers.map((user) => (<div key={user.id} className="flex justify-between items-center p-6 border border-border bg-panel shadow-sm hover:border-gray-500 transition-colors rounded-sm"><div className="flex items-center gap-5"><div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden border border-border"><img src={user.avatar_url || "https://ui-avatars.com/api/?background=random"} className="w-full h-full object-cover" /></div><div><p className="font-bold text-base flex gap-2 items-center">{user.full_name || "Anonymous"} {user.role === 'admin' && <span className="bg-ytRed text-white text-[10px] px-2 py-0.5 rounded font-black">ADMIN</span>}</p><p className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</p></div></div>{user.role !== 'admin' && <button onClick={() => toggleBan(user.id, user.is_banned)} className={`text-[10px] font-black uppercase px-5 py-2.5 border transition-colors rounded-sm ${user.is_banned ? 'border-green-500 text-green-500 hover:bg-green-500/10' : 'border-red-500 text-red-500 hover:bg-red-500/10'}`}>{user.is_banned ? 'Unban User' : 'Ban User'}</button>}</div>)) : <div className="p-10 text-center text-gray-500 text-sm font-bold uppercase border border-dashed border-border">No Users Found</div>}</div>
            </div>
          )}

          {activeTab === 'reports' && (
             <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
               <h2 className="text-3xl font-black uppercase mb-8">Flagged Content</h2>
               {reports.map((report) => (<div key={report.id} className={`bg-panel border-l-4 p-8 mb-4 shadow-sm rounded-sm ${report.status === 'pending' ? 'border-red-500' : 'border-green-500 opacity-60'}`}><div className="flex justify-between mb-4"><span className="text-xs font-black uppercase tracking-widest">{report.status}</span><span className="text-xs font-mono text-gray-500">{new Date(report.created_at).toLocaleDateString()}</span></div><p className="text-lg font-bold mb-2">"{report.reason}"</p>{report.status === 'pending' && <button onClick={() => resolveReport(report.id)} className="mt-4 px-8 py-3 bg-foreground text-background text-xs font-black uppercase hover:bg-gray-300 transition-colors rounded-sm">Mark Resolved</button>}</div>))}
             </div>
          )}

          {activeTab === 'updates' && (
            <div className="max-w-[1000px] mx-auto animate-in fade-in duration-300">
              <h2 className="text-3xl font-black uppercase mb-2">System Blast</h2>
              <p className="text-base text-gray-500 mb-8 font-medium">Send a global notification to all registered users.</p>
              <div className="bg-panel border border-border p-10 shadow-sm rounded-sm">
                 <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 block">Update Message</label>
                 <textarea value={systemMsg} onChange={(e) => setSystemMsg(e.target.value)} placeholder="e.g. Maintenance scheduled..." className="w-full h-48 bg-background border border-border p-5 text-base font-medium focus:outline-none focus:border-ytRed resize-none mb-8 rounded-sm" />
                 <div className="flex justify-between items-center"><p className="text-xs text-gray-400 font-bold uppercase">Target Audience: <span className="text-foreground">{users.length} Users</span></p><button onClick={sendSystemUpdate} disabled={isSending || !systemMsg.trim()} className={`px-10 py-4 bg-ytRed text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors rounded-sm ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}>{isSending ? 'Sending...' : 'Broadcast Message'}</button></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}