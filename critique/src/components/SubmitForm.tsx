export const SubmitForm = () => {
  return (
    <div className="max-w-xl mx-auto border border-border bg-panel shadow-tactile p-8">
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b border-border pb-4">
        Submit Channel
      </h2>
      <form className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">YouTube Channel URL</label>
          <input 
            type="text" 
            placeholder="youtube.com/@yourchannel"
            className="w-full bg-background border border-border p-4 text-sm font-medium focus:outline-none focus:border-white transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Improvement Goal</label>
          <textarea 
            placeholder="e.g. Need help with viewer retention in the first 30 seconds."
            rows={4}
            className="w-full bg-background border border-border p-4 text-sm font-medium focus:outline-none focus:border-white transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] resize-none"
          />
        </div>
        <button className="w-full bg-white text-black font-black py-4 shadow-tactile active:translate-y-1 active:shadow-none transition-all uppercase tracking-[0.2em] text-xs">
          Submit for Review
        </button>
      </form>
    </div>
  );
};