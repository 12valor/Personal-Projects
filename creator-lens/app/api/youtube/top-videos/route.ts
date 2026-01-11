import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = process.env.YOUTUBE_API_KEY; // Ensure this is in .env.local
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId"); // You'll pass this from the frontend

  if (!apiKey || !channelId) {
    return NextResponse.json({ error: "Missing API Key or Channel ID" }, { status: 400 });
  }

  try {
    // Fetch videos sorted by viewCount (Most Popular)
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=viewCount&maxResults=5&type=video`,
      { cache: "no-store" }
    );
    const data = await response.json();

    if (!data.items) throw new Error("YouTube API returned no items");

    // Get detailed stats (views, likes, comments) for these videos
    const videoIds = data.items.map((item: any) => item.id.videoId).join(",");
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=statistics,contentDetails`,
      { cache: "no-store" }
    );
    const statsData = await statsResponse.json();

    // Merge Data
    const videos = data.items.map((item: any, index: number) => {
      const stats = statsData.items.find((s: any) => s.id === item.id.videoId)?.statistics;
      const duration = statsData.items.find((s: any) => s.id === item.id.videoId)?.contentDetails?.duration;
      
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        views: stats?.viewCount || 0,
        likes: stats?.likeCount || 0,
        comments: stats?.commentCount || 0,
        duration: duration || "PT0M",
      };
    });

    return NextResponse.json({ videos });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}