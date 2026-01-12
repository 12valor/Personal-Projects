import { NextResponse } from "next/server";
import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

  try {
    // 1. Search for Channel
    const searchRes = await youtube.search.list({
      part: ["snippet"],
      q: query,
      type: ["channel"],
      maxResults: 1,
    });

    if (!searchRes.data.items?.length) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const channelId = searchRes.data.items[0].snippet?.channelId;

    // 2. Get Channel Stats & Uploads ID
    const channelRes = await youtube.channels.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: [channelId!],
    });

    const channel = channelRes.data.items?.[0];
    if (!channel) throw new Error("Channel details missing");

    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;

    // 3. Get Recent Videos
    const playlistRes = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId: uploadsPlaylistId,
      maxResults: 20, 
    });

    const videoIds = playlistRes.data.items?.map((item) => item.contentDetails?.videoId!) || [];

    // 4. Get Deep Video Stats (Views, Tags)
    const videosRes = await youtube.videos.list({
      part: ["snippet", "statistics"],
      id: videoIds,
    });

    // 5. Format Data
    const videos = videosRes.data.items?.map((v) => ({
      id: v.id,
      title: v.snippet?.title,
      thumbnail: v.snippet?.thumbnails?.high?.url || v.snippet?.thumbnails?.medium?.url,
      publishedAt: v.snippet?.publishedAt,
      views: v.statistics?.viewCount || "0",
      likes: v.statistics?.likeCount || "0",
      comments: v.statistics?.commentCount || "0",
      tags: v.snippet?.tags || [], 
    }));

    const data = {
      info: {
        title: channel.snippet?.title,
        customUrl: channel.snippet?.customUrl || query,
        subs: channel.statistics?.subscriberCount || "0",
        videoCount: channel.statistics?.videoCount || "0",
        thumbnail: channel.snippet?.thumbnails?.medium?.url,
      },
      videos: videos || [],
    };

    return NextResponse.json(data);

  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: "Failed to fetch competitor data" }, { status: 500 });
  }
}