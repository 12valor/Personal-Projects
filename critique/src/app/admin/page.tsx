"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

// --- TYPES ---
type Tab = 'analytics' | 'verification' | 'content' | 'users' | 'reports';

// --- GRAPH COMPONENTS (CSS ONLY) ---
const BarChart = ({ data, color = "bg-foreground" }: { data: { label: string, value: number }[], color?: string }) => {
  // Prevent division by zero if no data
  const max = Math.max(...data.map(d => d.value)) || 1;
  
  return (
    <div className="flex items-end gap-2 h-40 pt-6 border-b border-border">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end group relative hover:bg-panel transition-colors rounded-t-sm">
          {/* The Bar */}
          <div 
            className={`w-full mx-auto max-w-[30px] rounded-t-sm transition-all duration-500 ${color} opacity-80 group-hover:opacity-100`}
            style={{ height: `${(d.value / max) * 100}%`, minHeight: '4px' }}
          ></div>
          {/* Label */}
          <div className="text-[9px] text-gray-500 text-center mt-2 truncate font-mono uppercase">
            {d.label}
          </div>
          {/* Tooltip */}
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
  // DEFAULT TO ANALYTICS SO YOU SEE IT INSTANTLY
  const [activeTab, setActiveTab] = useState<Tab>('analytics');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [queue, setQueue] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
    if (profile?.role !== 'admin') return router.push('/');

    await fetchAllData();
    setLoading(false);
  };

  const fetchAllData = async () => {
    // 1. Verification Queue
    const { data: qData } = await supabase.from('submissions').select('*').eq('verification_status', 'pending').order('created_at', { ascending: false });
    setQueue(qData || []);

    // 2. All Submissions
    const { data: subData } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    setSubmissions(subData || []);

    // 3. Users
    const { data: uData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(uData || []);

    // 4. Reports
    const { data: rData } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
    setReports(rData || []);

    // 5. Comments
    const { data: cData } = await supabase.from('comments').select('created_at, tags');
    setComments(cData || []);
  };

  // --- ANALYTICS LOGIC ---
  const stats = useMemo(() => {
    if (loading) return null;

    // A. Tag Usage
    const tagCounts: Record<string, number> = {};
    comments.forEach(c => {
      if (c.tags && Array.isArray(c.tags)) {
        c.tags.forEach((t: string) => {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      }
    });
    
    // Sort and take top 5, or show placeholders if empty
    let topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([label, value]) => ({ label, value }));
      
    if (topTags.length === 0) {
      topTags = [{ label: "No Tags Used", value: 0 }];
    }

    // B. Verification Split
    const verifiedCount = submissions.filter(s => s.is_verified).length;
    const unverifiedCount = submissions.length - verifiedCount;

    // C. Thread Status
    const lockedCount = submissions.filter(s => s.is_locked).length;
    const openCount = submissions.length - lockedCount;

    // D. Timeline (Last 7 Days)
    const timelineMap: Record<string, number> = {};
    // Initialize last 7 days with 0
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      timelineMap[str] = 0;
    }
    // Fill with data
    submissions.forEach(s => {
      const date = new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (timelineMap[date] !== undefined) timelineMap[date]++;
    });
    
    const timelineData = Object.entries(timelineMap).map(([label, value]) => ({ label, value }));

    return { topTags, verifiedCount, unverifiedCount, lockedCount, openCount, timelineData };
  }, [submissions, comments, loading]);

  // --- ACTIONS ---
  const handleVerification = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('submissions').update({ verification_status: status, is_verified: status === 'approved' }).eq('id', id);
    fetchAllData();
  };

  const toggleLock = async (id: string, current: boolean) => {
    await supabase.from('submissions').update({ is_locked: !current }).eq('id', id);
    fetchAllData();
  };

  const toggleHide = async (id: string, current: boolean) => {
    await supabase.from('submissions').update({ is_hidden: !current }).eq('id', id);
    fetchAllData();
  };

  const toggleBan = async (id: string, current: boolean) => {
    if(!confirm("Are you sure you want to ban/unban this user?")) return;
    await supabase.from('profiles').update({ is_banned: !current }).eq('id', id);
    fetchAllData();
  };
  
  const resolveReport = async (id: string) => {
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', id);
    fetchAllData();
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
              { id: 'analytics', label: 'Platform Health', count: 0 },
              { id: 'verification', label: 'Verification Queue', count: queue.length },
              { id: 'content', label: 'Manage Content', count: 0 },
              { id: 'users', label: 'User Database', count: 0 },
              { id: 'reports', label: 'Reports', count: reports.filter(r => r.status === 'pending').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
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
              
              <div className="flex justify-between items-end">
                 <div>
                   <h2 className="text-3xl font-black uppercase italic tracking-tighter">Analytics Overview</h2>
                   <p className="text-sm text-gray-500 font-medium">Real-time platform metrics.</p>
                 </div>
              </div>

              {/* KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="Total Channels" value={submissions.length} subtext="Submitted All Time" />
                <KPICard title="Total Critiques" value={comments.length} subtext="Feedback Given" />
                <KPICard title="Active Threads" value={stats.openCount} subtext="Open for Review" />
                <KPICard title="Pending Action" value={queue.length + reports.filter(r => r.status === 'pending').length} subtext="Queue + Reports" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* TIMELINE CHART */}
                <div className="lg:col-span-2 bg-panel border border-border p-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Submission Activity (Last 7 Days)</h3>
                  <BarChart data={stats.timelineData} color="bg-ytRed" />
                </div>

                {/* FEEDBACK TAGS */}
                <div className="bg-panel border border-border p-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Top Critique Categories</h3>
                  <div className="space-y-2">
                    {stats.topTags.map(tag => (
                      <HorizontalBar 
                        key={tag.label} 
                        label={tag.label} 
                        value={tag.value} 
                        max={stats.topTags[0]?.value || 1} 
                        color="bg-foreground"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* BOTTOM STATS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-panel border border-border p-6 flex items-center justify-between">
                   <div>
                     <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Verification Rate</h3>
                     <p className="text-2xl font-black">{Math.round((stats.verifiedCount / (submissions.length || 1)) * 100)}%</p>
                     <p className="text-[10px] text-gray-400">Of all submissions are verified creators</p>
                   </div>
                   <div className="w-16 h-16 border-4 border-ytRed rounded-full flex items-center justify-center text-xs font-bold text-ytRed">
                      {stats.verifiedCount}
                   </div>
                </div>
                
                <div className="bg-panel border border-border p-6 flex items-center justify-between">
                   <div>
                     <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Moderation Health</h3>
                     <p className="text-2xl font-black">{reports.filter(r => r.status === 'pending').length}</p>
                     <p className="text-[10px] text-gray-400">Unresolved Reports</p>
                   </div>
                   <div className={`w-16 h-16 border-4 rounded-full flex items-center justify-center text-xs font-bold ${reports.filter(r => r.status === 'pending').length > 0 ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                      {reports.filter(r => r.status === 'pending').length > 0 ? 'ACTION' : 'GOOD'}
                   </div>
                </div>
              </div>
            </div>
          )}
          
          {/* --- VERIFICATION QUEUE --- */}
          {activeTab === 'verification' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-2xl font-black uppercase mb-6">Verification Queue</h2>
              {queue.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-border text-gray-500">
                  <p className="font-bold">All caught up!</p>
                  <p className="text-xs">No pending verifications.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {queue.map((item) => (
                    <div key={item.id} className="bg-panel border border-border p-6 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-full overflow-hidden border border-border">
                           <img src={item.avatar_url || "https://ui-avatars.com/api/?background=random"} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <a href={item.youtube_url} target="_blank" className="text-lg font-black hover:text-ytRed hover:underline">{item.channel_name}</a>
                          <p className="text-xs text-gray-500 font-medium">Context: {item.context_text || "No context provided."}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleVerification(item.id, 'rejected')} className="px-6 py-3 border border-border text-xs font-black uppercase hover:bg-red-950 hover:text-red-500 hover:border-red-900 transition-colors">Reject</button>
                        <button onClick={() => handleVerification(item.id, 'approved')} className="px-6 py-3 bg-ytRed text-white text-xs font-black uppercase shadow-yt-glow hover:-translate-y-1 transition-transform">Approve</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- CONTENT MODERATION --- */}
          {activeTab === 'content' && (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-2xl font-black uppercase mb-6">Content Database</h2>
              <div className="border border-border bg-panel overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background border-b border-border text-[10px] font-black uppercase text-gray-500 tracking-wider">
                    <tr>
                      <th className="p-4">Channel Name</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="border-b border-border hover:bg-background/50 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-foreground block">{sub.channel_name}</span>
                          <div className="flex gap-2 mt-1">
                             {sub.is_hidden && <span className="text-[9px] bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded font-bold uppercase">Hidden</span>}
                             {sub.is_locked && <span className="text-[9px] bg-red-900/50 text-red-200 px-1.5 py-0.5 rounded font-bold uppercase">Locked</span>}
                          </div>
                        </td>
                        <td className="p-4 text-xs font-mono text-gray-500 uppercase">{sub.verification_status}</td>
                        <td className="p-4 flex justify-end gap-2">
                          <button 
                            onClick={() => toggleLock(sub.id, sub.is_locked)} 
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase border transition-colors ${sub.is_locked ? 'bg-orange-500 border-orange-500 text-white' : 'border-border text-gray-400 hover:text-foreground'}`}
                          >
                            {sub.is_locked ? 'Unlock' : 'Lock'}
                          </button>
                          <button 
                            onClick={() => toggleHide(sub.id, sub.is_hidden)} 
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase border transition-colors ${sub.is_hidden ? 'bg-gray-600 border-gray-600 text-white' : 'border-border text-gray-400 hover:text-foreground'}`}
                          >
                            {sub.is_hidden ? 'Unhide' : 'Hide'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- USER MANAGEMENT --- */}
          {activeTab === 'users' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
               <h2 className="text-2xl font-black uppercase mb-6">User Database</h2>
               <div className="grid grid-cols-1 gap-4">
                 {users.map((user) => (
                   <div key={user.id} className="flex justify-between items-center p-4 border border-border bg-panel shadow-sm hover:border-gray-500 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                            <img src={user.avatar_url || "https://ui-avatars.com/api/?background=random"} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                               <p className="font-bold text-sm">{user.full_name || "Anonymous"}</p>
                               {user.role === 'admin' && <span className="bg-ytRed text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-black">Admin</span>}
                               {user.is_banned && <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-black">BANNED</span>}
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono">{user.email}</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         {user.role !== 'admin' && (
                           <button 
                             onClick={() => toggleBan(user.id, user.is_banned)}
                             className={`text-[10px] font-black uppercase px-4 py-2 border transition-colors ${user.is_banned ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white' : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'}`}
                           >
                             {user.is_banned ? 'Unban User' : 'Ban User'}
                           </button>
                         )}
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* --- REPORTS PANEL --- */}
          {activeTab === 'reports' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
              <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                Flagged Content 
                {reports.filter(r => r.status === 'pending').length > 0 && <span className="text-sm bg-red-500 text-white px-2 py-1 rounded font-black">{reports.filter(r => r.status === 'pending').length} New</span>}
              </h2>
              
              {reports.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-border text-gray-500">
                  <p className="font-bold">Clean record!</p>
                  <p className="text-xs">No active reports.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className={`bg-panel border-l-4 p-6 shadow-sm ${report.status === 'pending' ? 'border-red-500' : 'border-green-500 opacity-60'}`}>
                       <div className="flex justify-between mb-4">
                          <span className={`text-xs font-black uppercase ${report.status === 'pending' ? 'text-red-500' : 'text-green-500'}`}>
                            {report.status === 'pending' ? '⚠ Pending Review' : '✓ Resolved'}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">{new Date(report.created_at).toLocaleDateString()}</span>
                       </div>
                       
                       <div className="mb-6">
                         <p className="text-sm font-bold mb-1">Reason: "{report.reason}"</p>
                         <p className="text-xs text-gray-400 font-mono">Target ID: {report.target_id} ({report.target_type})</p>
                       </div>

                       {report.status !== 'resolved' ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => resolveReport(report.id)}
                              className="px-6 py-2 bg-foreground text-background text-xs font-black uppercase hover:bg-gray-300 transition-colors"
                            >
                              Mark Resolved
                            </button>
                            <button className="px-6 py-2 border border-border text-xs font-black uppercase hover:bg-white hover:text-black transition-colors">
                              View Content
                            </button>
                          </div>
                       ) : (
                          <div className="text-[10px] font-bold text-gray-500 uppercase">Case Closed</div>
                       )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}