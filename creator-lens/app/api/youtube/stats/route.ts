import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
// FIX: Point to the lib file, NOT the route file
import { authOptions } from "@/lib/auth"; 

const youtube = google.youtube("v3");

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await youtube.channels.list({
      access_token: session.accessToken,
      part: ["statistics", "snippet"],
      mine: true,
    });

    const channel = response.data.items?.[0];

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    return NextResponse.json({
      stats: {
        subscriberCount: channel.statistics?.subscriberCount,
        viewCount: channel.statistics?.viewCount,
        videoCount: channel.statistics?.videoCount,
        title: channel.snippet?.title,
        customUrl: channel.snippet?.customUrl,
        thumbnail: channel.snippet?.thumbnails?.default?.url,
      },
    });
  } catch (error) {
    console.error("YouTube Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}