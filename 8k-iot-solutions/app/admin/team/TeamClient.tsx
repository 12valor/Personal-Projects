"use client";

import { useState } from 'react';
import CardForm from './CardForm';
import { deleteTeamMember, toggleTeamMemberStatus } from './actions';
import { Pencil, Trash2, User, Globe, Facebook, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

export default function TeamClient({ initialMembers }: { initialMembers: any[] }) {
  const [editingMember, setEditingMember] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      {/* Create/Edit Form */}
      <div className="lg:col-span-1">
        <CardForm 
          editingMember={editingMember} 
          onCancel={() => setEditingMember(null)} 
        />
      </div>

      {/* Existing Data Table */}
      <div className="lg:col-span-2">
        {initialMembers.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 font-poppins">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
               <User className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-zinc-500">No team members added yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
               <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-poppins">Active Members ({initialMembers.length})</h4>
            </div>
            <ul className="divide-y divide-zinc-200">
              {initialMembers.map((member: any) => (
                <li key={member.id} className="p-5 sm:p-6 flex items-center gap-5 hover:bg-zinc-50/50 transition-colors group">
                  
                  {/* Avatar Preview */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                    {member.imageUrl ? (
                      <Image 
                        src={member.imageUrl} 
                        alt={member.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 font-poppins">
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-zinc-900 truncate tracking-tight">{member.name}</h4>
                        <p className="text-sm text-zinc-500 font-medium">{member.role}</p>
                        
                        <div className="mt-3 flex items-center gap-3">
                           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded-full">Pos {member.order}</span>
                           <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${member.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                             {member.isActive ? 'Active' : 'Hidden'}
                           </span>
                           
                           {/* Social Indicators */}
                           <div className="flex items-center gap-1.5 ml-2">
                             {member.facebookUrl && <Facebook className="w-3 h-3 text-zinc-400" />}
                             {member.portfolioUrl && <LinkIcon className="w-3 h-3 text-zinc-400" />}
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 pt-1">
                         {/* Toggle Active */}
                         <button 
                           onClick={async () => { await toggleTeamMemberStatus(member.id, member.isActive); }}
                           className={`px-3 py-1.5 text-xs rounded-full font-bold border transition-all ${member.isActive ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300'}`}
                         >
                           {member.isActive ? 'Visible' : 'Hidden'}
                         </button>

                         {/* Edit Button */}
                         <button 
                           onClick={() => setEditingMember(member)}
                           className="p-2 text-zinc-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-all"
                           title="Edit Member"
                         >
                           <Pencil className="w-5 h-5" />
                         </button>
                         
                         {/* Delete */}
                         <button 
                           onClick={async () => { if(confirm('Delete this team member?')) await deleteTeamMember(member.id); }}
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
