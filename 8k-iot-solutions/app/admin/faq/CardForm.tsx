"use client";

import { useState, useEffect } from 'react';
import { createFAQ, updateFAQ } from './actions';
import { PlusCircle, Save, X, HelpCircle, FileText } from 'lucide-react';

export default function CardForm({ editingFAQ, onCancel }: { editingFAQ?: any, onCancel?: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingFAQ) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [editingFAQ]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (isEditing) {
        await updateFAQ(editingFAQ.id, formData);
      } else {
        await createFAQ(formData);
      }
      if (onCancel) onCancel();
      else setIsEditing(false);
      
      // Clear form if not editing
      if (!isEditing) {
        (document.getElementById('faq-form') as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden sticky top-24">
      <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className={`p-2 rounded-lg ${isEditing ? 'bg-brand-50 text-brand-600' : 'bg-zinc-100 text-zinc-500'}`}>
             {isEditing ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
           </div>
           <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider font-poppins">
             {isEditing ? 'Edit FAQ' : 'Add New FAQ'}
           </h3>
        </div>
        {isEditing && (
          <button onClick={onCancel} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form id="faq-form" action={handleSubmit} className="p-6 space-y-5 font-poppins">
        {/* Question */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Question
          </label>
          <input 
            type="text" 
            name="question" 
            defaultValue={editingFAQ?.question || ''}
            required
            placeholder="e.g. Do you offer hardware design?"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm font-medium"
          />
        </div>

        {/* Answer */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Answer
          </label>
          <textarea 
            name="answer" 
            defaultValue={editingFAQ?.answer || ''}
            required
            placeholder="Provide a detailed explanation..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm font-medium resize-none"
          />
        </div>

        {/* Order */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            Order Position
          </label>
          <input 
            type="number" 
            name="order" 
            defaultValue={editingFAQ?.order || 0}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm font-medium"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white rounded-xl font-bold text-sm shadow-lg shadow-zinc-900/10 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {isEditing ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              {isEditing ? 'Update FAQ' : 'Publish Question'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
