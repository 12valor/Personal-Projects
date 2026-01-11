"use client";
import { useState, useEffect } from "react";

export default function DecisionLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [type, setType] = useState("Title Change");

  useEffect(() => {
    const saved = localStorage.getItem("creator_decision_log");
    if (saved) setLogs(JSON.parse(saved));
  }, []);

  const addLog = () => {
    if (!input) return;
    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      type,
      note: input,
      impact: "Monitoring"
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem("creator_decision_log", JSON.stringify(updated));
    setInput("");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Decision Log</h2>
        <p className="text-gray-500">Track your experiments and see what works.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-medium outline-none focus:ring-2 focus:ring-black"
        >
          <option>Title Change</option>
          <option>Thumbnail Swap</option>
          <option>New Upload Time</option>
          <option>Format Test</option>
        </select>
        <input 
          type="text" 
          placeholder="Describe experiment..." 
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          onClick={addLog}
          className="bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition"
        >
          Log
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Type</th>
              <th className="p-4">Experiment</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-400">No experiments logged yet.</td></tr>
            ) : logs.map((log) => (
              <tr key={log.id}>
                <td className="p-4 font-mono text-xs text-gray-500">{log.date}</td>
                <td className="p-4 font-bold text-gray-800 text-sm">{log.type}</td>
                <td className="p-4 text-gray-600">{log.note}</td>
                <td className="p-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">{log.impact}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}