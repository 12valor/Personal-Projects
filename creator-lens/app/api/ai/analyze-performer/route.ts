import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_API_KEY; // Gemini Key
  if (!apiKey) return NextResponse.json({ error: "Missing AI Key" }, { status: 500 });

  try {
    const { videoId, title, stats } = await request.json();

    // 1. FETCH TRANSCRIPT
    let transcriptText = "";
    try {
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
      // Take first 1500 words to analyze hook + body pacing (avoid token limits)
      transcriptText = transcriptItems
        .map(t => t.text)
        .join(" ")
        .slice(0, 8000); 
    } catch (e) {
      console.warn("Transcript failed, falling back to metadata only");
      transcriptText = "(Transcript unavailable. Analyze based on title/stats only.)";
    }

    // 2. GEMINI ANALYSIS PROMPT
    const systemPrompt = `
      You are a Senior YouTube Strategist. 
      Analyze this top-performing video to explain WHY it succeeded.
      
      CONTEXT:
      Title: "${title}"
      Views: ${stats.views}
      Engagement: ${stats.likes} Likes, ${stats.comments} Comments
      
      TRANSCRIPT SEGMENT (First ~5 mins):
      "${transcriptText}"

      TASK:
      Perform a deep-dive analysis. Return strictly valid JSON.
      
      JSON FORMAT:
      {
        "hookAnalysis": {
           "score": 8, // 1-10
           "mechanism": "Curiosity Gap / Immediate Value / Shock",
           "explanation": "Concise explanation of the first 15 seconds."
        },
        "retentionDrivers": [
           "List 2-3 specific reasons viewers kept watching based on the script pacing/content."
        ],
        "algorithmSignals": {
           "clickThroughFactors": "Why did people click? (Title/Topic analysis)",
           "engagementTriggers": "What caused the likes/comments?"
        },
        "playbook": {
           "repeat": "What specific element should the creator do again?",
           "avoid": "What risk exists if they change this formula?",
           "nextTest": "A concrete video idea to capitalize on this success."
        }
      }
    `;

    // 3. CALL GEMINI (Direct Fetch)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResponse) throw new Error("AI returned no analysis");

    return NextResponse.json(JSON.parse(textResponse));

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}