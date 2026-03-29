import { prisma } from '@/lib/prisma';
import AdminTabs from '../components/AdminTabs';
import { deleteHeroCard, toggleHeroCardStatus } from './actions';
import Image from 'next/image';
import CardForm from './CardForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Hero Cards Management",
};

export default async function HeroCardsPage() {
  const cards = await (prisma as any).heroCard.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-bold text-zinc-900 font-poppins tracking-tight">Hero Cards Marquee</h1>
        <p className="mt-2 text-zinc-600 font-poppins text-[15px]">
          Curate the client portfolio and metrics track displayed on your homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Create Form */}
        <div className="lg:col-span-1">
          <CardForm />
        </div>

        {/* Existing Data Table */}
        <div className="lg:col-span-2">
          {cards.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
              </div>
              <p className="text-sm font-medium text-zinc-500 font-poppins">No cards created yet. Start by adding your first metric or client.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                 <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Cards ({cards.length})</h4>
              </div>
              <ul className="divide-y divide-zinc-200">
                {cards.map((card: any) => (
                  <li key={card.id} className="p-5 sm:p-6 flex items-center gap-5 hover:bg-zinc-50/50 transition-colors group">
                    {/* Visual Preview */}
                    <div className="w-20 h-20 rounded-xl bg-zinc-100 shrink-0 overflow-hidden relative border border-zinc-200 flex items-center justify-center">
                      {card.imageUrl ? (
                        <Image src={card.imageUrl} alt={card.content} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-tighter">Metric</span>
                          <span className="text-sm font-bold text-zinc-900">{card.content}</span>
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
                        
                        <div className="flex items-center gap-3 shrink-0">
                           {/* Toggle Active */}
                           <form action={toggleHeroCardStatus.bind(null, card.id, card.isActive)}>
                             <button type="submit" className={`px-3 py-1.5 text-xs rounded-full font-bold border transition-all ${card.isActive ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300'}`}>
                               {card.isActive ? 'Active' : 'Hidden'}
                             </button>
                           </form>

                           {/* Delete - Passing imageUrl for blob cleanup */}
                           <form action={deleteHeroCard.bind(null, card.id, card.imageUrl)}>
                             <button type="submit" className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all">
                               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                               </svg>
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
    </div>
  );
}
