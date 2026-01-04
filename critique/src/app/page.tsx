import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { SubmissionCard } from '@/components/SubmissionCard';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 0;

export default async function Home({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const currentFilter = filter || 'all';

  // Fetch submissions with profile info and comment counts
  let query = supabase
    .from('submissions')
    .select(`
      *,
      profiles (full_name, avatar_url),
      comments (count)
    `)
    .or('is_hidden.eq.false,is_hidden.is.null')
    .order('created_at', { ascending: false });

  if (currentFilter === 'channel_only') {
    query = query.in('submission_type', ['channel_only', 'channel']);
  }
  if (currentFilter === 'video_only') {
    query = query.in('submission_type', ['video_only', 'video']);
  }
  if (currentFilter === 'mixed') {
    query = query.eq('submission_type', 'mixed');
  }

  const { data: channels } = await query;

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full border-b border-border bg-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#80808033_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          <div className="flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10 lg:border-r border-border/50">
            <div className="inline-block mb-6">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-ytRed border border-ytRed/30 px-3 py-1 rounded bg-ytRed/5">
                Community Beta
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter uppercase italic text-foreground mb-6 leading-[0.9]">
              Critique. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ytRed to-red-600">Improve.</span> <br />
              Grow.
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-md mb-10 leading-relaxed">
              The honest feedback loop for creators. Post your channel, get timestamped critiques, and fix your retention graph.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-ytRed text-white font-black px-10 py-4 shadow-yt-glow hover:-translate-y-1 transition-all uppercase text-sm tracking-widest">
                Start Reviewing
              </button>
              <button className="border border-border bg-background text-foreground px-10 py-4 font-bold text-sm uppercase tracking-widest hover:bg-panel transition-colors">
                Browse Channels
              </button>
            </div>
          </div>
          <div className="bg-panel/50 relative flex items-center justify-center p-12 lg:p-0 overflow-hidden">
             <div className="w-full max-w-lg aspect-video bg-black rounded-lg border border-border shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                   <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                   </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800">
                   <div className="h-full w-[65%] bg-ytRed relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-ytRed rounded-full shadow border border-white transform scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                   </div>
                </div>
                <div className="absolute top-8 right-8 max-w-[200px] bg-background/90 backdrop-blur border border-border p-4 rounded shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-ytRed"></div>
                      <span className="text-[10px] font-bold text-foreground">Editor_Phil</span>
                   </div>
                   <p className="text-xs font-medium text-gray-500 leading-tight">
                     "The hook is weak here. You need to cut the first 5 seconds."
                   </p>
                </div>
             </div>
             <div className="absolute inset-0 bg-ytRed/5 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* --- LIVE FEED --- */}
      <section className="bg-background border-b border-border p-6 md:p-12 min-h-screen">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-4 border-b border-border gap-4">
            <div>
              <h2 className="text-xs font-black text-ytRed uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-ytRed rounded-full animate-pulse"></span>
                Live Activity
              </h2>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground">
                Recent Submissions
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
               {[
                 { id: 'all', label: 'All', icon: '' },
                 { id: 'mixed', label: 'Combo', icon: '📺+🎬' },
                 { id: 'channel_only', label: 'Channel', icon: '📺' },
                 { id: 'video_only', label: 'Video', icon: '🎬' },
               ].map((f) => (
                 <Link 
                   key={f.id}
                   href={f.id === 'all' ? '/' : `/?filter=${f.id}`}
                   className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded transition-all flex items-center gap-2
                     ${currentFilter === f.id 
                       ? 'bg-foreground text-background border-foreground' 
                       : 'bg-background border-border text-gray-500 hover:border-gray-400 hover:text-foreground'}
                   `}
                 >
                   {f.icon && <span>{f.icon}</span>}
                   {f.label}
                 </Link>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {!channels || channels.length === 0 ? (
               <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-border">
                 No active submissions found.
               </div>
            ) : (
              channels.map((channel: any) => (
                <SubmissionCard key={channel.id} channel={channel} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="bg-panel border-b border-border">
         <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3">
          {[
            { step: "01", title: "Upload Link", desc: "Paste your URL. No signup walls." },
            { step: "02", title: "Get Roasted", desc: "Honest feedback from real creators." },
            { step: "03", title: "Go Viral", desc: "Fix the drop-offs. Improve CTR." }
          ].map((item, i) => (
            <div key={i} className={`p-16 border-b md:border-b-0 ${i !== 2 ? 'md:border-r' : ''} border-border hover:bg-background transition-colors group`}>
              <div className="w-12 h-12 mb-6 rounded-full border-2 border-border flex items-center justify-center text-lg font-black text-gray-400 group-hover:border-ytRed group-hover:text-ytRed transition-all">
                {item.step}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic text-foreground">{item.title}</h3>
              <p className="text-sm font-medium text-gray-500 group-hover:text-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}