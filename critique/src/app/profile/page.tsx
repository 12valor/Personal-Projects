"use client";
import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'channels' | 'critiques'>('channels');

  const [profile, setProfile] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  const [formData, setFormData] = useState({ full_name: '', bio: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/');
      return;
    }

    // 1. Get Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // 2. Get User's Channels
    const { data: subData } = await supabase
      .from('submissions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    // 3. Get User's Critiques (Comments)
    const { data: commentData } = await supabase
      .from('comments')
      .select('*, submissions(id, channel_name, video_title)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    setProfile(profileData);
    setSubmissions(subData || []);
    setComments(commentData || []);
    setFormData({
      full_name: profileData?.full_name || session.user.user_metadata.full_name || '',
      bio: profileData?.bio || '',
    });
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from('profiles')
      .update({ full_name: formData.full_name, bio: formData.bio })
      .eq('id', profile.id);
    
    setProfile({ ...profile, ...formData });
    setIsEditing(false);
    setSaving(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploadingImage(true);

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (dbError) throw dbError;

      setProfile({ ...profile, avatar_url: publicUrl });
      alert("Profile picture updated!");

    } catch (error: any) {
      console.error(error);
      alert("Error uploading image: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteSubmission = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    e.stopPropagation();

    const confirmed = window.confirm("Are you sure you want to delete this post? This cannot be undone.");
    if (!confirmed) return;

    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
    }
  };

  if (loading) return <div className="p-20 text-center font-mono text-xs uppercase tracking-widest text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-panel border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar */}
            <div className="relative group w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
               <div className="w-full h-full rounded-full border-2 border-border p-1 bg-background overflow-hidden relative shadow-lg">
                 <img 
                   src={profile?.avatar_url || "https://ui-avatars.com/api/?background=random"} 
                   className={`w-full h-full rounded-full object-cover transition-all duration-300 ${uploadingImage ? 'opacity-50 blur-sm' : 'group-hover:opacity-75'}`}
                 />
                 {uploadingImage && (
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-6 h-6 border-2 border-ytRed border-t-transparent rounded-full animate-spin"></div>
                   </div>
                 )}
               </div>

               {!uploadingImage && (
                 <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Change</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                 </label>
               )}
            </div>

            <div className="flex-1 w-full">
              {!isEditing ? (
                <div className="animate-in fade-in slide-in-from-left-2">
                   <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-2">
                          {profile?.full_name || "Anonymous Creator"}
                        </h1>
                        <p className="text-gray-400 font-medium max-w-xl text-sm leading-relaxed">
                          {profile?.bio || "No bio set yet."}
                        </p>
                      </div>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-[10px] font-black uppercase tracking-widest border border-border px-4 py-2 hover:bg-white hover:text-black transition-colors"
                      >
                        Edit Profile
                      </button>
                   </div>
                   
                   <div className="flex gap-8 mt-8 border-t border-border pt-6">
                      <div>
                        <span className="block text-2xl font-black text-ytRed">{submissions.length}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Channels</span>
                      </div>
                      <div>
                        <span className="block text-2xl font-black text-ytRed">{comments.length}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Critiques</span>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="bg-background border border-border p-6 max-w-2xl animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-ytRed mb-4">Update Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Display Name</label>
                      <input 
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="w-full bg-panel border border-border p-3 text-sm font-bold focus:border-ytRed focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Bio</label>
                      <textarea 
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={3}
                        className="w-full bg-panel border border-border p-3 text-sm focus:border-ytRed focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleSave} disabled={saving} className="bg-ytRed text-white text-xs font-black uppercase tracking-widest px-6 py-3 hover:shadow-yt-glow transition-all">
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button onClick={() => setIsEditing(false)} className="border border-border text-gray-400 text-xs font-black uppercase tracking-widest px-6 py-3 hover:text-white transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT TABS --- */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex gap-8 border-b border-border mb-8">
          <button onClick={() => setActiveTab('channels')} className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'channels' ? 'text-ytRed border-b-2 border-ytRed' : 'text-gray-500 hover:text-white'}`}>
            My Channels
          </button>
          <button onClick={() => setActiveTab('critiques')} className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'critiques' ? 'text-ytRed border-b-2 border-ytRed' : 'text-gray-500 hover:text-white'}`}>
            My Critiques
          </button>
        </div>

        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {submissions.length === 0 ? (
               <div className="col-span-full py-12 text-center border border-dashed border-border text-gray-600 text-sm">
                 You haven't posted any channels yet.
               </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="relative group/card">
                  <Link href={`/channel/${sub.id}`} className="block">
                    <div className="bg-panel border border-border p-6 hover:border-ytRed/50 transition-all hover:-translate-y-1 overflow-hidden shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-12">
                          <h3 className="font-black text-xl text-foreground group-hover:text-ytRed truncate">
                            {sub.video_title || sub.channel_name}
                          </h3>
                          <div className="flex gap-2 mt-2">
                            <span className="text-[10px] font-bold uppercase text-gray-500 bg-background border border-border px-2 py-1 rounded">
                              {sub.submission_type?.includes('video') ? '🎬 Video' : '📺 Channel'}
                            </span>
                            {sub.is_locked && <span className="text-[9px] font-black uppercase text-red-500 bg-red-900/20 px-2 py-1 rounded border border-red-900">Locked</span>}
                            {sub.is_hidden && <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">Hidden</span>}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 shrink-0">{new Date(sub.created_at).toLocaleDateString()}</span>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-2 italic mb-4">"{sub.context_text || sub.goal_text}"</p>
                      
                      <div className="mt-auto pt-4 border-t border-border flex justify-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                          View Feedback →
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* HIGH-VISIBILITY DELETE BUTTON */}
                  <div className="absolute top-4 right-4 z-30 opacity-0 group-hover/card:opacity-100 transition-all translate-x-2 group-hover/card:translate-x-0">
                    <button 
                      onClick={(e) => handleDeleteSubmission(e, sub.id)}
                      className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 hover:scale-110 active:scale-95 transition-all"
                      title="Delete Submission"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB CONTENT: CRITIQUES */}
        {activeTab === 'critiques' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {comments.length === 0 ? (
               <div className="py-12 text-center border border-dashed border-border text-gray-600 text-sm">
                 You haven't critiqued anyone yet.
               </div>
            ) : (
              comments.map((comment) => (
                <Link href={`/channel/${comment.submissions?.id}`} key={comment.id} className="block group">
                  <div className="bg-panel border border-border p-5 hover:border-gray-500 transition-colors relative pl-6">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-border group-hover:bg-ytRed transition-colors"></div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                         On: <span className="text-white group-hover:text-ytRed transition-colors">{comment.submissions?.video_title || comment.submissions?.channel_name || "Unknown"}</span>
                       </span>
                       <span className="text-[10px] font-mono text-gray-600">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-300 italic">"{comment.content}"</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}