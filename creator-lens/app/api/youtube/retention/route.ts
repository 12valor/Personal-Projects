import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth"; // <--- FIXED IMPORT

export async function GET(request: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) return NextResponse.json({ error: "Missing Video ID" }, { status: 400 });

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const ytAnalytics = google.youtubeAnalytics({ version: "v2", auth });
    const youtube = google.youtube({ version: "v3", auth });

    // 1. Get Video Duration (needed to map % to Seconds)
    const videoDetails = await youtube.videos.list({
      part: ["contentDetails"],
      id: [videoId],
    });
    const durationISO = videoDetails.data.items?.[0]?.contentDetails?.duration;
    
    // Helper to parse ISO duration (PT4M13S -> Seconds)
    const parseDuration = (iso: string) => {
      const match = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      const hours = (parseInt(match?.[1] || "0")) * 3600;
      const minutes = (parseInt(match?.[2] || "0")) * 60;
      const seconds = parseInt(match?.[3] || "0");
      return hours + minutes + seconds;
    };
    const totalSeconds = parseDuration(durationISO || "PT0S");

    // 2. Get Retention Data (Elapsed Video Time Ratio)
    // Note: This returns 0.01, 0.02... 1.00 mapping to retention %
    const retentionReq = await ytAnalytics.reports.query({
      ids: "channel==MINE",
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 90 days
      endDate: new Date().toISOString().split('T')[0],
      metrics: "audienceRetentionType",
      dimensions: "elapsedVideoTimeRatio",
      filters: `video==${videoId};audienceRetentionType==ORGANIC`,
      sort: "elapsedVideoTimeRatio",
    });

    return NextResponse.json({ 
      duration: totalSeconds,
      retention: retentionReq.data.rows // [[ratio, retentionScore], ...]
    });

  } catch (error: any) {
    console.error("Retention API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}