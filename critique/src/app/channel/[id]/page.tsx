import { createClient } from '@supabase/supabase-js';
import { ChannelAvatar } from '@/components/ChannelAvatar';
import { CommentSection } from '@/components/CommentSection';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const revalidate = 0;

export default async function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params for Next.js 15+ compatibility
  const { id } = await params;

  // Fetch specific submission
  const { data: channel, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !channel) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- CHANNEL HEADER (Context) --- */}
      <section className="bg-panel border-b border-border pt-24 pb-12 px-8 relative overflow-hidden">
        {/* Back Button */}
        <Link href="/" className="absolute top-8 left-8 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-ytRed transition-colors">
          ← Back to Feed
        </Link>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start relative z-10">
          
          {/* Large Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-border p-1 bg-background flex-shrink-0 shadow-tactile">
             <div className="w-full h-full rounded-full overflow-hidden relative">
                {/* Reusing your existing Avatar component */}
                <ChannelAvatar url={channel.avatar_url} name={channel.channel_name} />
             </div>
          </div>

          <div className="flex-1">
             <div className="flex items-center gap-3 mb-4">
               <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground italic">
                 {channel.channel_name}
               </h1>
               <a 
                 href={channel.youtube_url} 
                 target="_blank" 
                 className="w-8 h-8 bg-ytRed rounded flex items-center justify-center hover:-translate-y-1 transition-transform shadow-yt-glow"
               >
                 {/* YouTube Icon */}
                 <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
               </a>
             </div>

             <div className="bg-background/50 border-l-4 border-ytRed pl-6 py-4 max-w-2xl backdrop-blur-sm rounded-r-lg">
                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Current Focus</p>
                <p className="text-xl font-medium text-foreground italic">"{channel.goal_text}"</p>
             </div>
          </div>
        </div>
      </section>

      {/* --- FEEDBACK SECTION --- */}
      <section className="bg-background flex-1 px-4 pb-20">
         {/* This renders the comments logic you built in Step 2 */}
         <CommentSection submissionId={channel.id} />
      </section>

    </div>
  );
}