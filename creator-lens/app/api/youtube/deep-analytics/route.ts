import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const ytAnalytics = google.youtubeAnalytics({ version: "v2", auth });

    // Dates: Last 90 days for broad trends
    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    // 1. AUDIENCE LOYALTY (Proxied via Subscribed Status)
    const loyaltyReq = await ytAnalytics.reports.query({
      ids: "channel==MINE",
      startDate, endDate,
      metrics: "views,averageViewDuration",
      dimensions: "subscribedStatus",
    });

    // 2. RETENTION ANALYZER (Avg % per Video)
    const retentionReq = await ytAnalytics.reports.query({
      ids: "channel==MINE",
      startDate, endDate,
      metrics: "averageViewPercentage,views",
      dimensions: "video",
      sort: "-views",
      maxResults: 10, 
    });

    // 3. TRAFFIC SOURCES (For Topic Saturation)
    const trafficReq = await ytAnalytics.reports.query({
      ids: "channel==MINE",
      startDate, endDate,
      metrics: "views",
      dimensions: "insightTrafficSourceType",
      sort: "-views",
    });

    // 4. DEMOGRAPHICS (Optional for future use)
    const demoReq = await ytAnalytics.reports.query({
      ids: "channel==MINE",
      startDate, endDate,
      metrics: "viewerPercentage",
      dimensions: "ageGroup",
      sort: "ageGroup",
    });

    return NextResponse.json({
      loyalty: loyaltyReq.data.rows,    // [[status, views, avgDuration], ...]
      retention: retentionReq.data.rows,// [[videoId, avg%, views], ...]
      traffic: trafficReq.data.rows,    // [[source, views], ...]
      demographics: demoReq.data.rows,  // [[age, %], ...]
    });

  } catch (error: any) {
    console.error("Deep Analytics Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}