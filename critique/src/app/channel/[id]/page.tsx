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
    .select('*')
    .eq('id', id)
    .single();

  if (!submission) return notFound();

  const isVideo = submission.submission_type === 'video';

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* HEADER / PLAYER SECTION */}
      <div className="bg-panel border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-12">
          
          <Link href="/" className="inline-block text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-ytRed mb-6 transition-colors">
            ← Back to Feed
          </Link>

          {isVideo ? (
            /* --- VIDEO LAYOUT --- */
            <div className="animate-in fade-in duration-500">
               {/* Video Title & Meta */}
               <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-foreground">
                    {submission.video_title}
                  </h1>
                  {submission.is_verified && (
                    <div className="flex items-center gap-1 bg-background border border-border px-2 py-1 rounded-full" title="Verified Creator">
                      <div className="w-3 h-3 bg-ytRed rounded-full flex items-center justify-center text-white text-[8px] font-bold">✓</div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Verified</span>
                    </div>
                  )}
               </div>

               {/* Video Player */}
               <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-border mb-8">
                  <video 
                    controls 
                    className="w-full h-full" 
                    src={submission.video_url} 
                    poster="https://via.placeholder.com/1280x720/111/333?text=Video+Loading"
                  />
               </div>

               {/* Context Box (Below Video) */}
               {submission.context_text && (
                 <div className="bg-background/50 border-l-4 border-ytRed p-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-6 h-6 rounded-full overflow-hidden">
                          <ChannelAvatar url={submission.avatar_url} name={submission.channel_name} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-ytRed">
                         Creator Asks:
                       </span>
                    </div>
                    <p className="text-foreground font-bold text-sm">{submission.context_text}</p>
                 </div>
               )}
            </div>
          ) : (
            /* --- CHANNEL LAYOUT (Original) --- */
            <div className="flex flex-col md:flex-row gap-8 items-start animate-in slide-in-from-left-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-border p-1 bg-background flex-shrink-0">
                 <ChannelAvatar url={submission.avatar_url} name={submission.channel_name} />
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
                    {submission.channel_name}
                  </h1>
                  {submission.is_verified && (
                    <div className="flex items-center gap-1 bg-background border border-border px-2 py-1 rounded-full" title="Verified Creator">
                      <div className="w-4 h-4 bg-ytRed rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Verified</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-400 font-medium text-lg mb-6 line-clamp-2">"{submission.goal_text}"</p>

                {submission.context_text && (
                   <div className="bg-background/50 border-l-4 border-ytRed p-4 max-w-2xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-ytRed block mb-1">
                        Asking For Feedback On:
                      </span>
                      <p className="text-foreground font-bold text-sm md:text-base">{submission.context_text}</p>
                   </div>
                )}

                <div className="mt-8 flex gap-4">
                   <a href={submission.youtube_url} target="_blank" className="bg-ytRed text-white px-6 py-3 font-black text-xs uppercase tracking-widest shadow-yt-glow hover:-translate-y-1 transition-transform flex items-center gap-2">
                     Visit Channel <span>→</span>
                   </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COMMENTS */}
      <CommentSection 
        submissionId={id} 
        submissionType={isVideo ? 'video' : 'channel'} 
      />
    </div>
  );
}