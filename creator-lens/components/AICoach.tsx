"use client";

import { useState, useEffect } from "react";

// Define the shape of the props this component accepts
interface AICoachProps {
  prefill?: string;
}

export default function AICoach({ prefill }: AICoachProps) {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LISTENER: If the parent page sends new text (via the 'Analyze' button), update the box.
  useEffect(() => {
    if (prefill) {
      setInputText(prefill);
      // Optional: Clear previous results when a new video is selected
      setAnalysis(""); 
      setError("");
    }
  }, [prefill]);

  const handleAnalyze = async () => {
    // Reset states
    setLoading(true);
    setError("");
    setAnalysis("");

    if (!inputText.trim()) {
      setError("Please enter some content or a topic to analyze.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze content");
      }

      // Set the successful result
      setAnalysis(data.result);
      
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>🤖</span> Content Coach
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Paste your video idea, script, or description below to get AI-powered feedback.
        </p>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="mb-4">
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all font-mono text-sm"
            placeholder="e.g., I want to make a video about the new Roblox update where..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-all flex items-center gap-2 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              "Analyze Content"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span>✨</span> Feedback & Suggestions
              </h3>
              <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                {analysis}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}