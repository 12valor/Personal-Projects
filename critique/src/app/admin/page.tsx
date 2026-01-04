"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    // 1. If not logged in, kick to home
    if (!session) {
      router.push('/');
      return;
    }

    // 2. If logged in, check if they are ADMIN
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      router.push('/'); // Kick unauthorized users
      return;
    }

    // 3. If Admin, load data
    fetchContent();
  };

  const fetchContent = async () => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    setSubmissions(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this submission?")) return;
    
    // RLS Policy allows admins to delete
    const { error } = await supabase.from('submissions').delete().eq('id', id);
    if (!error) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } else {
      alert("Error deleting. Ensure you are an Admin in the 'profiles' table.");
    }
  };

  if (loading) return <div className="p-20 text-center font-mono text-gray-500 text-xs uppercase tracking-widest">Verifying Privileges...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-border pb-6">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Moderation <span className="text-ytRed">Panel</span>
          </h1>
          <span className="text-xs font-mono text-gray-500 border border-gray-800 px-2 py-1">ADMIN_MODE_ACTIVE</span>
        </div>

        {/* Minimalist Data Table */}
        <div className="bg-panel border border-border shadow-tactile">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-black/20 text-xs font-black uppercase tracking-widest text-gray-500">
            <div className="col-span-3">Channel</div>
            <div className="col-span-5">Goal / Context</div>
            <div className="col-span-2 text-center">Date</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {submissions.map((sub) => (
            <div key={sub.id} className="grid grid-cols-12 gap-4 p-4 border-b border-border items-center hover:bg-white/5 transition-colors text-sm">
              <div className="col-span-3 font-bold text-foreground truncate">{sub.channel_name}</div>
              <div className="col-span-5 text-gray-400 truncate pr-4">"{sub.goal_text}"</div>
              <div className="col-span-2 text-center text-xs text-gray-600 font-mono">
                {new Date(sub.created_at).toLocaleDateString()}
              </div>
              <div className="col-span-2 text-right">
                <button 
                  onClick={() => handleDelete(sub.id)}
                  className="text-ytRed font-black text-[10px] uppercase tracking-widest border border-ytRed/30 px-3 py-2 hover:bg-ytRed hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          {submissions.length === 0 && (
            <div className="p-8 text-center text-gray-500 font-mono text-xs">NO SUBMISSIONS FOUND</div>
          )}
        </div>
      </div>
    </div>
  );
}