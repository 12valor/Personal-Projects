import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
// Make sure this import path is correct for your folder structure
import { authOptions } from "../../auth/[...nextauth]/route"; 

export async function GET() {
  const session: any = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // FIX: Create an OAuth2 client instead of passing the token directly to google.youtube()
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const youtube = google.youtube({
      version: "v3",
      auth: auth, // Pass the authenticated OAuth client here
    });

    const response = await youtube.channels.list({
      part: ["statistics", "snippet", "contentDetails"],
      mine: true,
    });

    const channel = response.data.items?.[0];

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    return NextResponse.json({
      title: channel.snippet?.title,
      thumbnail: channel.snippet?.thumbnails?.medium?.url,
      stats: channel.statistics,
    });

  } catch (error: any) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}