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

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* --- HEADER SECTION (Clean Version) --- */}
      <div className="bg-panel border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-12">
          
          {/* BACK TO FEED: Restored to original placement */}
          <Link href="/" className="inline-block text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-ytRed mb-10 transition-colors">
            ← Back to Feed
          </Link>

          {isVideo ? (
            /* --- VIDEO LAYOUT --- */
            <div className="animate-in fade-in duration-500">
               <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground">
                    {submission.video_title}
                  </h1>
                  
                  {submission.is_verified && (
                    <div className="flex items-center gap-1 bg-background border border-border px-2 py-1 rounded-full">
                      <div className="w-3 h-3 bg-ytRed rounded-full flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Verified</span>
                    </div>
                  )}
               </div>

               <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-border mb-8">
                  {submission.video_url && (
                    <video controls className="w-full h-full" src={submission.video_url} />
                  )}
               </div>
            </div>
          ) : (
            /* --- CHANNEL LAYOUT (Restored Spacing) --- */
            <div className="flex flex-col md:flex-row gap-8 items-start animate-in slide-in-from-left-4">
              
              {/* THE PFP CIRCLE: Forced circularity */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-border p-1 bg-background flex-shrink-0 aspect-square overflow-hidden shadow-sm">
                 <div className="w-full h-full rounded-full overflow-hidden">
                    <ChannelAvatar url={submission.avatar_url} name={submission.channel_name} />
                 </div>
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight">
                    {submission.channel_name}
                  </h1>
                  {submission.is_verified && (
                    <div className="flex items-center gap-1 bg-background border border-border px-2 py-1 rounded-full">
                      <div className="w-4 h-4 bg-ytRed rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verified</span>
                    </div>
                  )}
                </div>

                {submission.subscriber_count && (
                  <p className="text-ytRed font-black text-[11px] uppercase tracking-widest mb-4">
                    {submission.subscriber_count} Subscribers
                  </p>
                )}

                <p className="text-gray-400 font-medium text-lg mb-8 italic">"{submission.goal_text}"</p>

                {/* CREATOR INQUIRY BOX */}
                {submission.context_text && (
                   <div className="bg-background/50 border-l-4 border-ytRed p-5 max-w-2xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-ytRed block mb-2">Asking For Feedback On:</span>
                      <p className="text-foreground font-bold text-sm md:text-base leading-relaxed">{submission.context_text}</p>
                   </div>
                )}

                {/* SIDEBAR TAGS & BUTTON */}
                <div className="mt-8 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex flex-wrap gap-2">
                    {submission.problem_categories?.map((cat: string) => (
                      <span key={cat} className="bg-ytRed/5 border border-ytRed/10 text-ytRed text-[9px] font-black uppercase px-3 py-1.5 rounded-sm">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <a href={submission.youtube_url} target="_blank" className="bg-ytRed text-white px-8 py-3.5 font-black text-xs uppercase tracking-widest shadow-yt-glow hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                    Visit Channel <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COMMENTS SECTION */}
      <div className="max-w-5xl mx-auto px-6 mt-12">
        <CommentSection 
          submissionId={id} 
          submissionType={isVideo ? 'video' : 'channel'}
          isLocked={submission.is_locked}
        />
      </div>
    </div>
  );
}