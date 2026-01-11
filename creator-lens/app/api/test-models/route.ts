import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "No API Key found" });
  }

  try {
    // We hit the REST API directly to see what your key has access to
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const data = await response.json();

    // If Google returns an error object
    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    // Filter to show only "generateContent" capable models (the ones you can use)
    const chatModels = data.models
      ?.filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
      .map((m: any) => m.name.replace("models/", ""));

    return NextResponse.json({ 
      message: "SUCCESS: Here are the valid model names for your key:",
      valid_models: chatModels 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}