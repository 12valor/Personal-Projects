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

  const isVideo = submission.submission_type === 'video' || submission.submission_type === 'video_only';
  const hasBanner = !isVideo && submission.banner_url;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 pb-20 font-poppins">
      
      {/* --- FLOATING BACK BUTTON --- */}
      <div className="fixed top-24 left-6 z-50 hidden xl:block">
        <Link href="/" className="flex items-center justify-center w-10 h-10 bg-white dark:bg-black/50 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-full shadow-sm hover:scale-110 transition-transform text-slate-500 hover:text-indigo-500 dark:text-white">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </Link>
      </div>

      {/* --- HEADER SECTION --- */}
      <div className="relative border-b border-slate-100 dark:border-white/5 pt-24 pb-16 overflow-hidden">
         
         {/* BACKGROUND LOGIC */}
         {hasBanner ? (
            /* Banner Background */
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${submission.banner_url})` }}
              />
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0" /> {/* Dark Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0 opacity-80" />
            </>
         ) : (
            /* Default Gradient Background */
            <>
              <div className="absolute inset-0 bg-slate-50 dark:bg-black/40 z-0" />
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none z-0" />
            </>
         )}
         
         <div className="max-w-5xl mx-auto px-6 relative z-10">
            {/* Mobile Back Link */}
            <Link href="/" className="xl:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500 mb-8 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg> Back to Feed
            </Link>

            {isVideo ? (
              /* --- VIDEO HEADER --- */
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                 <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                       {submission.is_verified && (
                         <span className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">
                           Verified
                         </span>
                       )}
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Video Critique</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
                      {submission.video_title}
                    </h1>

                    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                      {submission.video_url && (
                        <video controls className="w-full h-full" src={submission.video_url} />
                      )}
                    </div>

                    {/* CONTEXT BLOCK (Video) */}
                    <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 md:items-center justify-between">
                       <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Creator Ask:</p>
                          <p className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 italic">"{submission.context_text}"</p>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {submission.problem_categories?.map((cat: string) => (
                            <span key={cat} className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                              {cat}
                            </span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            ) : (
              /* --- CHANNEL HEADER (With Banner Logic Support) --- */
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start animate-in fade-in slide-in-from-left-4 duration-700">
                 
                 {/* AVATAR */}
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

                 {/* INFO */}
                 <div className="flex-1 w-full pt-2">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
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
                       <a href={submission.youtube_url} target="_blank" className="hidden md:flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                          Visit Channel <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                       </a>
                    </div>

                    <p className={`text-lg md:text-xl font-medium italic mb-8 max-w-2xl ${hasBanner ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                       "{submission.goal_text}"
                    </p>

                    {/* CONTEXT & TAGS */}
                    <div className={`border p-6 rounded-2xl ${hasBanner ? 'bg-black/40 border-white/10 backdrop-blur-md' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5'}`}>
                       <div className="mb-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest block mb-2 ${hasBanner ? 'text-indigo-400' : 'text-indigo-500'}`}>Context for Reviewers</span>
                          <p className={`text-sm md:text-base font-medium leading-relaxed ${hasBanner ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                            {submission.context_text}
                          </p>
                       </div>
                       <div className={`flex flex-wrap gap-2 pt-4 border-t ${hasBanner ? 'border-white/10' : 'border-slate-100 dark:border-white/5'}`}>
                          {submission.problem_categories?.map((cat: string) => (
                            <span key={cat} className={`border px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${hasBanner ? 'bg-white/10 border-white/10 text-white' : 'bg-slate-50 dark:bg-white/10 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300'}`}>
                              {cat}
                            </span>
                          ))}
                       </div>
                    </div>
                    
                    {/* Mobile Visit Button */}
                    <a href={submission.youtube_url} target="_blank" className="md:hidden mt-6 flex w-full items-center justify-center gap-2 bg-red-600 text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors">
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
          submissionType={isVideo ? 'video' : 'channel'}
          isLocked={submission.is_locked}
        />
      </div>
    </div>
  );
}