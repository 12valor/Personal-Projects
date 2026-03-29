"use client";

import { useState, useRef, useEffect } from 'react';
import { createHeroCard, updateHeroCard } from './actions';
import { X } from 'lucide-react';

interface CardFormProps {
  editingCard?: any;
  onCancel?: () => void;
}

export default function CardForm({ editingCard, onCancel }: CardFormProps) {
  const [type, setType] = useState('client_project');
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (editingCard) {
      setType(editingCard.type);
    } else {
      setType('client_project');
    }
  }, [editingCard]);

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    try {
      let res;
      if (editingCard) {
        res = await updateHeroCard(editingCard.id, formData);
      } else {
        res = await createHeroCard(formData);
      }

      if (res?.success) {
        formRef.current?.reset();
        if (onCancel) onCancel();
      } else if (res?.error) {
         alert(res.error);
      }
    } catch (e) {
      alert("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-zinc-900 font-poppins">
          {editingCard ? 'Edit Card' : 'Add New Card'}
        </h3>
        {editingCard && (
          <button 
            onClick={onCancel}
            className="p-1 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        )}
      </div>
      
      <form 
        key={editingCard?.id || 'new'} 
        ref={formRef} 
        action={handleSubmit} 
        className="space-y-5 font-poppins"
      >
        {editingCard && (
          <input type="hidden" name="oldImageUrl" value={editingCard.imageUrl || ''} />
        )}
        
        {/* We keep the type hidden or read-only if we want to force client_project, 
            but for now we just remove the option from UI while keeping 'type' in form data */}
        <input type="hidden" name="type" value="client_project" />

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Client / Project Title
          </label>
          <input 
            type="text" 
            name="content" 
            defaultValue={editingCard?.content || ''}
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none bg-zinc-50 focus:bg-white" 
            required 
            placeholder="e.g. GreenHouse IoT" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Short Description (Role)
          </label>
          <input 
            type="text" 
            name="label" 
            defaultValue={editingCard?.label || ''}
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none bg-zinc-50 focus:bg-white" 
            placeholder="Hardware Prototyping" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Display Image</label>
          {editingCard?.imageUrl && !isUploading && (
            <div className="mb-2 relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-200">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={editingCard.imageUrl} alt="Current" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 <span className="text-[10px] text-white font-bold">Replace</span>
               </div>
            </div>
          )}
          <label className="mt-1 flex flex-col items-center justify-center px-6 pt-8 pb-8 border-2 border-zinc-200 border-dashed rounded-xl hover:border-brand-400 hover:bg-brand-50/10 transition-all cursor-pointer relative bg-zinc-50 group">
            <div className="space-y-2 text-center">
              <div className="bg-brand-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                 <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="flex flex-col text-sm text-zinc-600">
                <span className="font-bold text-brand-600">
                  {editingCard ? 'Change Photo' : 'Click to upload photo'}
                </span>
                <p className="text-xs text-zinc-500 mt-1">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>
            <input 
              name="imageFile" 
              type="file" 
              required={!editingCard} 
              className="hidden" 
              accept="image/*" 
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Display Priority Order</label>
          <input 
            type="number" 
            name="order" 
            defaultValue={editingCard?.order ?? 0} 
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none bg-zinc-50 focus:bg-white" 
          />
          <p className="text-[10px] text-zinc-400 mt-1 italic">Lower numbers appear first in the scrolling track.</p>
        </div>

        <div className="flex gap-3 pt-4">
          {editingCard && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-4 rounded-xl text-sm font-bold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-all"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            disabled={isUploading}
            className={`flex-[2] bg-brand-600 text-white px-4 py-4 rounded-xl text-sm font-bold transition-all hover:bg-brand-700 active:scale-[0.98] shadow-md shadow-brand-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isUploading ? (
               <>
                 <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></span>
                 {editingCard ? 'Updating...' : 'Creating...'}
               </>
            ) : editingCard ? 'Update Hero Card' : 'Save Hero Card'}
          </button>
        </div>
      </form>
    </div>
  );
}
