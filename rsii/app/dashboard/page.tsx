"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";

// Dynamic import for the Map
const Map = dynamic(() => import("@/components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg animate-pulse min-h-[500px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="text-slate-500 text-sm font-medium tracking-wide">Loading Map Data...</span>
      </div>
    </div>
  )
});

// Light Theme for Nivo Charts
const nivoTheme = {
  text: { fontSize: 12, fill: '#64748b', fontFamily: 'inherit' }, // slate-500
  axis: {
    domain: { line: { stroke: '#e2e8f0', strokeWidth: 1 } }, // slate-200
    ticks: { line: { stroke: '#e2e8f0', strokeWidth: 1 } },
  },
  grid: { line: { stroke: '#f1f5f9', strokeWidth: 1, strokeDasharray: '4 4' } }, // slate-100
  tooltip: {
    container: { background: '#ffffff', color: '#0f172a', fontSize: 13, borderRadius: 6, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  },
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  
  // States for the dashboard layout
  const [kpis, setKpis] = useState({ totalArea: 0, totalReports: 0, activeIncidents: 0 });
  const [severityData, setSeverityData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [topAreas, setTopAreas] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('rssi_reports')
        .select('*'); 
      
      if (data && data.length > 0) {
        // 1. KPI Calculations
        const activeData = data.filter(row => row.status !== 'archived');
        const totalArea = activeData.reduce((sum, row) => sum + (Number(row.hectares_affected) || 0), 0);
        
        const activeIncidents = activeData.filter(row => Number(row.severity_level) >= 3).length; 
        
        setKpis({
          totalArea,
          totalReports: data.length, 
          activeIncidents
        });

        // 2. Severity Distribution (Pie)
        const sevCounts: Record<number, number> = {};
        data.forEach(row => {
          const sev = Number(row.severity_level) || 1;
          sevCounts[sev] = (sevCounts[sev] || 0) + 1;
        });
        setSeverityData(Object.keys(sevCounts).map(key => ({
          id: `Level ${key}`,
          label: `Level ${key}`,
          value: sevCounts[Number(key)],
          // Updated colors for light mode (Red, Orange, Royal Blue)
          color: Number(key) >= 4 ? '#dc2626' : Number(key) === 3 ? '#ea580c' : '#2563eb'
        })));

        // 3. Incident Trend (Line)
        const dateMap: Record<string, number> = {};
        data.forEach(row => {
          if (!row.created_at) return;
          const date = new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          dateMap[date] = (dateMap[date] || 0) + 1; 
        });
        const trendPts = Object.keys(dateMap).slice(-7).map(date => ({ x: date, y: dateMap[date] }));
        setTrendData([{ id: 'Incidents', color: '#2563eb', data: trendPts }]); // Royal Blue line

        // 4. Top Affected Areas (Bar)
        const sortedByArea = [...data].sort((a, b) => (Number(b.hectares_affected) || 0) - (Number(a.hectares_affected) || 0));
        setTopAreas(sortedByArea.slice(0, 5).map(row => ({
          site: `ID-${row.id.toString().substring(0,4)}`,
          area: Number(row.hectares_affected) || 0
        })));

        // 5. Recent Reports (Table)
        const sortedByDate = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRecentReports(sortedByDate.slice(0, 6));
      }
      setLoading(false);
    }

    fetchData();

    // Realtime listener for the dashboard
    const channel = supabase.channel('dashboard-metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rssi_reports' }, () => {
        fetchData(); 
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION - Royal Blue */}
      <aside className="w-20 lg:w-64 bg-blue-900 border-r border-blue-950 hidden md:flex flex-col shrink-0 transition-all shadow-lg z-20">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-blue-800 bg-blue-950/30">
          <div className="hidden lg:block leading-tight">
            <h1 className="text-lg font-bold text-white tracking-wide">Talisay LGU</h1>
            <p className="text-sm text-blue-300 font-medium">RSSI Command</p>
          </div>
          <div className="lg:hidden text-blue-300 font-bold text-xl">TL</div>
        </div>

        <nav className="flex-1 py-6 space-y-2 overflow-y-auto">
          <div className="hidden lg:block px-6 pb-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">Dashboards</div>
          
          {/* Active Navigation Link */}
          <Link href="/dashboard" className="flex items-center gap-3 px-6 py-3 bg-blue-800/80 text-white border-l-4 border-white transition-colors group shadow-inner">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            <span className="hidden lg:block text-sm font-semibold">Main Operations</span>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        
        {/* SCROLLABLE DASHBOARD GRID */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* 1. TOP ROW: KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200 flex flex-col justify-between shadow-sm min-h-[130px]">
                <p className="text-sm font-semibold text-slate-500">Total Affected Area</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl text-slate-900 font-bold tracking-tight">{loading ? "--" : kpis.totalArea.toFixed(1)}</span>
                  <span className="text-sm text-blue-600 font-bold">Hectares</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200 flex flex-col justify-between shadow-sm min-h-[130px]">
                <p className="text-sm font-semibold text-slate-500">Total Reports</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl text-slate-900 font-bold tracking-tight">{loading ? "--" : kpis.totalReports}</span>
                  <span className="text-sm text-blue-600 font-bold">Logs</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200 flex flex-col justify-between shadow-sm min-h-[130px]">
                <p className="text-sm font-semibold text-slate-500">Active Incidents</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl text-red-600 font-bold tracking-tight">{loading ? "--" : kpis.activeIncidents}</span>
                  <span className="text-sm text-red-600 font-bold">Pending</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200 flex flex-col justify-between shadow-sm min-h-[130px]">
                <p className="text-sm font-semibold text-slate-500">Avg Response Time</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl text-slate-900 font-bold tracking-tight">1.4</span>
                  <span className="text-sm text-slate-500 font-bold">Hours (Est)</span>
                </div>
              </div>
            </div>

            {/* 2. MIDDLE ROW: Map (Left) & Charts (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Map Canvas */}
              <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 flex flex-col min-h-[500px] overflow-hidden shadow-sm">
                <div className="h-14 border-b border-slate-100 flex items-center px-6 bg-slate-50">
                  <span className="text-base font-bold text-slate-800">Live Map Overview</span>
                </div>
                <div className="flex-1 relative z-0 bg-slate-100">
                  <Map />
                </div>
              </div>

              {/* Right Column: Severity & Trend */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                
                {/* Severity Pie */}
                <div className="bg-white rounded-lg border border-slate-200 flex flex-col flex-1 min-h-[260px] shadow-sm">
                  <div className="h-14 border-b border-slate-100 flex items-center px-6 bg-slate-50 rounded-t-lg">
                    <span className="text-base font-bold text-slate-800">Severity Dist.</span>
                  </div>
                  <div className="flex-1 p-4">
                    {!loading && severityData.length > 0 ? (
                      <ResponsivePie
                        data={severityData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        innerRadius={0.65}
                        padAngle={2}
                        cornerRadius={3}
                        colors={{ datum: 'data.color' }}
                        theme={nivoTheme}
                        enableArcLinkLabels={false}
                        arcLabel="value"
                        arcLabelsTextColor="#ffffff"
                        arcLabelsSkipAngle={10}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-slate-400">No Data Available</div>
                    )}
                  </div>
                </div>

                {/* Incident Trend Line */}
                <div className="bg-white rounded-lg border border-slate-200 flex flex-col flex-1 min-h-[260px] shadow-sm">
                  <div className="h-14 border-b border-slate-100 flex items-center px-6 bg-slate-50 rounded-t-lg">
                    <span className="text-base font-bold text-slate-800">Recent Trend</span>
                  </div>
                  <div className="flex-1 p-4">
                    {!loading && trendData[0]?.data.length > 0 ? (
                      <ResponsiveLine
                        data={trendData}
                        margin={{ top: 20, right: 20, bottom: 30, left: 30 }}
                        xScale={{ type: 'point' }}
                        yScale={{ type: 'linear', min: 0, max: 'auto' }}
                        curve="monotoneX"
                        theme={nivoTheme}
                        colors={['#2563eb']}
                        lineWidth={3}
                        enablePoints={true}
                        pointSize={6}
                        pointColor="#ffffff"
                        pointBorderWidth={2}
                        pointBorderColor="#2563eb"
                        enableArea={true}
                        areaOpacity={0.1}
                        useMesh={true}
                        enableGridX={false}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-slate-400">No Data Available</div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* 3. BOTTOM ROW: Top Areas & Recent Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
              
              {/* Top Affected Areas */}
              <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200 flex flex-col min-h-[350px] shadow-sm">
                <div className="h-14 border-b border-slate-100 flex items-center px-6 bg-slate-50 rounded-t-lg">
                  <span className="text-base font-bold text-slate-800">Top Affected Zones</span>
                </div>
                <div className="flex-1 p-4">
                  {!loading && topAreas.length > 0 ? (
                    <ResponsiveBar
                      data={topAreas}
                      keys={['area']}
                      indexBy="site"
                      layout="horizontal"
                      margin={{ top: 10, right: 20, bottom: 40, left: 60 }}
                      padding={0.3}
                      colors={['#94a3b8']} // slate-400
                      theme={nivoTheme}
                      borderRadius={2}
                      axisBottom={{ tickSize: 0, tickPadding: 8 }}
                      axisLeft={{ tickSize: 0, tickPadding: 8 }}
                      enableLabel={true}
                      labelTextColor="#1e293b" // slate-800
                      enableGridY={false}
                      enableGridX={true}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-slate-400">No Data Available</div>
                  )}
                </div>
              </div>

              {/* Recent Reports Table */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 flex flex-col min-h-[350px] shadow-sm">
                <div className="h-14 border-b border-slate-100 flex items-center px-6 bg-slate-50 rounded-t-lg">
                  <span className="text-base font-bold text-slate-800">Recent Log Entries</span>
                </div>
                <div className="flex-1 overflow-x-auto p-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Report ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Date Time</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Area</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Severity</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">Loading records...</td>
                        </tr>
                      ) : recentReports.length > 0 ? (
                        recentReports.map((report) => (
                          <tr key={report.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                            <td className="px-6 py-4 text-sm text-slate-800 font-semibold">TL-{report.id.toString().substring(0, 8)}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {new Date(report.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                              {report.hectares_affected} <span className="text-slate-500 text-xs ml-1 font-normal">HA</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                                report.severity_level >= 4 ? 'bg-red-50 text-red-700 border border-red-200' : 
                                report.severity_level === 3 ? 'bg-orange-50 text-orange-700 border border-orange-200' : 
                                'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                Level {report.severity_level}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center gap-2 text-sm font-bold capitalize ${
                                 report.status === 'responding' || report.status === 'responded' ? 'text-blue-600' : 
                                 report.status === 'dispatched' ? 'text-orange-600' : 'text-slate-500'
                               }`}>
                                 {(report.status === 'responding' || report.status === 'dispatched') && <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>}
                                 {report.status || 'pending'}
                               </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">No records found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}