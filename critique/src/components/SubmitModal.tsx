"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmissionType = 'channel_only' | 'video_only' | 'mixed';

const CATEGORIES = [
  "Branding", "Views", "Engagement", "Retention", 
  "Thumbnails", "Titles", "Editing", "Monetization", "Strategy"
];

export const SubmitModal = ({ isOpen, onClose }: SubmitModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('channel_only');
  
  const [url, setUrl] = useState('');
  const [channelName, setChannelName] = useState('');
  const [goal, setGoal] = useState('');
  const [context, setContext] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories(prev => [...prev, cat]);
    }
  };

  // --- FETCH YOUTUBE DATA (PFP + BANNER + SUBS) ---
  const getYoutubeData = async (channelUrl: string) => {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!API_KEY || !channelUrl) return null;

      let fetchUrl = '';
      // part=statistics added to get sub count
      if (channelUrl.includes('@')) {
        const handle = channelUrl.split('@')[1].split('/')[0].split('?')[0];
        fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings,snippet,statistics&forHandle=${handle}&key=${API_KEY}`;
      } else if (channelUrl.includes('channel/')) {
        const id = channelUrl.split('channel/')[1].split('/')[0].split('?')[0];
        fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings,snippet,statistics&id=${id}&key=${API_KEY}`;
      }

      if (!fetchUrl) return null;

      const res = await fetch(fetchUrl);
      const data = await res.json();
      const item = data.items?.[0];

      // Format subscriber count (e.g., 1500 -> 1.5K)
      const count = parseInt(item?.statistics?.subscriberCount);
      const formattedSubs = count 
        ? count >= 1000000 
          ? (count / 1000000).toFixed(1) + 'M' 
          : count >= 1000 
            ? (count / 1000).toFixed(1) + 'K' 
            : count.toString()
        : null;

      return {
        channelPfp: item?.snippet?.thumbnails?.high?.url || item?.snippet?.thumbnails?.default?.url,
        bannerUrl: item?.brandingSettings?.image?.bannerExternalUrl 
          ? `${item.brandingSettings.image.bannerExternalUrl}=w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj` 
          : null,
        subCount: formattedSubs
      };
    } catch (e) {
      console.error("Youtube API Error", e);
      return null;
    }
  };

  const handleUploadAndSubmit = async () => {
    if (!context || selectedCategories.length === 0) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [profileRes, ytData] = await Promise.all([
        supabase.from('profiles').select('avatar_url').eq('id', session.user.id).single(),
        submissionType !== 'video_only' ? getYoutubeData(url) : Promise.resolve(null)
      ]);

      const userPfp = profileRes.data?.avatar_url || session.user.user_metadata.avatar_url;
      const submissionAvatar = ytData?.channelPfp || userPfp;

      let finalVideoUrl = null;
      if ((submissionType === 'video_only' || submissionType === 'mixed') && videoFile) {
        const filePath = `${session.user.id}/${Date.now()}.${videoFile.name.split('.').pop()}`;
        await supabase.storage.from('videos').upload(filePath, videoFile);
        const { data: urlData } = supabase.storage.from('videos').getPublicUrl(filePath);
        finalVideoUrl = urlData.publicUrl;
      }

      const { data, error: dbError } = await supabase
        .from('submissions')
        .insert([{ 
          submission_type: submissionType,
          youtube_url: submissionType === 'video_only' ? null : url, 
          channel_name: submissionType === 'video_only' ? (session.user.user_metadata.full_name || "Creator") : channelName,
          goal_text: goal || "General Feedback",
          video_url: finalVideoUrl,
          video_title: videoTitle,
          context_text: context,
          user_id: session.user.id,
          avatar_url: submissionAvatar,
          banner_url: ytData?.bannerUrl,
          subscriber_count: ytData?.subCount, // <--- SAVING SUBS
          problem_categories: selectedCategories,
          is_verified: true,
          verification_status: 'approved'
        }])
        .select().single();

      if (dbError) throw dbError;
      onClose();
      router.push(`/channel/${data.id}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-panel border border-border w-full max-w-xl shadow-2xl relative flex flex-col max-h-[90vh] rounded-lg overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">New <span className="text-ytRed">Post</span></h2>
            <button onClick={onClose} className="text-gray-500 hover:text-foreground text-xl font-bold">×</button>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-background border border-border p-1 rounded-lg">
             {['channel_only', 'video_only', 'mixed'].map((type) => (
               <button 
                 key={type}
                 onClick={() => setSubmissionType(type as SubmissionType)}
                 className={`py-3 text-[10px] font-black uppercase tracking-widest rounded transition-all ${submissionType === type ? 'bg-foreground text-background' : 'text-gray-500 hover:text-foreground'}`}
               >
                 {type.replace('_', ' ')}
               </button>
             ))}
          </div>
        </div>

        <div className="p-8 pt-0 overflow-y-auto text-foreground">
          {step === 1 ? (
            <div className="space-y-6">
              {submissionType !== 'video_only' && (
                <>
                  <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Channel URL (@handle or full link)" className="w-full bg-background border border-border p-4 font-bold focus:border-ytRed focus:outline-none rounded" />
                  <input value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="Channel Name" className="w-full bg-background border border-border p-4 font-bold focus:border-ytRed focus:outline-none rounded" />
                </>
              )}
              {submissionType !== 'channel_only' && (
                <>
                  <div className="border border-border p-4 rounded bg-background">
                    <label className="text-[10px] font-black uppercase text-gray-500 block mb-2">Upload Video</label>
                    <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="w-full text-xs font-black file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-black file:bg-ytRed file:text-white cursor-pointer" />
                  </div>
                  <input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Video Title" className="w-full bg-background border border-border p-4 font-bold focus:border-ytRed focus:outline-none rounded" />
                </>
              )}
              <button onClick={() => setStep(2)} className="w-full bg-foreground text-background font-black py-4 uppercase tracking-widest hover:bg-ytRed hover:text-white transition-colors rounded">Next Step →</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-ytRed block mb-3">Target Problems (Select up to 3)</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => toggleCategory(cat)} className={`py-2 text-[9px] font-black uppercase border rounded transition-all ${selectedCategories.includes(cat) ? 'bg-ytRed border-ytRed text-white shadow-yt-glow' : 'bg-background border-border text-gray-500'}`}>{cat}</button>
                  ))}
                </div>
              </div>
              <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Main Goal (e.g. Higher retention)" className="w-full bg-background border border-border p-4 font-bold focus:border-ytRed focus:outline-none rounded" />
              <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="Context for the reviewer..." className="w-full bg-background border border-border p-4 font-bold focus:border-ytRed focus:outline-none h-24 resize-none rounded" />
              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(1)} className="text-xs font-bold text-gray-500 hover:text-foreground">← Back</button>
                <button onClick={handleUploadAndSubmit} disabled={loading || selectedCategories.length === 0} className="bg-ytRed text-white font-black px-10 py-4 uppercase tracking-widest shadow-yt-glow disabled:opacity-50 rounded">{loading ? 'Posting...' : 'Finish Post'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};