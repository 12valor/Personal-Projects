export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* HERO SECTION */}
      <section className="grid grid-cols-12 gap-0 border-b border-border">
        <div className="col-span-12 lg:col-span-8 p-12 bg-panel shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border-r border-border">
          <h1 className="text-7xl font-black leading-[0.8] tracking-tighter mb-8 uppercase">
            Get real feedback <br />on your YouTube <br />channel.
          </h1>
          <p className="text-gray-400 text-xl max-w-sm border-l-2 border-white pl-4 mb-12 font-medium leading-tight">
            Post your channel. Let creators tell you what actually needs fixing.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-black font-black px-10 py-5 shadow-tactile hover:-translate-y-1 active:translate-y-0.5 active:shadow-none transition-all uppercase text-sm tracking-widest">
              Post your channel
            </button>
            <button className="border border-border px-10 py-5 font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-colors">
              Browse feedback
            </button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 p-12 flex items-center justify-center bg-[#080808]">
          <div className="relative w-48 h-48 border border-white/10 rotate-12 flex items-center justify-center shadow-tactile">
             <div className="absolute inset-0 border border-white/20 -rotate-12 translate-x-4 translate-y-4"></div>
             <div className="w-8 h-8 bg-white animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
        {[
          { step: "01", title: "Submit", desc: "Link your channel and state your improvement goal." },
          { step: "02", title: "Get Feedback", desc: "Creators leave actionable, direct comments." },
          { step: "03", title: "Improve", desc: "Upvote the best advice and iterate faster." }
        ].map((item, idx) => (
          <div key={idx} className={`p-10 ${idx !== 2 ? 'md:border-r border-b md:border-b-0' : ''} border-border bg-background`}>
            <span className="block text-[10px] font-black text-white/30 mb-4 tracking-[0.3em] uppercase">{item.step}</span>
            <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-snug font-medium">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* EXAMPLE FEEDBACK PREVIEW */}
      <section className="p-12 bg-panel border-b border-border">
        <h2 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] mb-8 text-center">Realistic Feedback Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-6 bg-background border border-border shadow-tactile transform -rotate-1">
            <p className="text-[10px] font-bold text-white/30 mb-2 uppercase">@DesignLogic</p>
            <p className="text-sm font-semibold">"Your thumbnails are too cluttered. Use one focal point and increase contrast on the text."</p>
          </div>
          <div className="p-6 bg-background border border-border shadow-tactile transform translate-x-4 rotate-1">
            <p className="text-[10px] font-bold text-white/30 mb-2 uppercase">@CodeFast</p>
            <p className="text-sm font-semibold">"Your intro is 45 seconds long. Start the actual content at the 5-second mark to keep viewers."</p>
          </div>
        </div>
      </section>
    </div>
  );
}