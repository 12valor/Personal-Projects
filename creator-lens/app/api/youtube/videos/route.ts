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

    const youtube = google.youtube({ version: "v3", auth });

    // 1. Get the User's "Uploads" Playlist ID
    const channelResponse = await youtube.channels.list({
      part: ["contentDetails"],
      mine: true,
    });

    const uploadsPlaylistId = channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return NextResponse.json({ error: "No uploads found" }, { status: 404 });
    }

    // 2. Get the most recent 5 videos from that playlist
    const playlistResponse = await youtube.playlistItems.list({
      part: ["contentDetails"],
      playlistId: uploadsPlaylistId,
      maxResults: 5,
    });

    const videoIds = playlistResponse.data.items?.map((item) => item.contentDetails?.videoId);

    if (!videoIds || videoIds.length === 0) {
      return NextResponse.json({ videos: [] });
    }

    // 3. Get detailed stats (views, likes) for those videos
    const videosResponse = await youtube.videos.list({
      part: ["snippet", "statistics"],
      id: videoIds as string[], // Cast to string array
    });

    // 4. Clean up the data to send to the frontend
    const videos = videosResponse.data.items?.map((video) => ({
      id: video.id,
      title: video.snippet?.title,
      thumbnail: video.snippet?.thumbnails?.medium?.url,
      publishedAt: video.snippet?.publishedAt,
      views: video.statistics?.viewCount || "0",
      likes: video.statistics?.likeCount || "0",
      comments: video.statistics?.commentCount || "0",
    }));

    return NextResponse.json({ videos });

  } catch (error: any) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}