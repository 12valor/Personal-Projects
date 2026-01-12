import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth"; // <--- FIXED IMPORT

export async function GET() {
  const session: any = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const youtubeAnalytics = google.youtubeAnalytics({
    version: "v2",
    auth: process.env.YOUTUBE_API_KEY, 
  });

  const youtubeData = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });

  try {
    // 1. Analytics Report
    const response = await youtubeAnalytics.reports.query({
      access_token: session.accessToken,
      ids: "channel==MINE",
      startDate: "2022-01-01",
      endDate: new Date().toISOString().split("T")[0], 
      metrics: "views,estimatedMinutesWatched,subscribersGained,subscribersLost",
      dimensions: "day",
      sort: "day",
    });

    // 2. Traffic Sources
    const trafficRes = await youtubeAnalytics.reports.query({
      access_token: session.accessToken,
      ids: "channel==MINE",
      startDate: "2023-01-01",
      endDate: new Date().toISOString().split("T")[0],
      metrics: "views",
      dimensions: "insightTrafficSourceType",
      sort: "-views",
      maxResults: 5,
    });

    // 3. Geography
    const geoRes = await youtubeAnalytics.reports.query({
      access_token: session.accessToken,
      ids: "channel==MINE",
      startDate: "2023-01-01",
      endDate: new Date().toISOString().split("T")[0],
      metrics: "views",
      dimensions: "country",
      sort: "-views",
      maxResults: 5,
    });

    // 4. Top Tags
    const topVideosRes = await youtubeData.search.list({
      access_token: session.accessToken,
      part: ["snippet"],
      forMine: true,
      order: "viewCount",
      type: ["video"],
      maxResults: 5,
    });

    const topTagsMap: Record<string, number> = {};
    if (topVideosRes.data.items) {
      const videoIds = topVideosRes.data.items.map((v) => v.id?.videoId).filter(Boolean) as string[];
      if (videoIds.length > 0) {
        const videosDetails = await youtubeData.videos.list({
          access_token: session.accessToken,
          part: ["snippet", "statistics"],
          id: videoIds,
        });

        videosDetails.data.items?.forEach((video) => {
          const views = parseInt(video.statistics?.viewCount || "0");
          video.snippet?.tags?.forEach((tag) => {
            topTagsMap[tag] = (topTagsMap[tag] || 0) + views;
          });
        });
      }
    }

    const topTags = Object.entries(topTagsMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag, views]) => ({ tag, views }));

    return NextResponse.json({
      growth: response.data.rows,
      traffic: trafficRes.data.rows,
      geo: geoRes.data.rows,
      topTags: topTags,
    });

  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}