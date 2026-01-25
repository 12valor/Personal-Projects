"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ user: "", pass: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username: formData.user, 
        password: formData.pass 
      }),
    });

    if (res.ok) {
      router.push("/admin"); // Redirect to admin on success
      router.refresh();
    } else {
      setError("Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        
        {/* Minimal Header */}
        <div className="mb-8 text-center">
          <div className="w-10 h-10 bg-accent mx-auto mb-4 rounded-sm"></div>
          <h1 className="text-xl font-medium tracking-tight text-foreground">Admin Access</h1>
        </div>

        {/* The Card (Flat, Bordered, No Shadow) */}
        <div className="bg-white border border-gray-200 p-8 rounded-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Username</label>
              <input 
                type="text" 
                required
                value={formData.user}
                onChange={(e) => setFormData({...formData, user: e.target.value})}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
              <input 
                type="password" 
                required
                value={formData.pass}
                onChange={(e) => setFormData({...formData, pass: e.target.value})}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-xs text-red-600 font-medium text-center bg-red-50 py-2 rounded-sm border border-red-100">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-foreground text-white py-2.5 text-sm font-medium rounded-sm hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Enter Workspace"}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-xs text-gray-400">
          <a href="/" className="hover:text-foreground transition-colors">← Back to Portfolio</a>
        </p>

      </div>
    </div>
  );
}