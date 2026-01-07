"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

// --- TYPES ---
type Tab = 'analytics' | 'content' | 'users' | 'reports' | 'updates' | 'logs';

// --- UI COMPONENTS (Style Preserved) ---

const SearchInput = ({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder: string }) => (
  <div className="mb-6">
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-background border border-border p-3 text-sm font-medium focus:outline-none focus:border-ytRed placeholder-gray-600"
    />
  </div>
);

const BarChart = ({ data, color = "bg-foreground" }: { data: { label: string, value: number }[], color?: string }) => {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="flex items-end gap-2 h-40 pt-6 border-b border-border">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end group relative hover:bg-panel transition-colors rounded-t-sm">
          <div 
            className={`w-full mx-auto max-w-[30px] rounded-t-sm transition-all duration-500 ${color} opacity-80 group-hover:opacity-100`}
            style={{ height: `${(d.value / max) * 100}%`, minHeight: '4px' }}
          ></div>
          <div className="text-[9px] text-gray-500 text-center mt-2 truncate font-mono uppercase">
            {d.label}
          </div>
          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-20 font-bold">
            {d.value}
          </div>
        </div>
      ))}
    </div>
  );
};

const HorizontalBar = ({ label, value, max, color = "bg-ytRed" }: { label: string, value: number, max: number, color?: string }) => (
  <div className="mb-4">
    <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${(value / (max || 1)) * 100}%` }}
      ></div>
    </div>
  </div>
);

const KPICard = ({ title, value, subtext }: { title: string, value: string | number, subtext: string }) => (
  <div className="bg-panel border border-border p-6 shadow-sm hover:border-ytRed/50 transition-colors">
    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{title}</h3>
    <div className="text-4xl font-black text-foreground mb-1 tracking-tight">{value}</div>
    <p className="text-xs text-ytRed font-bold">{subtext}</p>
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

  // System Update State
  const [systemMsg, setSystemMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const init = async () => {
      await checkAdminAndFetch();
    };
    init();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/');

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role !== 'admin') return router.push('/');

      await fetchAllData();
    } catch (error) {
      console.error("Auth check failed", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    // Fetch all data in parallel for speed
    const [subRes, userRes, repRes, comRes] = await Promise.all([
      supabase.from('submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('reports').select('*').order('created_at', { ascending: false }),
      supabase.from('comments').select('created_at, tags')
    ]);

    setSubmissions(subRes.data || []);
    setUsers(userRes.data || []);
    setReports(repRes.data || []);
    setComments(comRes.data || []);
  };

  // --- ADVANCED ANALYTICS CALCS ---
  const stats = useMemo(() => {
    if (loading) return null;

    // 1. Tag Analysis
    const tagCounts: Record<string, number> = {};
    comments.forEach(c => {
      if (c.tags && Array.isArray(c.tags)) {
        c.tags.forEach((t: string) => {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      }
    });
    let topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) // Top 5
      .map(([label, value]) => ({ label, value }));
    if (topTags.length === 0) topTags = [{ label: "No Tags", value: 0 }];

    // 2. Submission Metrics
    const lockedCount = submissions.filter(s => s.is_locked).length;
    const openCount = submissions.length - lockedCount;
    const videoTypeCount = submissions.filter(s => s.submission_type === 'video').length;
    const channelTypeCount = submissions.length - videoTypeCount;

    // 3. User Growth (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = users.filter(u => new Date(u.created_at) > sevenDaysAgo).length;

    // 4. Engagement Rate
    const engagementRate = submissions.length > 0 
      ? (comments.length / submissions.length).toFixed(1) 
      : "0";

    // 5. Timeline Data (Last 7 Days)
    const timelineMap: Record<string, number> = {};
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      timelineMap[str] = 0;
    }
    submissions.forEach(s => {
      const date = new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (timelineMap[date] !== undefined) timelineMap[date]++;
    });
    const timelineData = Object.entries(timelineMap).map(([label, value]) => ({ label, value }));

    return { 
      topTags, 
      lockedCount, 
      openCount, 
      timelineData, 
      videoTypeCount, 
      channelTypeCount,
      newUsers,
      engagementRate
    };
  }, [submissions, comments, users, loading]);

  // --- DERIVED DATA (FILTERING) ---
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(s => 
      s.channel_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.submission_type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [submissions, searchQuery]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      (u.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // --- LOGS GENERATION ---
  const activityLogs = useMemo(() => {
    const logs = [
      ...submissions.map(s => ({ type: 'SUBMISSION', label: `New: ${s.channel_name}`, date: s.created_at })),
      ...reports.map(r => ({ type: 'REPORT', label: `Flagged: ${r.reason}`, date: r.created_at })),
      ...users.map(u => ({ type: 'USER', label: `Joined: ${u.full_name || 'User'}`, date: u.created_at }))
    ];
    // Sort by newest
    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 50);
  }, [submissions, reports, users]);


  // --- ACTIONS ---
  const toggleLock = async (id: string, current: boolean) => {
    const { error } = await supabase.from('submissions').update({ is_locked: !current }).eq('id', id);
    if (!error) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, is_locked: !current } : s));
    } else {
      alert("Error updating lock status");
    }
  };

  const toggleHide = async (id: string, current: boolean) => {
    const { error } = await supabase.from('submissions').update({ is_hidden: !current }).eq('id', id);
    if (!error) {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, is_hidden: !current } : s));
    } else {
      alert("Error updating visibility");
    }
  };

  const toggleBan = async (id: string, current: boolean) => {
    if(!confirm(`Are you sure you want to ${current ? 'unban' : 'ban'} this user?`)) return;
    const { error } = await supabase.from('profiles').update({ is_banned: !current }).eq('id', id);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_banned: !current } : u));
    } else {
      alert("Error updating user status");
    }
  };
  
  const resolveReport = async (id: string) => {
    const { error } = await supabase.from('reports').update({ status: 'resolved' }).eq('id', id);
    if (!error) {
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
    }
  };

  const sendSystemUpdate = async () => {
    if (!systemMsg.trim()) return alert("Please enter a message.");
    if (!confirm(`Send this update to ALL ${users.length} users?`)) return;

    setIsSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // Ensure you have a Postgres function named 'broadcast_system_update'
    const { error } = await supabase.rpc('broadcast_system_update', {
      admin_id: user?.id,
      update_message: systemMsg
    });

    if (error) {
      console.error(error);
      alert("Broadcast failed. Check RLS policies or function definitions.");
    } else {
      alert("System update sent to all users.");
      setSystemMsg("");
    }
    setIsSending(false);
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-ytRed border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-xs uppercase tracking-widest">Loading Admin Data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-panel sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-ytRed rounded-full animate-pulse"></div>
          <h1 className="font-black uppercase tracking-widest text-lg">Admin<span className="text-gray-500">Panel</span></h1>
        </div>
        <button onClick={() => router.push('/')} className="px-4 py-2 border border-border text-[10px] font-bold uppercase hover:bg-white hover:text-black transition-colors">
          Exit Dashboard
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-56 border-r border-border bg-panel flex flex-col overflow-y-auto">
          <div className="p-4 flex flex-col gap-1">
            <p className="text-[9px] font-black uppercase text-gray-500 mb-2 pl-2">Menu</p>
            {[
              { id: 'analytics', label: 'Overview', count: 0 },
              { id: 'content', label: 'Content DB', count: submissions.length },
              { id: 'users', label: 'User DB', count: users.length },
              { id: 'reports', label: 'Reports', count: reports.filter(r => r.status === 'pending').length },
              { id: 'logs', label: 'Live Logs', count: 0 },
              { id: 'updates', label: 'System Blast', count: 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as Tab); setSearchQuery(""); }}
                className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider border rounded transition-all flex justify-between items-center group
                  ${activeTab === tab.id 
                    ? 'bg-foreground text-background border-foreground shadow-lg' 
                    : 'border-transparent text-gray-500 hover:bg-background hover:text-foreground'}
                `}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${activeTab === tab.id ? 'bg-background text-foreground' : 'bg-ytRed text-white'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-background overflow-y-auto">
          
          {/* --- ANALYTICS TAB --- */}
          {activeTab === 'analytics' && stats && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-end"><div><h2 className="text-3xl font-black uppercase italic tracking-tighter">System Health</h2><p className="text-sm text-gray-500 font-medium">Metrics & KPIs</p></div></div>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="Total Submissions" value={submissions.length} subtext={`${stats.videoTypeCount} Video / ${stats.channelTypeCount} Channel`} />
                <KPICard title="Total Feedback" value={comments.length} subtext={`Avg ${stats.engagementRate} per post`} />
                <KPICard title="User Base" value={users.length} subtext={`+${stats.newUsers} this week`} />
                <KPICard title="Pending Reports" value={reports.filter(r => r.status === 'pending').length} subtext="Action Required" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-panel border border-border p-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Submission Activity (7 Days)</h3>
                  <BarChart data={stats.timelineData} color="bg-ytRed" />
                </div>
                <div className="bg-panel border border-border p-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Trending Tags</h3>
                  {stats.topTags.map(tag => <HorizontalBar key={tag.label} label={tag.label} value={tag.value} max={stats.topTags[0]?.value || 1} color="bg-foreground" />)}
                </div>
              </div>
            </div>
          )}

          {/* --- CONTENT TAB --- */}
          {activeTab === 'content' && (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-2xl font-black uppercase mb-6">Content Database</h2>
              <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search by Channel Name or Type..." />
              
              <div className="border border-border bg-panel overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background border-b border-border text-[10px] font-black uppercase text-gray-500 tracking-wider">
                    <tr><th className="p-4">Channel Name</th><th className="p-4">Type</th><th className="p-4 text-center">Indicators</th><th className="p-4 text-right">Moderation</th></tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className={`border-b border-border transition-colors ${sub.is_hidden ? 'bg-gray-900/30 opacity-60' : 'hover:bg-background/50'} ${sub.is_locked ? 'border-l-4 border-l-red-600' : ''}`}>
                        <td className="p-4">
                            <span className="font-bold text-foreground block">{sub.channel_name}</span>
                            <span className="text-[10px] text-gray-500">{new Date(sub.created_at).toLocaleDateString()}</span>
                        </td>
                        <td className="p-4 text-xs font-mono text-gray-500 uppercase">{sub.submission_type}</td>
                        <td className="p-4 text-center">
                           <div className="flex items-center justify-center gap-2">
                             {sub.is_locked && <span title="Locked">🔒</span>}
                             {sub.is_hidden && <span title="Hidden">👁️‍🗨️</span>}
                             {!sub.is_locked && !sub.is_hidden && <span className="text-gray-600">—</span>}
                           </div>
                        </td>
                        <td className="p-4 flex justify-end gap-2">
                          <button onClick={() => toggleLock(sub.id, sub.is_locked)} className="min-w-[80px] px-3 py-1.5 text-[10px] font-bold uppercase border bg-background border-border text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors">{sub.is_locked ? 'Unlock' : 'Lock'}</button>
                          <button onClick={() => toggleHide(sub.id, sub.is_hidden)} className="min-w-[80px] px-3 py-1.5 text-[10px] font-bold uppercase border bg-background border-border text-gray-400 hover:border-foreground hover:text-foreground transition-colors">{sub.is_hidden ? 'Unhide' : 'Hide'}</button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-mono text-xs uppercase">No results found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- USERS TAB --- */}
          {activeTab === 'users' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
               <h2 className="text-2xl font-black uppercase mb-6">User Database</h2>
               <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search by Name or Email..." />

               <div className="grid grid-cols-1 gap-4">
                 {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                   <div key={user.id} className="flex justify-between items-center p-4 border border-border bg-panel shadow-sm hover:border-gray-500 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                            {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-gray-400">?</span>}
                         </div>
                         <div>
                            <p className="font-bold text-sm flex gap-2 items-center">{user.full_name || "Anonymous"} {user.role === 'admin' && <span className="bg-ytRed text-white text-[9px] px-1.5 py-0.5 rounded">ADMIN</span>}</p>
                            <p className="text-[10px] text-gray-500 font-mono">{user.email}</p>
                         </div>
                      </div>
                      {user.role !== 'admin' && <button onClick={() => toggleBan(user.id, user.is_banned)} className={`text-[10px] font-black uppercase px-4 py-2 border transition-colors ${user.is_banned ? 'border-green-500 text-green-500 hover:bg-green-500/10' : 'border-red-500 text-red-500 hover:bg-red-500/10'}`}>{user.is_banned ? 'Unban' : 'Ban'}</button>}
                   </div>
                 )) : (
                    <div className="p-8 text-center text-gray-500 font-mono text-xs uppercase border border-dashed border-border">No users found</div>
                 )}
               </div>
            </div>
          )}

          {/* --- REPORTS TAB --- */}
          {activeTab === 'reports' && (
             <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
               <h2 className="text-2xl font-black uppercase mb-6">Flagged Content</h2>
               {reports.length === 0 ? <p className="text-gray-500 font-mono text-sm">No reports filed.</p> : reports.map((report) => (
                 <div key={report.id} className={`bg-panel border-l-4 p-6 mb-4 shadow-sm ${report.status === 'pending' ? 'border-red-500' : 'border-green-500 opacity-60'}`}>
                    <div className="flex justify-between mb-4"><span className="text-xs font-black uppercase">{report.status}</span><span className="text-[10px] font-mono text-gray-500">{new Date(report.created_at).toLocaleDateString()}</span></div>
                    <p className="text-sm font-bold mb-1">"{report.reason}"</p>
                    {report.status === 'pending' && <button onClick={() => resolveReport(report.id)} className="mt-4 px-6 py-2 bg-foreground text-background text-xs font-black uppercase hover:bg-gray-300 transition-colors">Mark Resolved</button>}
                 </div>
               ))}
             </div>
          )}

          {/* --- LOGS TAB (NEW) --- */}
          {activeTab === 'logs' && (
             <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
                <h2 className="text-2xl font-black uppercase mb-6">Live Activity Log</h2>
                <div className="bg-panel border border-border p-6 font-mono text-xs">
                    {activityLogs.map((log, i) => (
                        <div key={i} className="flex gap-4 border-b border-border/50 py-3 last:border-0">
                            <span className="text-gray-500 min-w-[140px]">{new Date(log.date).toLocaleString()}</span>
                            <span className={`font-bold ${log.type === 'REPORT' ? 'text-red-500' : log.type === 'USER' ? 'text-blue-400' : 'text-foreground'}`}>[{log.type}]</span>
                            <span>{log.label}</span>
                        </div>
                    ))}
                </div>
             </div>
          )}

          {/* --- UPDATES TAB --- */}
          {activeTab === 'updates' && (
            <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-2xl font-black uppercase mb-2">System Blast</h2>
              <p className="text-sm text-gray-500 mb-8">Send a global notification to all registered users.</p>

              <div className="bg-panel border border-border p-8 shadow-sm">
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Update Message</label>
                 <textarea 
                   value={systemMsg}
                   onChange={(e) => setSystemMsg(e.target.value)}
                   placeholder="e.g. Maintenance scheduled for tonight..." 
                   className="w-full h-40 bg-background border border-border p-4 text-sm font-medium focus:outline-none focus:border-ytRed resize-none mb-6"
                 />
                 
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-400">
                       Target: <span className="text-foreground font-bold">{users.length} Users</span>
                    </p>
                    <button 
                       onClick={sendSystemUpdate}
                       disabled={isSending || !systemMsg.trim()}
                       className={`px-8 py-3 bg-ytRed text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                       {isSending ? 'Sending...' : 'Broadcast Message'}
                    </button>
                 </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}