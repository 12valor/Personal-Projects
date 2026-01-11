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

    const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    // 1. Existing Requests (Loyalty, Retention, Traffic)
    const loyaltyReq = await ytAnalytics.reports.query({
      ids: "channel==MINE",
      startDate, endDate,
      metrics: "views,averageViewDuration",
      dimensions: "subscribedStatus",
    });

    const retentionReq = await ytAnalytics.reports.query({
      ids: "channel==MINE",
      startDate, endDate,
      metrics: "averageViewPercentage,views",
      dimensions: "video",
      sort: "-views",
      maxResults: 15, 
    });

    const trafficReq = await ytAnalytics.reports.query({
      ids: "channel==MINE",
      startDate, endDate,
      metrics: "views",
      dimensions: "insightTrafficSourceType",
      sort: "-views",
    });

    // --- NEW REQUESTS ---

    // 2. SEARCH TERMS (For Trend Hijack)
    // What are people searching to find this channel?
    const searchReq = await ytAnalytics.reports.query({
      ids: "channel==MINE",
      startDate, endDate,
      metrics: "views",
      dimensions: "insightTrafficSourceDetail",
      filters: "insightTrafficSourceType==YT_SEARCH",
      sort: "-views",
      maxResults: 20
    });

    // 3. RELATED VIDEO SOURCES (For Viewer Journey)
    // Which videos are driving traffic to this channel?
    const relatedReq = await ytAnalytics.reports.query({
      ids: "channel==MINE",
      startDate, endDate,
      metrics: "views",
      dimensions: "insightTrafficSourceDetail",
      filters: "insightTrafficSourceType==RELATED_VIDEO",
      sort: "-views",
      maxResults: 10
    });

    return NextResponse.json({
      loyalty: loyaltyReq.data.rows,
      retention: retentionReq.data.rows,
      traffic: trafficReq.data.rows,
      searchTerms: searchReq.data.rows,   // [[term, views], ...]
      relatedVideos: relatedReq.data.rows // [[videoId, views], ...]
    });

  } catch (error: any) {
    console.error("Deep Analytics Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}