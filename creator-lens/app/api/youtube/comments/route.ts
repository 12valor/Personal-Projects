import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

// Helper: Extract ID from any YouTube URL (Server-Side)
const extractVideoId = (input: string) => {
  if (!input) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = input.match(regExp);
  return (match && match[2].length === 11) ? match[2] : input;
};

export async function GET(request: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const rawVideoId = searchParams.get("videoId");

  if (!rawVideoId) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
  }

  // CLEAN THE ID HERE
  const videoId = extractVideoId(rawVideoId);

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const youtube = google.youtube({ version: "v3", auth });

    const response = await youtube.commentThreads.list({
      part: ["snippet"],
      videoId: videoId, // Send the clean ID
      maxResults: 20,
      textFormat: "plainText",
    });

    const comments = response.data.items?.map((item: any) => ({
      id: item.id,
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      likes: item.snippet.topLevelComment.snippet.likeCount,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
    }));

    return NextResponse.json({ 
      comments,
      totalResults: response.data.pageInfo?.totalResults 
    });

  } catch (error: any) {
    console.error("YouTube API Error:", error.message);

    // Specific error handling for disabled comments
    if (error.message.includes("commentsDisabled")) {
      return NextResponse.json({ error: "Comments are disabled on this video." }, { status: 403 });
    }
    
    // Specific error for invalid ID (404)
    if (error.code === 404) {
      return NextResponse.json({ error: "Video not found. Check the ID." }, { status: 404 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}