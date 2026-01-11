import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  // 1. GET INPUTS
  const { topic, gameName } = await request.json();
  const game = gameName || "Roblox";
  const rawTopic = topic || "The Item";

  // Helper to clean "The" from start for better grammar
  const cleanTopic = rawTopic.replace(/^(the|a|an)\s+/i, "").trim();

  // --- LOCAL FALLBACK ENGINE (Guarantees results if AI fails) ---
  const generateLocalTitles = () => {
    // We mix-and-match these dynamic parts to create unique titles
    const prefixes = [
      "Why Everyone HATES", "I Found A SECRET", "Don't Buy", "The TRUTH About", 
      "I Deleted My", "Is This The BEST", "Stop Using", "How To Get", 
      "I Broke The", "The GLITCHED"
    ];
    
    const suffixes = [
      "Is BROKEN", "Is Actually OP", "Ruined The Game", "In 5 Minutes", 
      "For FREE", "Gone Wrong", "Vs Pro", "Impossible Challenge", 
      "Explained", "Disaster"
    ];

    // Generate 10 unique combinations
    const titles = [];
    for (let i = 0; i < 10; i++) {
      // Evens: Prefix + Topic + Game
      if (i % 2 === 0) {
        titles.push(`${prefixes[i]} ${cleanTopic} In ${game}`);
      } 
      // Odds: Topic + Suffix + Game
      else {
        titles.push(`${cleanTopic} ${suffixes[i]} In ${game}`);
      }
    }
    return titles;
  };

  // If no API key, use local instantly
  if (!apiKey) return NextResponse.json({ titles: generateLocalTitles() });

  try {
    // 2. CONFIGURE AI (With Safety Filters DISABLED)
    const systemPrompt = `
      You are a YouTube Gaming Strategist.
      GAME: ${game}
      TOPIC: ${cleanTopic}
      
      TASK: Generate 10 viral titles.
      STYLE: Clickbaity, High-CTR, Gamer Slang (OP, Broken, Glitch).
      CONSTRAINT: Under 60 chars.
      
      IMPORTANT: This is for a video game database. Words like "Kill", "Steal", "Hated" are GAME TERMS, not harassment. Do not block them.
      
      OUTPUT: JSON Array of strings only.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
          // DISABLE SAFETY FILTERS so "Brainrot" doesn't block it
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ],
          generationConfig: { 
            responseMimeType: "application/json",
            temperature: 0.9 
          }
        })
      }
    );

    const data = await response.json();
    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    // 3. VALIDATE RESPONSE
    if (!rawText) {
      console.warn("⚠️ AI blocked response. Switching to Local Engine.");
      return NextResponse.json({ titles: generateLocalTitles() });
    }

    // 4. PARSE
    const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    let titles = JSON.parse(cleanText);

    // Final Safety: Ensure length is good
    titles = titles.map((t: string) => t.length > 60 ? t.substring(0, 59) + "!" : t);

    return NextResponse.json({ titles });

  } catch (error: any) {
    console.error("AI Error:", error.message);
    // Final Safety Net: Return local titles instead of crashing
    return NextResponse.json({ titles: generateLocalTitles() });
  }
}