import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { topic } = await request.json();
  if (!topic) return NextResponse.json({ error: "Topic required" }, { status: 400 });

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const youtube = google.youtube({ version: "v3", auth });

    // 1. SEARCH: Fetch 50 candidates
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const searchRes = await youtube.search.list({
      part: ["snippet"],
      q: topic,
      type: ["video"],
      order: "relevance",
      publishedAfter: sixMonthsAgo.toISOString(),
      maxResults: 50,
    });

    const videoIds = searchRes.data.items?.map(i => i.id?.videoId).filter(Boolean) as string[];

    // 2. STATS: Fetch detailed metrics
    const statsRes = await youtube.videos.list({
      part: ["statistics", "contentDetails", "snippet"],
      id: videoIds,
    });

    // 3. ENHANCED ANALYSIS ENGINE
    const queryWords = topic.toLowerCase().split(" ").filter((w: string) => w.length > 2);

    const rawVideos = statsRes.data.items?.map(v => {
      const views = parseInt(v.statistics?.viewCount || "0");
      const likes = parseInt(v.statistics?.likeCount || "0");
      const comments = parseInt(v.statistics?.commentCount || "0");
      const published = new Date(v.snippet?.publishedAt || "");
      
      // Prevent division by zero for brand new videos
      const daysOld = Math.max(0.5, (Date.now() - published.getTime()) / (1000 * 3600 * 24));
      
      const title = v.snippet?.title || "";
      const lowerTitle = title.toLowerCase();
      const isRelevant = queryWords.some((word: string) => lowerTitle.includes(word));

      // --- NEW METRICS CALCULATIONS ---
      
      // 1. Velocity (Views per day)
      const velocity = Math.round(views / daysOld);

      // 2. Engagement Rate (Proxy for Retention/Quality)
      // Typical strong rate is > 3-4%
      const engagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0;

      // 3. Trending Status
      // If video is < 7 days old AND has high velocity relative to the group
      const isFresh = daysOld < 7;
      
      return {
        id: v.id,
        title: title,
        channel: v.snippet?.channelTitle,
        thumbnail: v.snippet?.thumbnails?.medium?.url,
        views,
        likes,
        velocity,
        engagementRate: parseFloat(engagementRate.toFixed(2)),
        isRelevant,
        daysOld: parseFloat(daysOld.toFixed(1)),
        isFresh, // Used to flag "Trending Now"
        publishedAt: v.snippet?.publishedAt,
      };
    }) || [];

    // Calculate Average Velocity of this batch to determine "High Growth" baseline
    const avgVelocity = rawVideos.reduce((sum, v) => sum + v.velocity, 0) / (rawVideos.length || 1);

    // Filter & Tag
    const processedVideos = rawVideos
      .filter(v => v.isRelevant && v.velocity > 5) // Basic noise filter
      .map(v => ({
        ...v,
        // Add dynamic tags based on relative performance
        tags: [
          v.isFresh && v.velocity > avgVelocity ? "Trending" : null,
          v.engagementRate > 5 ? "High Engagement" : null,
          v.velocity > (avgVelocity * 2) ? "Viral Velocity" : null
        ].filter(Boolean)
      }))
      .sort((a, b) => b.velocity - a.velocity) // Default sort: Velocity
      .slice(0, 15);

    // 4. PATTERN INTELLIGENCE (Updated to weigh by Engagement too)
    const stopWords = new Set(["the", "and", "for", "that", "with", "this", "how", "video", "youtube", "review", "tutorial"]);
    const wordMap: Record<string, number> = {};
    
    processedVideos.forEach(v => {
      const words = v.title.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/);
      // Weight: Velocity * Engagement Multiplier (Reward quality views)
      const weight = v.velocity * (1 + (v.engagementRate / 100)); 
      
      words.forEach(w => {
        if (w.length > 3 && !stopWords.has(w) && !queryWords.includes(w)) {
          wordMap[w] = (wordMap[w] || 0) + weight; 
        }
      });
    });

    const topKeywords = Object.entries(wordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word]) => word);

    // Structure Detection (Same logic, new data)
    const structures = [
      { type: "Listicle", regex: /^\d+|top \d+/i, count: 0, example: "" },
      { type: "How-To", regex: /^how to/i, count: 0, example: "" },
      { type: "Negative/Warning", regex: /stop|don't|never|mistake|worst/i, count: 0, example: "" },
      { type: "Versus", regex: /\bvs\b|\bversus\b/i, count: 0, example: "" },
      { type: "Secret/Hidden", regex: /secret|hidden|nobody|hacks/i, count: 0, example: "" },
      { type: "Question", regex: /\?$/, count: 0, example: "" },
    ];

    processedVideos.forEach(v => {
      structures.forEach(s => {
        if (s.regex.test(v.title)) {
          s.count++;
          if (!s.example || v.velocity > (processedVideos.find(ex => ex.title === s.example)?.velocity || 0)) {
            s.example = v.title; 
          }
        }
      });
    });

    const dominantStructure = structures.sort((a, b) => b.count - a.count)[0];

    return NextResponse.json({
      marketData: processedVideos, 
      intelligence: {
        topKeywords,
        dominantPattern: dominantStructure.count > 0 ? dominantStructure : null,
        avgTitleLength: processedVideos.length > 0 ? Math.round(processedVideos.reduce((acc, v) => acc + v.title.length, 0) / processedVideos.length) : 0,
      }
    });

  } catch (error: any) {
    console.error("Title Intelligence Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}