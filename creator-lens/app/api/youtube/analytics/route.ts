import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session: any = await getServerSession(authOptions);
  
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    
    const ytAnalytics = google.youtubeAnalytics({ version: "v2", auth });
    const youtube = google.youtube({ version: "v3", auth });

    // Dates: Last 30 Days
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    // --- 1. GROWTH REPORT ---
    let growthRows = [];
    try {
      const res = await ytAnalytics.reports.query({
        ids: "channel==MINE",
        startDate, endDate,
        metrics: "views,subscribersGained,subscribersLost,estimatedMinutesWatched",
        dimensions: "day",
        sort: "day",
      });
      growthRows = res.data.rows || [];
    } catch (e) { console.error("Growth Data Failed", e); }

    // --- 2. TRAFFIC SOURCES ---
    let trafficRows = [];
    try {
      const res = await ytAnalytics.reports.query({
        ids: "channel==MINE",
        startDate, endDate,
        metrics: "views",
        dimensions: "insightTrafficSourceType",
        sort: "-views",
        maxResults: 5,
      });
      trafficRows = res.data.rows || [];
    } catch (e) { console.error("Traffic Data Failed", e); }

    // --- 3. GEOGRAPHY ---
    let geoRows = [];
    try {
      const res = await ytAnalytics.reports.query({
        ids: "channel==MINE",
        startDate, endDate,
        metrics: "views",
        dimensions: "country",
        sort: "-views",
        maxResults: 5,
      });
      geoRows = res.data.rows || [];
    } catch (e) { console.error("Geo Data Failed", e); }

    // --- 4. HEATMAP (The likely cause of your 500 error) ---
    let heatmapRows = [];
    try {
      const res = await ytAnalytics.reports.query({
        ids: "channel==MINE",
        startDate, endDate,
        metrics: "views",
        dimensions: "dayOfWeek,hour", // Complex query
        sort: "-views",
      });
      heatmapRows = res.data.rows || [];
    } catch (e) { 
      console.warn("Heatmap Data Unavailable (Normal for new channels)"); 
      // We don't throw an error here, we just return empty array
    }

    // --- 5. TOP TAGS ---
    let topTags: any[] = [];
    try {
      const topVideos = await ytAnalytics.reports.query({
        ids: "channel==MINE",
        startDate, endDate,
        metrics: "views",
        dimensions: "video",
        sort: "-views",
        maxResults: 10,
      });

      const videoIds = topVideos.data.rows?.map((row: any) => row[0]) || [];
      
      if (videoIds.length > 0) {
        const videoDetails = await youtube.videos.list({
          part: ["snippet"],
          id: videoIds,
        });

        const tagMap: Record<string, number> = {};
        videoDetails.data.items?.forEach((video) => {
          const stats = topVideos.data.rows?.find((r: any) => r[0] === video.id);
          const views = stats ? Number(stats[1]) : 0;
          
          video.snippet?.tags?.forEach((tag) => {
            const lowerTag = tag.toLowerCase();
            tagMap[lowerTag] = (tagMap[lowerTag] || 0) + views;
          });
        });

        topTags = Object.entries(tagMap)
          .map(([tag, views]) => ({ tag, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);
      }
    } catch (e) { console.error("Tags Data Failed", e); }

    // RETURN ALL DATA (Even if some parts are empty)
    return NextResponse.json({
      growth: growthRows,
      traffic: trafficRows,
      geo: geoRows,
      heatmap: heatmapRows,
      topTags: topTags,
    });

  } catch (error: any) {
    console.error("Critical Analytics Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}