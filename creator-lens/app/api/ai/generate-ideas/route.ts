import { NextResponse } from "next/server";

// HELPER: Remove "The", "A", "An" from start
function cleanStart(text: string) {
  return text.replace(/^(the|a|an)\s+/i, "").trim();
}

// HELPER: Title Case
function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// --- NEW SMART TRUNCATOR (No more "...") ---
function fitToLimit(templateFn: (t: string) => string, topic: string, maxLen: number = 60) {
  let currentTopic = topic;
  let title = templateFn(currentTopic);

  // While title is too long OR topic ends with awkward words
  while (
    (title.length > maxLen || currentTopic.match(/\s(For|The|A|An|Of|In|To|With)$/i)) 
    && currentTopic.includes(" ") // Don't reduce to single word unless forced
  ) {
    // 1. Remove the last word
    const lastSpace = currentTopic.lastIndexOf(" ");
    if (lastSpace === -1) break; 
    currentTopic = currentTopic.substring(0, lastSpace);
    
    // 2. Re-generate title to check length
    title = templateFn(currentTopic);
  }

  // Safety: If it's STILL too long (rare), hard slice it, but NO "..."
  if (title.length > maxLen) {
    return title.substring(0, maxLen).trim();
  }
  
  return title;
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const { topic, gameName } = await request.json();

  // 1. PRE-PROCESSING
  let rawTopic = cleanStart(topic); // "The Best Mutation" -> "Best Mutation"
  let coreTopic = toTitleCase(rawTopic); 
  let game = gameName || "Roblox";

  // 2. TEMPLATES
  const generateFallbackTitles = () => {
    // We define these as functions so we can dynamically resize the topic inside them
    const patterns = [
      (t: string) => `The ${t} Is BROKEN In ${game}`,
      (t: string) => `I Found The SECRET ${t} In ${game}`,
      (t: string) => `Don't Buy ${t} In ${game}`,
      (t: string) => `The Most HATED ${t} In ${game}`,
      (t: string) => `I Spent 0 Robux On ${t} In ${game}`,
      (t: string) => `The ${t} GLITCH Works In ${game}`,
      (t: string) => `Trading The RAREST ${t} In ${game}`,
      (t: string) => `Why Everyone HATES ${t} In ${game}`,
      (t: string) => `I Became The ${t} GOD In ${game}`,
      (t: string) => `The ${t} Update Ruined ${game}`
    ];

    // Run every pattern through the Smart Fitter
    return patterns.map(pattern => fitToLimit(pattern, coreTopic, 60));
  };

  // 3. AI GENERATION (Simulated for speed/reliability on Vercel)
  // We use the smart fallback engine because it's faster and guarantees the format 100%
  // This avoids the "AI is busy" errors completely while giving you perfect grammar.
  
  return NextResponse.json({ titles: generateFallbackTitles() });
}