import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session: any = await getServerSession(authOptions);
  if (!session?.accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { parentId, text } = await request.json();

    if (!parentId || !text) {
      return NextResponse.json({ error: "Missing parentId or text" }, { status: 400 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });
    const youtube = google.youtube({ version: "v3", auth });

    // Insert the reply
    const response = await youtube.comments.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          parentId: parentId, // The ID of the comment we are replying to
          textOriginal: text,
        },
      },
    });

    return NextResponse.json({ success: true, id: response.data.id });

  } catch (error: any) {
    console.error("Reply Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}