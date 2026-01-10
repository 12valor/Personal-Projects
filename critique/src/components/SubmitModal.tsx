"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmissionType = 'channel_only' | 'video_only' | 'mixed';
type VideoSource = 'file' | 'link';

const CATEGORIES = [
  "Branding", "Views", "Engagement", "Retention", 
  "Thumbnails", "Titles", "Editing", "Monetization", "Strategy"
];

// Simple in-memory cache
interface ChannelCacheData {
  title: string;
  avatar: string;
  banner: string | null;
  subs: string | null;
}

export const SubmitModal = ({ isOpen, onClose }: SubmitModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('channel_only');
  const [videoSource, setVideoSource] = useState<VideoSource>('file');
  
  // Form State
  const [url, setUrl] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [channelName, setChannelName] = useState('');
  const [channelAvatar, setChannelAvatar] = useState<string | null>(null);
  const [isChannelVerified, setIsChannelVerified] = useState(false);
  const [isFetchingChannel, setIsFetchingChannel] = useState(false);

  const [goal, setGoal] = useState('');
  const [context, setContext] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Validation State
  const [errors, setErrors] = useState<{ channel?: string; video?: string }>({});
  const [touched, setTouched] = useState<{ channel?: boolean; video?: boolean }>({});

  // Cache Ref
  const channelCache = useRef<Record<string, ChannelCacheData>>({});

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- API LOGIC ---
  const getYoutubeData = async (channelInput: string) => {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!API_KEY || !channelInput) return null;

      if (channelCache.current[channelInput]) {
        return channelCache.current[channelInput];
      }

      let fetchUrl = '';
      if (channelInput.includes('@')) {
        const handle = channelInput.split('@')[1].split('/')[0].split('?')[0];
        fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings,snippet,statistics&forHandle=${handle}&key=${API_KEY}`;
      } else if (channelInput.includes('channel/')) {
        const id = channelInput.split('channel/')[1].split('/')[0].split('?')[0];
        fetchUrl = `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings,snippet,statistics&id=${id}&key=${API_KEY}`;
      } else {
        return null; 
      }

      const res = await fetch(fetchUrl);
      const data = await res.json();
      const item = data.items?.[0];

      if (!item) return null;

      const count = parseInt(item?.statistics?.subscriberCount);
      const formattedSubs = count 
        ? count >= 1000000 
          ? (count / 1000000).toFixed(1) + 'M' 
          : count >= 1000 
            ? (count / 1000).toFixed(1) + 'K' 
            : count.toString()
        : null;

      const result: ChannelCacheData = {
        title: item?.snippet?.title || '',
        avatar: item?.snippet?.thumbnails?.high?.url || item?.snippet?.thumbnails?.default?.url,
        banner: item?.brandingSettings?.image?.bannerExternalUrl 
          ? `${item.brandingSettings.image.bannerExternalUrl}=w1060-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj` 
          : null,
        subs: formattedSubs
      };

      channelCache.current[channelInput] = result;
      return result;

    } catch (e) {
      console.error("Youtube API Error", e);
      return null;
    }
  };

  // --- VALIDATORS ---
  const validateChannelUrl = (input: string) => {
    if (!input) return "Channel URL is required.";
    let urlObj;
    try {
      urlObj = new URL(input.includes('://') ? input : `https://${input}`);
    } catch {
      return "Invalid URL format.";
    }
    const hostname = urlObj.hostname.replace('www.', '');
    if (!['youtube.com', 'youtu.be'].includes(hostname)) return "Must be a valid YouTube URL.";
    const path = urlObj.pathname;
    if (path.includes('/watch') || path.includes('/shorts/') || path.includes('/embed/')) return "Please use a Channel URL, not a video.";
    
    const validPatterns = [/^\/@[\w\-\.]+$/, /^\/channel\/UC[\w\-]+$/, /^\/c\/[\w\-]+$/, /^\/user\/[\w\-]+$/, /^\/[\w\-]+$/];
    const isValidPath = validPatterns.some(regex => regex.test(path));
    if ((path === '/' || path === '') || !isValidPath) return "Invalid channel link format.";
    
    return null;
  };

  const validateVideoLink = (input: string) => {
    if (!input) return "Video link is required.";
    try {
      new URL(input.includes('://') ? input : `https://${input}`);
      return null;
    } catch {
      return "Please enter a valid URL.";
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    const fetchChannelInfo = async () => {
      if (submissionType === 'video_only' || !url) {
        setIsChannelVerified(false);
        setChannelAvatar(null);
        return;
      }

      if (validateChannelUrl(url)) {
        setIsChannelVerified(false);
        return; 
      }

      setIsFetchingChannel(true);
      
      const timer = setTimeout(async () => {
        const data = await getYoutubeData(url);
        
        if (data) {
          setChannelName(data.title);
          setChannelAvatar(data.avatar);
          setIsChannelVerified(true);
          setErrors(prev => ({ ...prev, channel: undefined }));
        } else {
          setIsChannelVerified(false);
        }
        setIsFetchingChannel(false);
      }, 600); 

      return () => clearTimeout(timer);
    };

    fetchChannelInfo();
  }, [url, submissionType]);

  useEffect(() => {
    const newErrors: { channel?: string; video?: string } = {};

    if (submissionType !== 'video_only' && touched.channel) {
      const err = validateChannelUrl(url);
      if (err) newErrors.channel = err;
    }

    if (submissionType !== 'channel_only' && videoSource === 'link' && touched.video) {
      const err = validateVideoLink(videoLink);
      if (err) newErrors.video = err;
    }

    setErrors(newErrors);
  }, [url, videoLink, submissionType, videoSource, touched]);

  const isStep1Valid = () => {
    let valid = true;
    if (submissionType !== 'video_only') {
      if (!url || validateChannelUrl(url)) valid = false;
      if (!channelName) valid = false;
    }
    if (submissionType !== 'channel_only') {
      if (videoSource === 'file' && !videoFile) valid = false;
      if (videoSource === 'link' && (!videoLink || validateVideoLink(videoLink))) valid = false;
      if (!videoTitle) valid = false;
    }
    return valid;
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(prev => prev.filter(c => c !== cat));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories(prev => [...prev, cat]);
    }
  };

  const handleUploadAndSubmit = async () => {
    if (!context || selectedCategories.length === 0) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let ytData = null;
      if (submissionType !== 'video_only') {
         ytData = channelCache.current[url];
         if (!ytData) ytData = await getYoutubeData(url);
      }

      const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', session.user.id).single();
      const userPfp = profile?.avatar_url || session.user.user_metadata.avatar_url;
      const submissionAvatar = ytData?.avatar || userPfp;

      let finalVideoUrl = null;
      if (submissionType !== 'channel_only') {
        if (videoSource === 'file' && videoFile) {
           const filePath = `${session.user.id}/${Date.now()}.${videoFile.name.split('.').pop()}`;
           await supabase.storage.from('videos').upload(filePath, videoFile);
           const { data: urlData } = supabase.storage.from('videos').getPublicUrl(filePath);
           finalVideoUrl = urlData.publicUrl;
        } else if (videoSource === 'link' && videoLink) {
           finalVideoUrl = videoLink;
        }
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
          banner_url: ytData?.banner || null,
          subscriber_count: ytData?.subs || null,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#090909] border border-zinc-200 dark:border-zinc-800 w-full max-w-xl shadow-2xl relative flex flex-col max-h-[90vh] rounded-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div>
               <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black dark:text-white leading-none">
                 New <span className="text-ytRed">Submission</span>
               </h2>
               <p className="text-xs font-medium text-zinc-500 mt-1">Share your content for professional critique.</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-black dark:hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-xl flex gap-1">
              {['channel_only', 'video_only', 'mixed'].map((type) => (
                <button 
                  key={type}
                  onClick={() => { setSubmissionType(type as SubmissionType); setErrors({}); }}
                  className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 ${submissionType === type ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm scale-[1.02]' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'}`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 pt-2 overflow-y-auto custom-scrollbar">
          {step === 1 ? (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
              
              {/* CHANNEL URL & NAME INPUTS */}
              {submissionType !== 'video_only' && (
                <>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pl-1">Channel Link</label>
                      {/* STATUS INDICATORS */}
                      {isFetchingChannel && (
                        <span className="text-[9px] font-medium text-zinc-400 animate-pulse">Fetching channel details...</span>
                      )}
                      {errors.channel && (
                        <span className="text-[9px] font-medium text-red-500/80">{errors.channel}</span>
                      )}
                    </div>
                    
                    <input 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)} 
                      onBlur={() => setTouched(p => ({ ...p, channel: true }))}
                      placeholder="youtube.com/@handle" 
                      className={`
                        w-full bg-zinc-50 dark:bg-zinc-900/50 text-black dark:text-white border p-4 text-sm font-bold focus:outline-none rounded-xl transition-all
                        ${errors.channel ? 'border-red-500/30 bg-red-50/50 dark:bg-red-900/10' : 'border-zinc-200 dark:border-zinc-800 focus:border-ytRed'}
                      `}
                    />
                  </div>

                  {/* CHANNEL PREVIEW CARD */}
                  <div className="relative pt-2">
                     <div className="flex gap-4 items-start">
                        {/* Avatar */}
                        <div className={`
                          w-12 h-12 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center transition-all duration-500
                          ${channelAvatar ? 'opacity-100' : 'opacity-40'}
                        `}>
                           {channelAvatar ? (
                             <img src={channelAvatar} alt="Channel" className="w-full h-full object-cover animate-in fade-in" />
                           ) : (
                             <svg className="w-5 h-5 text-zinc-300 dark:text-zinc-700" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                           )}
                        </div>

                        {/* Name Input & Verified Status */}
                        <div className="flex-1 space-y-1.5">
                           <input 
                             value={channelName} 
                             onChange={(e) => setChannelName(e.target.value)} 
                             placeholder="Channel Name" 
                             className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-2 px-1 text-sm font-bold text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:border-ytRed transition-colors"
                           />
                           
                           {/* VERIFIED INDICATOR */}
                           <div className={`
                             flex items-center gap-1.5 transition-all duration-300 ease-out overflow-hidden
                             ${isChannelVerified ? 'h-5 opacity-100' : 'h-0 opacity-0'}
                           `}>
                              <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Channel verified</span>
                           </div>
                        </div>
                     </div>
                  </div>
                </>
              )}
              
              {/* VIDEO SUBMISSION SECTION */}
              {submissionType !== 'channel_only' && (
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                   {/* Video Source Toggle */}
                   <div className="flex gap-4 mb-3 px-1">
                      <button onClick={() => setVideoSource('file')} className={`text-[10px] font-black uppercase tracking-wider border-b-2 pb-1 transition-colors ${videoSource === 'file' ? 'border-ytRed text-ytRed' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}>Upload File</button>
                      <button onClick={() => setVideoSource('link')} className={`text-[10px] font-black uppercase tracking-wider border-b-2 pb-1 transition-colors ${videoSource === 'link' ? 'border-ytRed text-ytRed' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}>Video Link</button>
                   </div>

                  {videoSource === 'file' ? (
                    <div className="space-y-1.5">
                      <div className="relative group">
                         <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                         <div className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 ${videoFile ? 'border-ytRed bg-ytRed/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 group-hover:border-zinc-400 dark:group-hover:border-zinc-600'}`}>
                           {videoFile ? (
                             <div className="flex items-center gap-2 text-ytRed">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                               <span className="text-xs font-bold truncate max-w-[200px]">{videoFile.name}</span>
                             </div>
                           ) : (
                             <>
                               <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                 <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                               </div>
                               <span className="text-xs font-bold text-zinc-500">Click to upload or drag video</span>
                             </>
                           )}
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400 pl-1">
                        <span>Video URL</span>
                        {errors.video && <span className="text-red-500">{errors.video}</span>}
                      </label>
                      <input value={videoLink} onChange={(e) => setVideoLink(e.target.value)} onBlur={() => setTouched(p => ({ ...p, video: true }))} placeholder="e.g. youtube.com/watch?v=..." className={`w-full bg-zinc-50 dark:bg-zinc-900/50 text-black dark:text-white border p-4 text-sm font-bold focus:outline-none rounded-xl transition-all ${errors.video ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-ytRed'}`} />
                    </div>
                  )}

                  <div className="space-y-1.5 mt-4">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pl-1">Video Title</label>
                    <input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="e.g. I Spent 50 Hours Buried Alive" className="w-full bg-zinc-50 dark:bg-zinc-900/50 text-black dark:text-white border border-zinc-200 dark:border-zinc-800 p-4 text-sm font-bold focus:border-ytRed focus:ring-1 focus:ring-ytRed/50 focus:outline-none rounded-xl transition-all" />
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setStep(2)} 
                disabled={!isStep1Valid()}
                className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
              >
                Next Step →
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Focus Areas</label>
                   <span className="text-[9px] font-bold text-ytRed uppercase">{selectedCategories.length}/3 Selected</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => toggleCategory(cat)} className={`py-3 px-1 text-[9px] font-black uppercase rounded-lg transition-all duration-200 border ${selectedCategories.includes(cat) ? 'bg-ytRed border-ytRed text-white shadow-md scale-[1.02]' : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pl-1">Primary Goal</label>
                <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Improve viewer retention..." className="w-full bg-zinc-50 dark:bg-zinc-900/50 text-black dark:text-white border border-zinc-200 dark:border-zinc-800 p-4 text-sm font-bold focus:border-ytRed focus:ring-1 focus:ring-ytRed/50 focus:outline-none rounded-xl transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pl-1">Context</label>
                <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="Explain your thought process..." className="w-full bg-zinc-50 dark:bg-zinc-900/50 text-black dark:text-white border border-zinc-200 dark:border-zinc-800 p-4 text-sm font-bold focus:border-ytRed focus:ring-1 focus:ring-ytRed/50 focus:outline-none h-24 resize-none rounded-xl transition-all" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Back</button>
                <button onClick={handleUploadAndSubmit} disabled={loading || selectedCategories.length === 0} className="flex-1 bg-ytRed text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:scale-100">
                  {loading ? 'Publishing...' : 'Submit for Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};