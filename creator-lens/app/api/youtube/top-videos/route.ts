import { NextResponse } from "next/server";

// Helper: Parse Duration accurately
function parseDuration(duration: string): number {
  if (!duration) return 0;
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;

  const hours = (parseInt(match[1] || '0') || 0);
  const minutes = (parseInt(match[2] || '0') || 0);
  const seconds = (parseInt(match[3] || '0') || 0);

  return (hours * 3600) + (minutes * 60) + seconds;
}

export async function GET(request: Request) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY; 
    const { searchParams } = new URL(request.url);
    let channelId = searchParams.get("channelId");

    if (channelId) channelId = channelId.trim();

    if (!apiKey) return NextResponse.json({ error: "CONFIGURATION ERROR: Missing API Key" }, { status: 400 });
    if (!channelId) return NextResponse.json({ error: "INPUT ERROR: Missing Channel ID" }, { status: 400 });

    // --- STRATEGY: DEEP SCAN ---
    // Instead of using the buggy 'videoDuration' filter, we fetch the top 100 videos
    // and sort them ourselves. This prevents the "Invalid Filter" error.

    const baseUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=viewCount&maxResults=50&type=video`;

    // 1. Fetch Page 1 (Top 50)
    const page1Res = await fetch(baseUrl, { cache: "no-store" });
    const page1Data = await page1Res.json();
    
    if (page1Data.error) {
      throw new Error(`YouTube API Error: ${page1Data.error.message}`);
    }

    let allItems = page1Data.items || [];
    const nextPageToken = page1Data.nextPageToken;

    // 2. Fetch Page 2 (Next 50) - To ensure we find Long Form videos buried by Shorts
    if (nextPageToken) {
       const page2Res = await fetch(`${baseUrl}&pageToken=${nextPageToken}`, { cache: "no-store" });
       const page2Data = await page2Res.json();
       if (page2Data.items) {
          allItems = [...allItems, ...page2Data.items];
       }
    }

    // Filter out duplicates just in case
    const uniqueIds = Array.from(new Set(allItems.map((item: any) => item.id.videoId)));

    if (uniqueIds.length === 0) {
      return NextResponse.json({ error: "No videos found for this channel." }, { status: 404 });
    }

    // 3. FETCH DETAILS (Duration & Stats)
    // We break this into chunks of 50 because the 'videos' endpoint has a limit
    const chunks = [];
    for (let i = 0; i < uniqueIds.length; i += 50) {
        chunks.push(uniqueIds.slice(i, i + 50));
    }

    const detailsPromises = chunks.map(chunk => 
        fetch(
          `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${chunk.join(",")}&part=statistics,snippet,contentDetails`, 
          { cache: "no-store" }
        ).then(res => res.json())
    );

    const detailsResults = await Promise.all(detailsPromises);
    
    // Flatten results
    const fullStatsItems: any[] = [];
    detailsResults.forEach((res: any) => {
        if (res.items) fullStatsItems.push(...res.items);
    });

    // 4. SORT & SEPARATE
    const longForm: any[] = [];
    const shorts: any[] = [];

    fullStatsItems.forEach((details: any) => {
      const durationSecs = parseDuration(details.contentDetails.duration);
      
      const videoObj = {
        id: details.id,
        title: details.snippet.title,
        thumbnail: details.snippet.thumbnails.high.url,
        publishedAt: details.snippet.publishedAt,
        views: parseInt(details.statistics?.viewCount || '0'),
        likes: parseInt(details.statistics?.likeCount || '0'),
        comments: parseInt(details.statistics?.commentCount || '0'),
        duration: details.contentDetails.duration,
        durationSecs: durationSecs
      };

      // Strict Rule: <= 60 seconds is a Short
      if (durationSecs <= 60) {
        shorts.push(videoObj);
      } else {
        longForm.push(videoObj);
      }
    });

    // Sort descending by views
    longForm.sort((a,b) => b.views - a.views);
    shorts.sort((a,b) => b.views - a.views);

    return NextResponse.json({ 
      longForm: longForm.slice(0, 20),
      shorts: shorts.slice(0, 20)
    });

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}