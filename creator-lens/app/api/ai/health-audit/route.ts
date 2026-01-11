import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const { metrics, recentTitles } = await request.json();

  // --- 1. DEFINE SIMULATION FALLBACK ---
  // If the API fails, we return this realistic "Mock Data" so your app still works.
  const fallbackResponse = {
    diagnosis: "Channel health is stable but growth velocity has plateaued.",
    prescription: [
      "Increase upload frequency to twice a week to boost consistency score.",
      "Reply to comments within 1 hour to trigger the engagement algorithm."
    ],
    prognosis: "Without intervention, views will likely remain flat for the next 30 days.",
    isSimulation: true // Flag to let you know it's fake
  };

  if (!apiKey) {
    console.warn("⚠️ No API Key found. Using Simulation Mode.");
    return NextResponse.json(fallbackResponse);
  }

  try {
    const systemPrompt = `
      You are a YouTube Channel Analyst.
      Patient Vitals:
      - Health Score: ${metrics.totalScore}/100
      - Consistency: ${metrics.consistencyScore}/100
      - Engagement: ${metrics.engagementScore}/100
      - Velocity: ${metrics.velocityScore}/100
      
      Recent Videos: ${recentTitles?.join(", ") || "No recent videos"}
      
      Task: Return a JSON object with this exact structure (no nesting):
      {
        "diagnosis": "One specific sentence summary of the channel's problem.",
        "prescription": ["Specific Action 1", "Specific Action 2"],
        "prognosis": "One sentence prediction if they don't change."
      }
    `;

    // --- 2. TRY REAL AI (Multiple Models) ---
    const modelsToTry = ["gemini-1.5-flash", "gemini-pro"];
    
    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
        
        if (response.ok && data.candidates) {
           const rawText = data.candidates[0].content.parts[0].text;
           const parsed = JSON.parse(rawText);
           
           // Return REAL data
           return NextResponse.json({
             diagnosis: parsed.diagnosis || parsed.Diagnosis,
             prescription: parsed.prescription || parsed.Prescription,
             prognosis: parsed.prognosis || parsed.Prognosis,
             isSimulation: false
           });
        }
      } catch (e) {
        console.warn(`Attempt with ${model} failed.`);
      }
    }

    // --- 3. IF ALL FAIL, USE SIMULATION ---
    console.error("❌ All AI models failed. Switching to Simulation Mode.");
    return NextResponse.json(fallbackResponse);

  } catch (error: any) {
    // Final safety net
    return NextResponse.json(fallbackResponse);
  }
}