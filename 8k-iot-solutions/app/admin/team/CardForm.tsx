"use client";

import { useState, useEffect, useRef } from 'react';
import { createTeamMember, updateTeamMember } from './actions';
import { PlusCircle, Save, X, User, Briefcase, FileText, Globe, Facebook, Link as LinkIcon, Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function CardForm({ editingMember, onCancel }: { editingMember?: any, onCancel?: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMember) {
      setIsEditing(true);
      setIsImageRemoved(false);
      setPreviewUrl(null);
    } else {
      setIsEditing(false);
      setIsImageRemoved(false);
      setPreviewUrl(null);
    }
  }, [editingMember]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsImageRemoved(false);
    }
  };

  const handleRemoveImage = () => {
    setIsImageRemoved(true);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      formData.append('removeImage', String(isImageRemoved));
      if (editingMember?.imageUrl) {
        formData.append('existingImageUrl', editingMember.imageUrl);
      }

      if (isEditing) {
        await updateTeamMember(editingMember.id, formData);
      } else {
        await createTeamMember(formData);
      }
      
      if (onCancel) onCancel();
      else setIsEditing(false);
      
      if (!isEditing) {
        (document.getElementById('team-form') as HTMLFormElement).reset();
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Failed to save team member:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden sticky top-24">
      <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className={`p-2 rounded-lg ${isEditing ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'}`}>
             {isEditing ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
           </div>
           <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider font-poppins">
             {isEditing ? 'Edit Team Member' : 'Add Team Member'}
           </h3>
        </div>
        {isEditing && (
          <button onClick={onCancel} className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form id="team-form" action={handleSubmit} className="p-6 space-y-5 font-poppins max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Full Name
          </label>
          <input 
            type="text" 
            name="name" 
            defaultValue={editingMember?.name || ''}
            required
            placeholder="e.g. Jerow Bogie"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
          />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" />
            Role / Position
          </label>
          <input 
            type="text" 
            name="role" 
            defaultValue={editingMember?.role || ''}
            required
            placeholder="e.g. Co-Founder & CEO"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
          />
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" />
            Credibility Line / Tagline
          </label>
          <input 
            type="text" 
            name="tagline" 
            defaultValue={editingMember?.tagline || ''}
            placeholder="e.g. Co-Founder • 10+ Projects"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Professional Bio
          </label>
          <textarea 
            name="bio" 
            defaultValue={editingMember?.bio || ''}
            required
            placeholder="Brief bio..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium resize-none"
          />
        </div>

        {/* Motivation / Why Created */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <PlusCircle className="w-3.5 h-3.5" />
            Motivation (Why He Created...)
          </label>
          <textarea 
            name="motivation" 
            defaultValue={editingMember?.motivation || ''}
            placeholder="Why did they create this masterclass/project?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium resize-none"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Upload className="w-3.5 h-3.5" />
            Profile Image
          </label>
          
          <div className="flex items-center gap-4 p-4 border border-zinc-100 rounded-2xl bg-zinc-50/50">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-zinc-200 shrink-0 shadow-sm">
              {(previewUrl || (editingMember?.imageUrl && !isImageRemoved)) ? (
                <Image 
                  src={previewUrl || editingMember.imageUrl} 
                  alt="Preview" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50">
                   <User className="w-8 h-8" />
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <input 
                type="file" 
                name="imageFile" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="team-image-upload"
              />
              <label 
                htmlFor="team-image-upload"
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-700 hover:bg-zinc-50 cursor-pointer transition-colors shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                {editingMember?.imageUrl ? 'Change Photo' : 'Upload Photo'}
              </label>
              
              {(previewUrl || (editingMember?.imageUrl && !isImageRemoved)) && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="block text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                >
                  Remove current photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 space-y-4">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Social Profiles</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 flex items-center gap-2">
                <Globe className="w-3 h-3 text-blue-600" />
                LinkedIn
              </label>
              <input 
                type="text" 
                name="linkedinUrl" 
                defaultValue={editingMember?.linkedinUrl || ''}
                placeholder="URL"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-blue-500 text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 flex items-center gap-2">
                <Globe className="w-3 h-3 text-sky-500" />
                Twitter
              </label>
              <input 
                type="text" 
                name="twitterUrl" 
                defaultValue={editingMember?.twitterUrl || ''}
                placeholder="URL"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-blue-500 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 flex items-center gap-2">
                <Globe className="w-3 h-3 text-pink-500" />
                Instagram
              </label>
              <input 
                type="text" 
                name="instagramUrl" 
                defaultValue={editingMember?.instagramUrl || ''}
                placeholder="URL"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-blue-500 text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 flex items-center gap-2">
                <Facebook className="w-3 h-3 text-blue-700" />
                Facebook
              </label>
              <input 
                type="text" 
                name="facebookUrl" 
                defaultValue={editingMember?.facebookUrl || ''}
                placeholder="URL"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-blue-500 text-xs font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-500 flex items-center gap-2">
              <LinkIcon className="w-3 h-3" />
              Website / Portfolio
            </label>
            <input 
              type="text" 
              name="portfolioUrl" 
              defaultValue={editingMember?.portfolioUrl || ''}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-blue-500 text-xs font-medium"
            />
          </div>
        </div>

        {/* Order */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            Display Order
          </label>
          <input 
            type="number" 
            name="order" 
            defaultValue={editingMember?.order || 0}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {isEditing ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              {isEditing ? 'Update Profile' : 'Publish Member'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
