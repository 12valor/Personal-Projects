"use client";
import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Icons ---
const Icons = {
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  X: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Calendar: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Eye: () => <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
};

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

    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    const { data: subData } = await supabase.from('submissions').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    const { data: commentData } = await supabase.from('comments').select('*, submissions(id, channel_name, video_title)').eq('user_id', session.user.id).order('created_at', { ascending: false });

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
    await supabase.from('profiles').update({ full_name: formData.full_name, bio: formData.bio }).eq('id', profile.id);
    setProfile({ ...profile, ...formData });
    setIsEditing(false);
    setSaving(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploadingImage(true);
      const file = event.target.files[0];
      const filePath = `${profile.id}-${Math.random()}.${file.name.split('.').pop()}`;
      await supabase.storage.from('avatars').upload(filePath, file);
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      setProfile({ ...profile, avatar_url: publicUrl });
    } catch (error: any) {
      alert("Error uploading image: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteSubmission = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from('submissions').delete().eq('id', id);
    if (!error) setSubmissions(prev => prev.filter(sub => sub.id !== id));
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#050505]"><div className="w-6 h-6 border-2 border-ytRed border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 font-poppins pb-20 transition-colors duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white dark:bg-[#0A0A0A] border-b border-zinc-200 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-6 pt-32 pb-10"> {/* pt-32 clears navbar */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* Avatar Anchor */}
            <div className="relative group shrink-0">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#fafafa] dark:border-[#050505] shadow-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 relative">
                 <img 
                   src={profile?.avatar_url || "https://ui-avatars.com/api/?background=random"} 
                   className={`w-full h-full object-cover transition-all duration-300 ${uploadingImage ? 'opacity-50 blur-sm' : ''}`}
                   alt="Profile"
                 />
                 {uploadingImage && <div className="absolute inset-0 flex items-center justify-center"><div className="w-6 h-6 border-2 border-ytRed border-t-transparent rounded-full animate-spin"></div></div>}
                 
                 {!uploadingImage && !isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="text-[9px] font-black uppercase text-white tracking-widest">Change</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                 )}
               </div>
            </div>

            {/* Profile Meta */}
            <div className="flex-1 w-full min-w-0">
              {!isEditing ? (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-black dark:text-white">
                          {profile?.full_name || "Creator"}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500 mb-4">
                           <span className="flex items-center gap-1.5">
                             <Icons.Calendar /> Joined {new Date(profile?.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                           </span>
                           {profile?.role === 'admin' && <span className="text-ytRed font-black uppercase text-[9px] bg-ytRed/5 px-2 py-0.5 rounded border border-ytRed/20">Admin</span>}
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-lg mb-6">
                          {profile?.bio || "No bio added yet."}
                        </p>

                        {/* --- NEW: STATS ROW --- */}
                        <div className="flex items-center gap-8">
                          <div className="flex flex-col">
                            <span className="text-2xl font-black text-black dark:text-white leading-none tracking-tight">
                              {submissions.length}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                              Posts
                            </span>
                          </div>
                          
                          {/* Vertical Divider */}
                          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800"></div>

                          <div className="flex flex-col">
                            <span className="text-2xl font-black text-black dark:text-white leading-none tracking-tight">
                              {comments.length}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
                              Critiques
                            </span>
                          </div>
                        </div>

                      </div>

                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-3 rounded-full border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-xs font-black uppercase tracking-widest transition-all hover:scale-105"
                      >
                        Edit Profile
                      </button>
                    </div>
                </div>
              ) : (
                // EDIT MODE
                <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 max-w-2xl">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xs font-black uppercase tracking-widest text-ytRed">Update Details</h3>
                     <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-black dark:hover:text-white"><Icons.X /></button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400 mb-1.5 block">Display Name</label>
                      <input 
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-3 text-sm font-bold focus:border-ytRed focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400 mb-1.5 block">Bio</label>
                      <textarea 
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={3}
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl p-3 text-sm font-medium focus:border-ytRed focus:outline-none resize-none transition-colors"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleSave} disabled={saving} className="bg-ytRed text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button onClick={() => setIsEditing(false)} className="border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-black dark:hover:text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
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

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Modern Tabs */}
        <div className="flex gap-8 border-b border-zinc-200 dark:border-white/5 mb-8">
          <button onClick={() => setActiveTab('channels')} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'channels' ? 'text-ytRed' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
            My Channels
            {activeTab === 'channels' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ytRed rounded-t-full"></div>}
          </button>
          <button onClick={() => setActiveTab('critiques')} className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'critiques' ? 'text-ytRed' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}>
            My Critiques
            {activeTab === 'critiques' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ytRed rounded-t-full"></div>}
          </button>
        </div>

        {/* Tab: Channels */}
        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {submissions.length === 0 ? (
               <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-3xl bg-white/50 dark:bg-white/[0.02]">
                 <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-4">No content yet</p>
                 <Link href="/" className="text-ytRed hover:underline font-bold text-sm">Post your first channel</Link>
               </div>
            ) : (
              submissions.map((sub) => (
                <div key={sub.id} className="group relative bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden hover:shadow-xl hover:border-ytRed/30 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                   {/* Card Cover (Avatar or Banner) - Aspect Ratio Controlled */}
                   <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-900 relative overflow-hidden border-b border-zinc-100 dark:border-white/5">
                      <img src={sub.banner_url || sub.avatar_url || "https://ui-avatars.com/api/?background=random"} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="Cover" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm text-white backdrop-blur-md ${sub.submission_type?.includes('video') ? 'bg-blue-600/90' : 'bg-purple-600/90'}`}>
                           {sub.submission_type?.includes('video') ? 'Video' : 'Channel'}
                        </span>
                        {sub.is_locked && <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm bg-black/80 text-white flex items-center gap-1 backdrop-blur-md">Locked</span>}
                      </div>
                   </div>

                   {/* Card Body */}
                   <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-black text-base text-zinc-900 dark:text-white line-clamp-1 group-hover:text-ytRed transition-colors">
                           {sub.video_title || sub.channel_name}
                         </h3>
                      </div>
                      
                      <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 mb-3 block">
                        {new Date(sub.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-6 flex-1 leading-relaxed">
                        {sub.context_text || sub.goal_text}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5">
                        <Link href={`/channel/${sub.id}`} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-ytRed transition-colors">
                           <Icons.Eye /> View Post
                        </Link>
                        
                        <button 
                          onClick={(e) => handleDeleteSubmission(e, sub.id)}
                          className="text-zinc-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-500/10 rounded-full"
                          title="Delete"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Critiques */}
        {activeTab === 'critiques' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            {comments.length === 0 ? (
               <div className="py-24 text-center border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-3xl bg-white/50 dark:bg-white/[0.02]">
                 <p className="text-zinc-400 text-xs font-black uppercase tracking-widest">No critiques yet</p>
               </div>
            ) : (
              comments.map((comment) => (
                <Link href={`/channel/${comment.submissions?.id}`} key={comment.id} className="block group">
                  <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/5 p-6 rounded-2xl hover:border-ytRed/30 transition-all shadow-sm hover:shadow-md hover:-translate-x-1">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          Critique on: <span className="text-zinc-900 dark:text-white group-hover:text-ytRed transition-colors ml-1">{comment.submissions?.video_title || comment.submissions?.channel_name || "Unknown"}</span>
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 italic line-clamp-2 pl-4 border-l-2 border-zinc-200 dark:border-zinc-700 group-hover:border-ytRed transition-colors">
                      "{comment.content}"
                    </p>
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