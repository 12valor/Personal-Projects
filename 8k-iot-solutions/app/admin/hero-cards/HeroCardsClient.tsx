"use client";

import { useState } from 'react';
import Image from 'next/image';
import CardForm from './CardForm';
import { deleteHeroCard, toggleHeroCardStatus } from './actions';
import { Pencil, Trash2 } from 'lucide-react';

export default function HeroCardsClient({ initialCards }: { initialCards: any[] }) {
  const [editingCard, setEditingCard] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Create/Edit Form */}
      <div className="lg:col-span-1">
        <CardForm 
          editingCard={editingCard} 
          onCancel={() => setEditingCard(null)} 
        />
      </div>

      {/* Existing Data Table */}
      <div className="lg:col-span-2">
        {initialCards.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 font-poppins">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p className="text-sm font-medium text-zinc-500">No cards created yet. Start by adding your first project.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
               <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-poppins">Active Cards ({initialCards.length})</h4>
            </div>
            <ul className="divide-y divide-zinc-200">
              {initialCards.map((card: any) => (
                <li key={card.id} className="p-5 sm:p-6 flex items-center gap-5 hover:bg-zinc-50/50 transition-colors group">
                  {/* Visual Preview */}
                  <div className="w-20 h-20 rounded-xl bg-zinc-100 shrink-0 overflow-hidden relative border border-zinc-200 flex items-center justify-center">
                    {card.imageUrl ? (
                      <Image src={card.imageUrl} alt={card.content} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-brand-600 uppercase tracking-tighter">Metric</span>
                        <span className="text-sm font-bold text-zinc-900 font-poppins">{card.content}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 font-poppins">
                    <div className="flex justify-between items-center gap-4">
                      <div className="min-w-0">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${card.type === 'metric' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {card.type === 'metric' ? 'Metric' : 'Client / Project'}
                        </span>
                        <h4 className="text-base font-semibold text-zinc-900 truncate tracking-tight">{card.content}</h4>
                        <p className="text-sm text-zinc-500 mt-0.5 truncate">{card.label || "No subtext"} • Position {card.order}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                         {/* Toggle Active */}
                         <form action={async () => { await toggleHeroCardStatus(card.id, card.isActive); }}>
                           <button type="submit" className={`px-3 py-1.5 text-xs rounded-full font-bold border transition-all ${card.isActive ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300'}`}>
                             {card.isActive ? 'Active' : 'Hidden'}
                           </button>
                         </form>

                         {/* Edit Button */}
                         <button 
                           onClick={() => setEditingCard(card)}
                           className="p-2 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all"
                           title="Edit Card"
                         >
                           <Pencil className="w-5 h-5" />
                         </button>
                         
                         {/* Delete - Passing imageUrl for blob cleanup */}
                         <form action={async () => { if(confirm('Delete this card?')) await deleteHeroCard(card.id, card.imageUrl); }}>
                           <button type="submit" className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                             <Trash2 className="w-5 h-5" />
                           </button>
                         </form>
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
