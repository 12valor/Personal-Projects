"use client";

import { useState } from 'react';
import CardForm from './CardForm';
import { deleteFAQ, toggleFAQStatus } from './actions';
import { Pencil, Trash2, HelpCircle } from 'lucide-react';

export default function FAQClient({ initialFaqs }: { initialFaqs: any[] }) {
  const [editingFAQ, setEditingFAQ] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Create/Edit Form */}
      <div className="lg:col-span-1">
        <CardForm 
          editingFAQ={editingFAQ} 
          onCancel={() => setEditingFAQ(null)} 
        />
      </div>

      {/* Existing Data Table */}
      <div className="lg:col-span-2">
        {initialFaqs.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 font-poppins">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
               <HelpCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-zinc-500">No FAQs created yet. Start by adding your first project.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
               <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-poppins">Active Questions ({initialFaqs.length})</h4>
            </div>
            <ul className="divide-y divide-zinc-200">
              {initialFaqs.map((faq: any) => (
                <li key={faq.id} className="p-5 sm:p-6 flex items-center gap-5 hover:bg-zinc-50/50 transition-colors group">
                  
                  <div className="flex-1 min-w-0 font-poppins">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-zinc-900 truncate tracking-tight">{faq.question}</h4>
                        <p className="text-sm text-zinc-500 mt-1 line-clamp-2 max-w-xl">{faq.answer}</p>
                        <div className="mt-3 flex items-center gap-3">
                           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded-full">Position {faq.order}</span>
                           <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${faq.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                             {faq.isActive ? 'Active' : 'Hidden'}
                           </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 pt-1">
                         {/* Toggle Active */}
                         <button 
                           onClick={async () => { await toggleFAQStatus(faq.id, faq.isActive); }}
                           className={`px-3 py-1.5 text-xs rounded-full font-bold border transition-all ${faq.isActive ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300'}`}
                         >
                           {faq.isActive ? 'Visible' : 'Hidden'}
                         </button>

                         {/* Edit Button */}
                         <button 
                           onClick={() => setEditingFAQ(faq)}
                           className="p-2 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all"
                           title="Edit Question"
                         >
                           <Pencil className="w-5 h-5" />
                         </button>
                         
                         {/* Delete */}
                         <button 
                           onClick={async () => { if(confirm('Delete this question?')) await deleteFAQ(faq.id); }}
                           className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                         >
                           <Trash2 className="w-5 h-5" />
                         </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
    </div>
  );
}
