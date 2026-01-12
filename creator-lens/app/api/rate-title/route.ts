import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // 1. TRY OPENAI (If Key Exists)
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a YouTube title strategist with creator-level intuition.
              Your style is sharp, direct, confident, and modern — similar to “Wixor” style titles.
              You do NOT generate generic, safe, or over-explained suggestions.
              
              Your task is to ANALYZE and IMPROVE YouTube titles using real YouTube criteria:
              search intent, CTR competition, clarity, and viewer trust.
              
              STRICT RULES:
              - No emojis
              - No filler phrases (e.g., “Discover”, “Ultimate”, “You won’t believe”)
              - No corporate or motivational tone
              - No AI-sounding phrasing
              - Titles must sound human-written and creator-native
              - Favor punchy phrasing, concrete nouns, and strong verbs
              
              EVALUATION CRITERIA (Score out of 10 for each):
              1. Search Intent Alignment (relevance)
              2. Clarity & Specificity (clarity)
              3. CTR Strength (ctr)
              4. Structure & Length (structure)
              5. Trust & Retention Signals (trust)
              
              Return a raw JSON object with this exact structure:
              {
                "score": number (0-100),
                "criteria": {
                  "relevance": number (0-10),
                  "clarity": number (0-10),
                  "ctr": number (0-10),
                  "structure": number (0-10),
                  "keywords": number (0-10), 
                  "trust": number (0-10)
                },
                "strengths": ["string", "string"],
                "weaknesses": ["string", "string"],
                "suggestions": {
                  "search": "Search-dominant version",
                  "ctr": "Browse-dominant version",
                  "balanced": "Balanced version"
                }
              }
              
              For "strengths" and "weaknesses": Be blunt. Bullet points only.
              For "suggestions": Provide MAX 3 Wixor-style improved titles.`
            },
            { role: "user", content: `Analyze this title: "${title}"` }
          ],
          response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (content) {
          const data = JSON.parse(content);
          // Ensure keyword score exists (mapping relevance to keywords if missing)
          if (!data.criteria.keywords) data.criteria.keywords = data.criteria.relevance;
          return NextResponse.json(data);
        }
      } catch (aiError) {
        console.warn("OpenAI Failed (Using Fallback):", aiError);
      }
    }

    // 2. LOCAL FALLBACK (Runs if OpenAI Key is missing OR fails)
    console.log("Using Local Logic for:", title);
    return NextResponse.json(calculateLocalScore(title));

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Failed to analyze title" }, { status: 500 });
  }
}

// --- LOCAL FALLBACK ENGINE (Updated to match "Wixor" Style) ---
function calculateLocalScore(title: string) {
  const lower = title.toLowerCase();
  const len = title.length;
  
  // Stricter Criteria for "Wixor" Style
  const fillerWords = ["ultimate", "insane", "crazy", "best", "video", "tutorial"];
  const strongVerbs = ["steal", "fix", "stop", "build", "avoid", "rank", "get"];
  
  const hasFiller = fillerWords.some(w => lower.includes(w));
  const hasStrongVerb = strongVerbs.some(w => lower.includes(w));
  
  // Base Score Calculation
  let score = 50; 
  if (hasStrongVerb) score += 15;
  if (!hasFiller) score += 10;
  if (len >= 35 && len <= 55) score += 15; // Tighter length constraint
  if (title.includes("?") || title.includes("(")) score += 10;
  if (title === title.toUpperCase()) score -= 20; // Penalty for screaming
  
  score = Math.min(95, Math.max(10, score));

  return {
    score,
    criteria: {
      relevance: hasStrongVerb ? 9 : 6,
      clarity: hasFiller ? 5 : 9,
      ctr: hasStrongVerb ? 8 : 5,
      structure: (len >= 35 && len <= 55) ? 9 : 6,
      keywords: 8, // Placeholder for local
      trust: hasFiller ? 4 : 9
    },
    strengths: [
      hasStrongVerb ? "Uses strong, active verbs" : "Clean formatting",
      !hasFiller ? "Avoids generic filler words" : "Good length for visibility"
    ].filter(Boolean),
    weaknesses: [
      hasFiller ? "Contains generic filler ('Ultimate', 'Insane')" : null,
      !hasStrongVerb ? "Lacks a punchy action verb" : null,
      (len > 60) ? "Too long. Cut the fluff." : null
    ].filter(Boolean),
    suggestions: {
      search: `${title} (Guide)`,
      ctr: hasStrongVerb ? title : `Stop Doing This In ${title.split(' ')[0]}`,
      balanced: `How To ${title.split(' ').slice(0,3).join(' ')} Properly`
    }
  };
}