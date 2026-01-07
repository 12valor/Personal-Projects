import { createClient } from '@supabase/supabase-js';
import { CommentSection } from '@/components/CommentSection';
import { ChannelAvatar } from '@/components/ChannelAvatar';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: submission } = await supabase
    .from('submissions')
    .select('*, profiles(full_name, avatar_url)')
    .eq('id', id)
    .single();

  if (!submission) return notFound();

  // --- LOGIC UPDATE: DETERMINE LAYOUT ---
  // Only use the strict "Video Grid" layout if it is explicitly 'video_only'.
  // Everything else ('channel', 'video' aka Combo) uses the "Channel Layout" which supports Banners + Avatars.
  const isStrictVideoLayout = submission.submission_type === 'video_only';
  
  // Allow banners for everything EXCEPT strict video_only
  const hasBanner = !isStrictVideoLayout && submission.banner_url;
  
  // Check if we have a video to show (for the Combo/Channel layout)
  const hasVideoSource = !!submission.video_url;
  
  const displayName = submission.profiles?.full_name || submission.channel_name;

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-slate-900 dark:text-slate-100 pb-20 font-poppins selection:bg-red-500/30">
      
      {/* --- FLOATING BACK BUTTON --- */}
      <div className="fixed top-24 left-6 z-50 hidden xl:block">
        <Link href="/" className="flex items-center justify-center w-12 h-12 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-full shadow-lg hover:scale-110 transition-transform text-slate-400 hover:text-red-600 hover:border-red-600/30">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </Link>
      </div>

      {/* --- HEADER SECTION --- */}
      <div className="relative border-b border-slate-200 dark:border-white/5 pt-24 pb-12 overflow-hidden bg-white dark:bg-[#0a0a0a]">
         
         {/* BACKGROUND LOGIC */}
         {hasBanner ? (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${submission.banner_url})` }}
              />
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-0 opacity-90" />
            </>
         ) : (
            <>
               <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none z-0" />
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
            </>
         )}
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Mobile Back Link */}
            <Link href="/" className="xl:hidden inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-600 mb-8 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg> Back to Feed
            </Link>

            {isStrictVideoLayout ? (
              /* --- VIDEO ONLY HEADER (Grid Layout) --- */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                 <div className="flex flex-col gap-4 mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                       {submission.is_verified && (
                         <span className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                           Verified
                         </span>
                       )}
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded bg-white dark:bg-white/5">
                         Video Critique
                       </span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
                      {submission.video_title}
                    </h1>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: Video Player */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 relative group">
                            {submission.video_url ? (
                                <video controls className="w-full h-full" src={submission.video_url} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">Video Source Unavailable</div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Creator & Context */}
                    <div className="flex flex-col gap-6">
                        {/* 1. CREATOR CARD */}
                        <div className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-white/20 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 dark:border-white/10 shrink-0 shadow-md">
                                   <ChannelAvatar url={submission.profiles?.avatar_url || submission.avatar_url} name={displayName} />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-slate-900 dark:text-white truncate text-lg">
                                        {displayName}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Thread Author
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 2. THE ASK */}
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-white to-slate-50 dark:from-[#151515] dark:to-[#0a0a0a] p-6 group transition-all duration-500 hover:shadow-xl hover:border-red-500/30">
                             <div className="absolute inset-0 bg-[radial-gradient(#FF0032_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] dark:opacity-[0.15] pointer-events-none" />
                             <div className="absolute -right-6 -top-6 text-slate-100 dark:text-white/[0.02] text-9xl font-black italic select-none pointer-events-none font-serif opacity-50">"</div>
                             <div className="relative z-10">
                                 <div className="flex items-center justify-between mb-4">
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 rounded-full bg-[#FF0032] shadow-[0_0_12px_#FF0032] animate-pulse"/>
                                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Director's Note</span>
                                     </div>
                                 </div>
                                 <p className="text-sm md:text-[15px] font-medium text-slate-700 dark:text-slate-200 italic leading-relaxed mb-6 border-l-2 border-red-500/30 pl-4 py-1">
                                    "{submission.context_text}"
                                 </p>
                                 <div className="flex flex-wrap gap-2">
                                   {submission.problem_categories?.map((cat: string) => (
                                     <span key={cat} className="bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm hover:text-red-500 dark:hover:text-red-400 hover:border-red-500/20 transition-colors cursor-default">
                                        {cat}
                                     </span>
                                   ))}
                                 </div>
                             </div>
                        </div>
                    </div>
                 </div>
              </div>
            ) : (
              /* --- CHANNEL / COMBO HEADER (Flex Layout with Banner) --- */
              /* Use this layout if it's a Channel OR a Combo (anything with channel identity) */
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start animate-in fade-in slide-in-from-left-4 duration-700">
                 
                 {/* AVATAR (Floating on Desktop) */}
                 <div className="relative group shrink-0">
                    <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] shadow-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 ${hasBanner ? 'border-white/20' : 'border-white dark:border-[#0a0a0a]'}`}>
                       <ChannelAvatar url={submission.avatar_url} name={submission.channel_name} />
                    </div>
                    {submission.is_verified && (
                       <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1.5 rounded-full border-4 border-white dark:border-[#0a0a0a]" title="Verified Creator">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                       </div>
                    )}
                 </div>

                 {/* INFO COLUMN */}
                 <div className="flex-1 w-full pt-2">
                    
                    {/* Title & Stats */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                       <div>
                          <h1 className={`text-4xl md:text-6xl font-black tracking-tighter mb-2 ${hasBanner ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                             {submission.channel_name}
                          </h1>
                          <div className="flex items-center gap-3">
                             {submission.subscriber_count && (
                               <span className={`font-bold text-xs uppercase tracking-widest ${hasBanner ? 'text-white/80' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                  {submission.subscriber_count} Subscribers
                               </span>
                             )}
                          </div>
                       </div>
                       <a href={submission.youtube_url} target="_blank" className="hidden md:flex items-center gap-2 bg-[#FF0032] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                          Visit Channel <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                       </a>
                    </div>

                    {/* --- COMBO FEATURE: VIDEO PLAYER EMBEDDED IN CHANNEL LAYOUT --- */}
                    {hasVideoSource && (
                      <div className="mb-8 w-full max-w-4xl">
                        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group">
                           <video controls className="w-full h-full" src={submission.video_url} />
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">Featured Critique</span>
                           <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{submission.video_title}</h3>
                        </div>
                      </div>
                    )}

                    {/* Goal Text */}
                    <p className={`text-lg md:text-xl font-medium italic mb-8 max-w-2xl ${hasBanner ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                       "{submission.goal_text}"
                    </p>

                    {/* CONTEXT BOX (CHANNEL) */}
                    <div className={`relative overflow-hidden rounded-2xl border p-6 group ${hasBanner ? 'bg-black/40 border-white/10 backdrop-blur-md' : 'bg-white dark:bg-[#111] border-slate-200 dark:border-white/10'}`}>
                       <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-3 opacity-70">
                             <div className={`w-1.5 h-1.5 rounded-full ${hasBanner ? 'bg-indigo-400' : 'bg-red-500'}`} />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${hasBanner ? 'text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>Review Context</span>
                          </div>
                          <p className={`text-sm md:text-base font-medium leading-relaxed mb-4 ${hasBanner ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                            {submission.context_text}
                          </p>
                          <div className={`flex flex-wrap gap-2 pt-4 border-t ${hasBanner ? 'border-white/10' : 'border-slate-100 dark:border-white/5'}`}>
                             {submission.problem_categories?.map((cat: string) => (
                               <span key={cat} className={`border px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${hasBanner ? 'bg-white/10 border-white/10 text-white' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}>
                                  {cat}
                               </span>
                             ))}
                          </div>
                       </div>
                    </div>
                    
                    {/* Mobile Visit Button */}
                    <a href={submission.youtube_url} target="_blank" className="md:hidden mt-6 flex w-full items-center justify-center gap-2 bg-[#FF0032] text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg">
                       Visit Channel
                    </a>
                 </div>
              </div>
            )}
         </div>
      </div>

      {/* --- COMMENTS SECTION --- */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <CommentSection 
          submissionId={id} 
          submissionType={isStrictVideoLayout ? 'video' : 'channel'}
          isLocked={submission.is_locked}
        />
      </div>
    </div>
  );
}