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
    // We join 'submissions' so we can link back to the channel they critiqued
    const { data: commentData } = await supabase
      .from('comments')
      .select('*, submissions(id, channel_name)')
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

  if (loading) return <div className="p-20 text-center font-mono text-xs uppercase tracking-widest text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-panel border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-border p-1 bg-background flex-shrink-0 relative group">
               <img 
                 src={profile?.avatar_url || "https://ui-avatars.com/api/?background=random"} 
                 className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
               />
               <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-ytRed/50 transition-colors"></div>
            </div>

            {/* Info / Edit Form */}
            <div className="flex-1 w-full">
              {!isEditing ? (
                // VIEW MODE
                <div>
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
                   
                   {/* Mini Stats */}
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
                // EDIT MODE
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
                      <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-ytRed text-white text-xs font-black uppercase tracking-widest px-6 py-3 hover:shadow-yt-glow transition-all"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="border border-border text-gray-400 text-xs font-black uppercase tracking-widest px-6 py-3 hover:text-white transition-colors"
                      >
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
          <button 
            onClick={() => setActiveTab('channels')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'channels' ? 'text-ytRed border-b-2 border-ytRed' : 'text-gray-500 hover:text-white'}`}
          >
            My Channels
          </button>
          <button 
            onClick={() => setActiveTab('critiques')}
            className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'critiques' ? 'text-ytRed border-b-2 border-ytRed' : 'text-gray-500 hover:text-white'}`}
          >
            My Critiques
          </button>
        </div>

        {/* TAB CONTENT: CHANNELS */}
        {activeTab === 'channels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {submissions.length === 0 ? (
               <div className="col-span-full py-12 text-center border border-dashed border-border text-gray-600 text-sm">
                 You haven't posted any channels yet.
               </div>
            ) : (
              submissions.map((sub) => (
                <Link href={`/channel/${sub.id}`} key={sub.id} className="block group">
                  <div className="bg-panel border border-border p-5 hover:border-ytRed/50 transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-black text-lg text-foreground group-hover:text-ytRed truncate pr-4">{sub.channel_name}</h3>
                      <span className="text-[10px] font-mono text-gray-500">{new Date(sub.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">"{sub.goal_text}"</p>
                    <div className="mt-4 pt-3 border-t border-border flex justify-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">View Feedback →</span>
                    </div>
                  </div>
                </Link>
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
                         On: <span className="text-white group-hover:text-ytRed transition-colors">{comment.submissions?.channel_name || "Unknown Channel"}</span>
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