import { createClient } from '@supabase/supabase-js';

// Initialize Supabase for Server Component
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Force dynamic rendering so new submissions appear instantly
export const revalidate = 0;

export default async function Home() {
  // Fetch real channels from Supabase
  const { data: dbChannels } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  // Fallback mock data if DB is empty (so the UI doesn't look broken while you test)
  const channels = dbChannels && dbChannels.length > 0 ? dbChannels : [
    { id: 'mock1', channel_name: '@DesignFlow', goal_text: 'Viewer retention drops at 30s. Need hook advice.', youtube_url: '#' },
    { id: 'mock2', channel_name: '@CodeWithMe', goal_text: 'My CTR is 2%. Are my thumbnails too complex?', youtube_url: '#' },
    { id: 'mock3', channel_name: '@TravelRaw', goal_text: 'Audio mixing feels off on mobile devices.', youtube_url: '#' },
  ];

  return (
    <div className="flex flex-col flex-1">
      
      {/* --- HERO SECTION (Grid Layer 0) --- */}
      <section className="grid grid-cols-12 gap-0 border-b border-border">
        {/* Left: Copy */}
        <div className="col-span-12 lg:col-span-8 p-12 bg-panel shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border-r border-border">
          <h1 className="text-7xl font-black leading-[0.8] tracking-tighter mb-8 uppercase text-white">
            Get real feedback <br />on your YouTube <br />channel.
          </h1>
          <p className="text-gray-400 text-xl max-w-sm border-l-2 border-white pl-4 mb-12 font-medium leading-tight">
            Post your channel. Let creators tell you what actually needs fixing.
          </p>
          <div className="flex gap-4">
            {/* Note: This button triggers the modal via Navbar, or we can link it later */}
            <button className="bg-white text-black font-black px-10 py-5 shadow-tactile hover:-translate-y-1 active:translate-y-0.5 active:shadow-none transition-all uppercase text-sm tracking-widest">
              Post your channel
            </button>
            <button className="border border-border px-10 py-5 font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-colors">
              Browse feedback
            </button>
          </div>
        </div>

        {/* Right: 3D Visual */}
        <div className="col-span-12 lg:col-span-4 p-12 flex items-center justify-center bg-[#080808] overflow-hidden">
          <div className="relative w-48 h-48 border border-white/10 rotate-12 flex items-center justify-center shadow-tactile group">
             <div className="absolute inset-0 border border-white/20 -rotate-12 translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
             <div className="w-8 h-8 bg-white animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
          </div>
        </div>
      </section>


      {/* --- CHANNEL FEED (Dynamic Section) --- */}
      <section className="border-b border-border bg-background p-12 min-h-[400px]">
        {/* Feed Header */}
        <div className="flex justify-between items-end mb-10 border-b border-border pb-4">
          <div>
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">Live Queue</h2>
            <p className="text-3xl font-black uppercase tracking-tighter text-white">Creators awaiting critique</p>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-white animate-pulse"></div>
            <div className="w-2 h-2 border border-white/20"></div>
            <div className="w-2 h-2 border border-white/20"></div>
          </div>
        </div>

        {/* The Grid Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel: any) => (
            <div key={channel.id} className="group flex flex-col justify-between bg-panel border border-border p-8 shadow-tactile hover:-translate-y-1 hover:shadow-[0_12px_0_0_#000] transition-all duration-150 cursor-pointer">
              
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black bg-white text-black px-2 py-0.5 uppercase tracking-widest">
                    Review
                  </span>
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_red]"></div>
                </div>
                
                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-white group-hover:text-gray-300 transition-colors">
                  {channel.channel_name || "Unknown Channel"}
                </h3>
                
                <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">
                  "{channel.goal_text}"
                </p>
              </div>

              <div className="border-t border-border pt-4 mt-auto">
                 <button className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white flex justify-between items-center">
                    Give Feedback <span>→</span>
                 </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* --- HOW IT WORKS (Tactile Steps) --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
        {[
          { step: "01", title: "Submit", desc: "Link your channel and state your improvement goal." },
          { step: "02", title: "Get Feedback", desc: "Creators leave actionable, direct comments." },
          { step: "03", title: "Improve", desc: "Upvote the best advice and iterate faster." }
        ].map((item, idx) => (
          <div key={idx} className={`p-12 ${idx !== 2 ? 'md:border-r border-b md:border-b-0' : ''} border-border bg-background hover:bg-white/5 transition-colors`}>
            <span className="block text-[10px] font-black text-white/20 mb-6 tracking-[0.3em] uppercase border-b border-white/10 pb-2 w-10">{item.step}</span>
            <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-xs">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* --- WHY THIS EXISTS / FOOTER --- */}
      <section className="grid grid-cols-12 gap-0">
        <div className="col-span-12 lg:col-span-6 p-16 border-r border-border bg-panel">
          <p className="text-3xl font-bold leading-tight tracking-tight text-gray-400">
            Analytics tell you <span className="text-white">what’s happening.</span> <br />
            Creators tell you <span className="text-white">why.</span>
          </p>
        </div>
        <div className="col-span-12 lg:col-span-6 p-16 flex flex-col justify-center bg-background">
          <h2 className="text-lg font-black uppercase tracking-tighter mb-4">Critique.</h2>
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-0">Designed for creators.</p>
          <p className="text-gray-600 text-xs uppercase tracking-widest">No AI Slop allowed.</p>
        </div>
      </section>

    </div>
  );
}