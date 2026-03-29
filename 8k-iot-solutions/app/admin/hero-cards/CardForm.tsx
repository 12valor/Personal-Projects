"use client";

import { useState, useRef } from 'react';
import { createHeroCard } from './actions';

export default function CardForm() {
  const [type, setType] = useState('metric');
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    try {
      const res = await createHeroCard(formData);
      if (res?.success) {
        formRef.current?.reset();
        setType('metric');
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
      <h3 className="text-lg font-medium text-zinc-900 mb-6 font-poppins text-center lg:text-left">Add New Card</h3>
      
      <form ref={formRef} action={handleSubmit} className="space-y-5 font-poppins">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Card Type</label>
          <select 
            name="type" 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm bg-zinc-50 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none cursor-pointer" 
            required
          >
            <option value="metric">Metric / Statistics (Num + Label)</option>
            <option value="client_project">Client / Project (Image + Label)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {type === 'metric' ? 'Stat Number / Value' : 'Client / Project Title'}
          </label>
          <input 
            type="text" 
            name="content" 
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none bg-zinc-50 focus:bg-white" 
            required 
            placeholder={type === 'metric' ? "e.g. 14+ / 98%" : "e.g. GreenHouse IoT"} 
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {type === 'metric' ? 'Metric Label (Subtext)' : 'Short Description (Role)'}
          </label>
          <input 
            type="text" 
            name="label" 
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none bg-zinc-50 focus:bg-white" 
            placeholder={type === 'metric' ? "Prototypes Deployed" : "Hardware Prototyping"} 
          />
        </div>

        {type === 'client_project' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Display Image</label>
            <label className="mt-1 flex flex-col items-center justify-center px-6 pt-8 pb-8 border-2 border-zinc-200 border-dashed rounded-xl hover:border-brand-400 hover:bg-brand-50/10 transition-all cursor-pointer relative bg-zinc-50 group">
              <div className="space-y-2 text-center">
                <div className="bg-brand-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                   <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="flex flex-col text-sm text-zinc-600">
                  <span className="font-bold text-brand-600">Click to upload photo</span>
                  <p className="text-xs text-zinc-500 mt-1">PNG, JPG, WebP up to 5MB</p>
                </div>
              </div>
              <input name="imageFile" type="file" required={type === 'client_project'} className="hidden" accept="image/*" />
            </label>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Display Priority Order</label>
          <input type="number" name="order" defaultValue={0} className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none bg-zinc-50 focus:bg-white" />
          <p className="text-[10px] text-zinc-400 mt-1 italic">Lower numbers appear first in the scrolling track.</p>
        </div>

        <button 
          type="submit" 
          disabled={isUploading}
          className="w-full bg-brand-600 text-white px-4 py-4 mt-6 rounded-xl text-sm font-bold transition-all hover:bg-brand-700 active:scale-[0.98] shadow-md shadow-brand-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isUploading ? (
             <>
               <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></span>
               Creating Card...
             </>
          ) : 'Save Hero Card'}
        </button>
      </form>
    </div>
  );
}
