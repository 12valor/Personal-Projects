"use client";

import { useMemo } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

export default function PostingScheduler({ data }: { data: any[] }) {
  // Process data into a usable 7x24 grid
  const processedData = useMemo(() => {
    if (!data) return null;

    // 1. Initialize empty grid
    const grid: Record<string, number> = {}; 
    let maxViews = 0;

    // 2. Fill grid with API data
    // API returns rows: [dayOfWeek(0-6), hour(0-23), views]
    data.forEach((row: any) => {
      const day = row[0];
      const hour = row[1];
      const views = row[2];
      grid[`${day}-${hour}`] = views;
      if (views > maxViews) maxViews = views;
    });

    // 3. Find Top 3 Times
    const sortedSlots = [...data]
      .sort((a, b) => b[2] - a[2])
      .slice(0, 3)
      .map((row: any) => ({
        day: DAYS[row[0]],
        hour: row[1],
        views: row[2]
      }));

    return { grid, maxViews, topTimes: sortedSlots };
  }, [data]);

  if (!data || !processedData) return null;

  // Helper to get color intensity
  const getOpacity = (views: number) => {
    if (!views) return 0.05; // Base color for 0 views
    return Math.max(0.1, views / processedData.maxViews); // Scale 0.1 to 1.0
  };

  const formatHour = (h: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}${ampm}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>📅</span> Best Times to Post
          </h3>
          <p className="text-sm text-gray-500">Based on when your viewers were active in the last 30 days.</p>
        </div>
        
        {/* Top 3 Recommendations Badge */}
        <div className="flex flex-col gap-2">
          {processedData.topTimes.map((slot, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
               <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                 #{i + 1}
               </span>
               <span className="font-semibold text-gray-700">
                 {slot.day} at {formatHour(slot.hour)}
               </span>
            </div>
          ))}
        </div>
      </div>

      {/* HEATMAP VISUALIZATION */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          
          {/* Header Row (Hours) */}
          <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1">
            <div></div> {/* Empty corner */}
            {HOURS.map((h) => (
              <div key={h} className="text-[10px] text-gray-400 text-center">
                {h % 3 === 0 ? h : ''} {/* Only show every 3rd hour label */}
              </div>
            ))}
          </div>

          {/* Data Rows (Days) */}
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 mb-1 items-center">
              {/* Day Label */}
              <div className="text-xs font-bold text-gray-500">{day}</div>
              
              {/* Hour Cells */}
              {HOURS.map((hour) => {
                const views = processedData.grid[`${dayIndex}-${hour}`] || 0;
                const opacity = getOpacity(views);
                
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="h-8 rounded-sm relative group cursor-default transition-all hover:scale-110 hover:z-10 hover:ring-2 hover:ring-black"
                    style={{
                      backgroundColor: `rgba(37, 99, 235, ${opacity})`, // Blue base
                    }}
                    title={`${day} @ ${formatHour(hour)}: ${views} views`}
                  >
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs p-1 rounded whitespace-nowrap z-20">
                      {views} views
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-end items-center gap-2 mt-4 text-xs text-gray-400">
        <span>Less Active</span>
        <div className="w-16 h-2 rounded bg-gradient-to-r from-blue-50 to-blue-600"></div>
        <span>Highly Active</span>
      </div>

    </div>
  );
}