import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, script } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // --- 1. INTELLIGENT TAG GENERATION ---
    
    // Combine text sources (Title has higher weight)
    const combinedText = `${title} ${title} ${title} ${script || ""}`.toLowerCase();
    
    // Clean text: Remove special chars, extra spaces
    const cleanText = combinedText.replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
    
    // Filter Stop Words (Common words to ignore)
    const stopWords = new Set([
      "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
      "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", 
      "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "video", "youtube", "channel"
    ]);

    // Count word frequency
    const wordMap: Record<string, number> = {};
    cleanText.split(" ").forEach(word => {
      if (word.length > 2 && !stopWords.has(word)) {
        wordMap[word] = (wordMap[word] || 0) + 1;
      }
    });

    // Sort by frequency to find "Power Topics"
    const sortedKeywords = Object.entries(wordMap)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);

    // Select Tags: Mix of specific (top keywords) and broad
    const specificTags = sortedKeywords.slice(0, 8);
    
    // Generate Long-tail Tags based on Title
    const longTailTags = [
      title.toLowerCase(),
      `${sortedKeywords[0]} tutorial`,
      `${sortedKeywords[0]} guide`,
      `best ${sortedKeywords[0]}`,
    ];

    const finalTags = Array.from(new Set([...specificTags, ...longTailTags])).slice(0, 15);

    // --- 2. DESCRIPTION GENERATION ---

    // Identify primary topic from top keyword
    const topic = sortedKeywords[0] ? sortedKeywords[0].charAt(0).toUpperCase() + sortedKeywords[0].slice(1) : "this topic";
    
    // Construct a high-retention description template
    const hook = `In this video, we dive deep into **${title}** and explore everything you need to know about ${topic}.`;
    
    const body = script 
      ? `We'll break down the key concepts including ${sortedKeywords.slice(1, 4).join(", ")}, so you can get a complete understanding without the fluff.` 
      : `Whether you're a beginner or looking to refine your skills, this video covers the essential steps to master ${topic}.`;

    const cta = `🚀 **Don't forget to Subscribe** for more content on ${topic}!\n\n👇 **Drop a comment below** if you have any questions!`;

    const finalDescription = `${hook}\n\n${body}\n\n${cta}`;

    return NextResponse.json({
      description: finalDescription,
      tags: finalTags
    });

  } catch (error: any) {
    console.error("Metadata Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate metadata" }, { status: 500 });
  }
}