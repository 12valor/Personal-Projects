import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const youtube = google.youtube({ version: "v3", auth });

    // 1. Search for Channel ID
    let channelId = query;
    if (query.startsWith("@") || query.length < 24) {
      const searchRes = await youtube.search.list({
        part: ["snippet"],
        type: ["channel"],
        q: query,
        maxResults: 1,
      });
      if (!searchRes.data.items?.length) throw new Error("Channel not found");
      channelId = searchRes.data.items[0].snippet?.channelId || "";
    }

    // 2. Get Statistics
    const channelRes = await youtube.channels.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: [channelId],
    });
    const channel = channelRes.data.items?.[0];
    if (!channel) throw new Error("Channel details not found");

    // 3. Get Recent Uploads
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) throw new Error("No uploads found");

    const videosRes = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId: uploadsPlaylistId,
      maxResults: 10,
    });

    // 4. Get Video Stats (Views/Likes)
    const videoIds = videosRes.data.items?.map(i => i.contentDetails?.videoId || "") || [];
    let videosWithStats: any[] = [];
    
    if (videoIds.length > 0) {
      const videoStatsRes = await youtube.videos.list({
        part: ["statistics", "snippet"],
        id: videoIds,
      });
      
      videosWithStats = videoStatsRes.data.items?.map(v => ({
        id: v.id,
        title: v.snippet?.title,
        thumbnail: v.snippet?.thumbnails?.medium?.url,
        publishedAt: v.snippet?.publishedAt,
        views: v.statistics?.viewCount,
        likes: v.statistics?.likeCount,
        tags: v.snippet?.tags || [],
      })) || [];
    }

    return NextResponse.json({
      info: {
        title: channel.snippet?.title,
        thumbnail: channel.snippet?.thumbnails?.default?.url,
        subs: channel.statistics?.subscriberCount,
        views: channel.statistics?.viewCount,
        videoCount: channel.statistics?.videoCount,
      },
      videos: videosWithStats
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}