import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // FIX: Use the stable alias 'gemini-1.5-flash'
    // If this still fails, try 'gemini-pro' as a fallback
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analyze this YouTube content idea/script and provide constructive feedback to improve it for better engagement and retention. 
    
    Content: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();

    return NextResponse.json({ result: output });

  } catch (error: any) {
    console.error("SERVER CRASHED:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed." },
      { status: 500 }
    );
  }
}