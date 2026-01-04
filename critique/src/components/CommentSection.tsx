"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// The "Pill" categories requested
const FEEDBACK_TAGS = ["Hook", "Editing", "Audio", "Pacing", "Thumbnail", "Content"];

interface Comment {
  id: string;
  author_name: string;
  content: string;
  tags: string[];
  parent_id: string | null;
  created_at: string;
  replies?: Comment[]; // Helper for UI nesting
}

export const CommentSection = ({ submissionId }: { submissionId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [submissionId]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true });

    if (data) {
      // Organize flat data into threads (Top Level -> Replies)
      const threads: Comment[] = [];
      const replyMap = new Map();

      data.forEach((c) => {
        if (!c.parent_id) {
          c.replies = [];
          threads.push(c);
        } else {
          if (!replyMap.has(c.parent_id)) replyMap.set(c.parent_id, []);
          replyMap.get(c.parent_id).push(c);
        }
      });

      // Attach replies to parents
      threads.forEach(t => {
        if (replyMap.has(t.id)) t.replies = replyMap.get(t.id);
      });

      setComments(threads.reverse()); // Newest threads top
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 2) setSelectedTags([...selectedTags, tag]);
    }
  };

  const postComment = async (parentId: string | null = null) => {
    const content = parentId ? replyText : newComment;
    const tags = parentId ? [] : selectedTags; // Only top-level gets tags
    
    if (!content.trim()) return;

    const { error } = await supabase.from('comments').insert([{
      submission_id: submissionId,
      parent_id: parentId,
      author_name: "Anonymous Creator", // Replace with auth user later
      content: content,
      tags: tags
    }]);

    if (!error) {
      setNewComment("");
      setReplyText("");
      setSelectedTags([]);
      setReplyingTo(null);
      fetchComments();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-10">
      
      {/* --- MAIN INPUT (YouTube Studio Style) --- */}
      <div className="bg-panel border border-border p-6 shadow-tactile mb-12 relative group focus-within:border-ytRed/50 transition-colors">
        <label className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 block">
          Critique this Channel
        </label>
        
        {/* Tag Selector pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FEEDBACK_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all
                ${selectedTags.includes(tag) 
                  ? 'bg-ytRed border-ytRed text-white shadow-yt-glow' 
                  : 'bg-background border-border text-gray-500 hover:border-gray-400'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Give actionable feedback..."
          className="w-full bg-transparent text-foreground placeholder:text-gray-700 font-medium text-sm focus:outline-none min-h-[80px] resize-none"
        />
        
        <div className="flex justify-end pt-4 border-t border-border mt-2">
          <button 
            onClick={() => postComment(null)}
            disabled={!newComment.trim()}
            className="bg-foreground text-background font-black px-6 py-2 text-xs uppercase tracking-widest hover:bg-ytRed hover:text-white transition-colors disabled:opacity-50"
          >
            Post Critique
          </button>
        </div>
      </div>

      {/* --- THREADED FEED --- */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="relative animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* PARENT COMMENT */}
            <div className="relative z-10">
              {/* Tags Display */}
              <div className="flex gap-2 mb-2">
                {comment.tags?.map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-ytRed border border-ytRed/20 px-1.5 py-0.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Author & Content */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-border flex-shrink-0"></div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-foreground">{comment.author_name}</span>
                    <span className="text-xs text-gray-600">2h ago</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  
                  {/* Reply Action */}
                  <button 
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 hover:text-ytRed transition-colors flex items-center gap-1"
                  >
                    <span className="text-lg leading-none">↳</span> Reply
                  </button>
                </div>
              </div>
            </div>

            {/* NESTED REPLIES (X-Style Threading) */}
            <div className="ml-4 pl-4 border-l-2 border-border mt-3 space-y-4 relative">
              
              {/* Render Existing Replies */}
              {comment.replies?.map(reply => (
                <div key={reply.id} className="flex gap-4 relative group">
                  {/* Subtle horizontal connector */}
                  <div className="absolute -left-[18px] top-4 w-3 h-[2px] bg-border group-hover:bg-ytRed/50 transition-colors"></div>
                  
                  <div className="w-6 h-6 rounded-full bg-border flex-shrink-0"></div>
                  <div>
                    <span className="text-xs font-bold text-foreground">{reply.author_name}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{reply.content}</p>
                  </div>
                </div>
              ))}

              {/* Inline Reply Input */}
              {replyingTo === comment.id && (
                <div className="mt-4 animate-in zoom-in-95 duration-200">
                   <div className="flex gap-3">
                     <div className="absolute -left-[18px] top-6 w-3 h-[2px] bg-ytRed"></div>
                     <textarea
                        autoFocus
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 bg-panel border border-border p-3 text-sm focus:border-ytRed focus:outline-none min-h-[60px]"
                     />
                   </div>
                   <div className="flex justify-end mt-2">
                      <button 
                        onClick={() => postComment(comment.id)}
                        className="text-[10px] font-black bg-ytRed text-white px-4 py-2 uppercase tracking-widest"
                      >
                        Reply
                      </button>
                   </div>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};