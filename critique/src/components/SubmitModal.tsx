"use client";
import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmissionType = 'channel_only' | 'video_only' | 'mixed';

export const SubmitModal = ({ isOpen, onClose }: SubmitModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('channel_only');
  
  // Form Data
  const [url, setUrl] = useState('');
  const [channelName, setChannelName] = useState('');
  const [goal, setGoal] = useState('');
  const [context, setContext] = useState('');
  
  // Video Data
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUploadAndSubmit = async () => {
    if (!context) return;
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let finalVideoUrl = null;

    try {
      // 1. Upload Video if type is video_only or mixed
      if ((submissionType === 'video_only' || submissionType === 'mixed') && videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const cleanName = `${Date.now()}.${fileExt}`;
        const filePath = `${session.user.id}/${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(filePath, videoFile);

        if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`);
        
        const { data: urlData } = supabase.storage.from('videos').getPublicUrl(filePath);
        finalVideoUrl = urlData.publicUrl;
      }

      // 2. Prepare Data
      // For video_only, we might not have a channel name, so we use the User's name or a placeholder
      const effectiveChannelName = (submissionType === 'video_only') 
        ? (session.user.user_metadata.full_name || "Creator") 
        : channelName;

      // 3. Insert to DB
      const { data, error: dbError } = await supabase
        .from('submissions')
        .insert([
          { 
            submission_type: submissionType,
            
            // Channel Fields (Null for video_only)
            youtube_url: submissionType === 'video_only' ? null : url, 
            channel_name: effectiveChannelName,
            goal_text: goal || "Video Feedback",
            
            // Video Fields
            video_url: finalVideoUrl,
            video_title: videoTitle,
            
            // Shared
            context_text: context,
            user_id: session.user.id,
            avatar_url: session.user.user_metadata.avatar_url,
            is_verified: true
          }
        ])
        .select()
        .single();

      if (dbError) throw new Error(`Database Error: ${dbError.message}`);

      if (data) {
        onClose();
        router.push(`/channel/${data.id}`);
      }

    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-panel border border-border w-full max-w-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 pb-0 flex-shrink-0">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
              New <span className="text-ytRed">Post</span>
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-foreground text-xl font-bold">×</button>
          </div>

          {/* 3-Way Type Selector */}
          <div className="grid grid-cols-3 gap-1 bg-background border border-border p-1 rounded-lg mb-6">
             <button 
               onClick={() => setSubmissionType('channel_only')}
               className={`py-3 text-[10px] font-black uppercase tracking-widest transition-colors rounded flex flex-col items-center gap-1 ${submissionType === 'channel_only' ? 'bg-foreground text-background shadow-sm' : 'text-gray-500 hover:text-foreground'}`}
             >
               <span>📺</span> Channel Only
             </button>
             <button 
               onClick={() => setSubmissionType('video_only')}
               className={`py-3 text-[10px] font-black uppercase tracking-widest transition-colors rounded flex flex-col items-center gap-1 ${submissionType === 'video_only' ? 'bg-foreground text-background shadow-sm' : 'text-gray-500 hover:text-foreground'}`}
             >
               <span>🎬</span> Video Only
             </button>
             <button 
               onClick={() => setSubmissionType('mixed')}
               className={`py-3 text-[10px] font-black uppercase tracking-widest transition-colors rounded flex flex-col items-center gap-1 ${submissionType === 'mixed' ? 'bg-foreground text-background shadow-sm' : 'text-gray-500 hover:text-foreground'}`}
             >
               <span>📺+🎬</span> Channel + Video
             </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-8 pt-0 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              {/* Channel Fields (Hidden for Video Only) */}
              {submissionType !== 'video_only' && (
                <>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Channel Link</label>
                    <input 
                      autoFocus
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full bg-background border border-border p-4 font-bold text-foreground focus:border-ytRed focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Channel Name</label>
                    <input 
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="e.g. MrBeast"
                      className="w-full bg-background border border-border p-4 font-bold text-foreground focus:border-ytRed focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Video Fields (Hidden for Channel Only) */}
              {submissionType !== 'channel_only' && (
                <>
                  <div className={submissionType === 'mixed' ? 'pt-4 border-t border-border' : ''}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Upload Video (MP4)</label>
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="w-full bg-background border border-border p-4 font-medium text-sm text-foreground focus:border-ytRed focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-ytRed file:text-white hover:file:bg-red-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Video Title</label>
                    <input 
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="e.g. My New Vlog Intro"
                      className="w-full bg-background border border-border p-4 font-bold text-foreground focus:border-ytRed focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => {
                    // Validation Logic
                    if (submissionType === 'channel_only' && (!url || !channelName)) return;
                    if (submissionType === 'video_only' && (!videoFile || !videoTitle)) return;
                    if (submissionType === 'mixed' && (!url || !channelName || !videoFile || !videoTitle)) return;
                    setStep(2);
                  }}
                  className="bg-foreground text-background font-black px-8 py-3 uppercase tracking-widest hover:bg-ytRed hover:text-white transition-colors"
                >
                  Next Step →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              {/* Context Field (Always Show) */}
              <div>
                <div className="flex justify-between mb-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-ytRed block">
                     What specific feedback do you need?
                   </label>
                   <span className={`text-[10px] font-bold ${context.length > 120 ? 'text-red-500' : 'text-gray-500'}`}>
                     {context.length}/120
                   </span>
                </div>
                <input 
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  maxLength={120}
                  placeholder="e.g. Is the pacing too slow at 2:00?"
                  className="w-full bg-background border border-border p-4 font-bold text-foreground focus:border-ytRed focus:outline-none placeholder:font-normal"
                />
              </div>

              {/* Goal Field (Hide for Video Only) */}
              {submissionType !== 'video_only' && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Channel Goal</label>
                  <textarea 
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Hit 100k subs..."
                    className="w-full bg-background border border-border p-4 font-medium text-sm text-foreground focus:border-ytRed focus:outline-none resize-none h-20"
                  />
                </div>
              )}

              <div className="flex justify-between pt-4 items-center">
                <button 
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-gray-500 hover:text-foreground uppercase tracking-widest"
                >
                  ← Back
                </button>
                <button 
                  onClick={handleUploadAndSubmit}
                  disabled={loading || !context}
                  className="bg-ytRed text-white font-black px-8 py-3 uppercase tracking-widest shadow-yt-glow hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? 'Submitting...' : 'Post for Feedback'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};