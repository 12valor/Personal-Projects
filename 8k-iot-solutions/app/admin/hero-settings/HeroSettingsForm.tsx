'use client';

import { useState, useTransition } from 'react';
import { updateHeroSection } from './actions';
import { Loader2 } from 'lucide-react';

interface HeroSection {
  id?: string;
  heading_part_1: string;
  heading_highlight_1: string;
  heading_part_2: string;
  heading_highlight_2: string;
  reveal_text?: string | null;
  subtext: string;
  search_placeholder: string;
  show_magic_rings: boolean;
  magic_rings_color: string;
  magic_rings_color_2: string;
  magic_rings_speed: number;
  magic_rings_count: number;
  magic_rings_opacity: number;
  show_hero_orbs: boolean;
  hero_orbs_color: string;
  hero_orbs_opacity: number;
  trust_stat_value: string;
  trust_stat_label: string;
}

export default function HeroSettingsForm({ initialData }: { initialData: HeroSection | null }) {
  const [isPending, startTransition] = useTransition();
  const [showRings, setShowRings] = useState(initialData?.show_magic_rings !== false);
  const [showOrbs, setShowOrbs] = useState(initialData?.show_hero_orbs !== false);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await updateHeroSection(formData);
    });
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 lg:p-8 max-w-3xl">
      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-zinc-100 pb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Heading Part 1</label>
            <input type="text" name="heading_part_1" defaultValue={initialData?.heading_part_1 || "Building"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 text-brand-700">Heading Highlight 1</label>
            <input type="text" name="heading_highlight_1" defaultValue={initialData?.heading_highlight_1 || "Ideas"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Heading Part 2</label>
            <input type="text" name="heading_part_2" defaultValue={initialData?.heading_part_2 || "Into"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 text-brand-700">Heading Highlight 2</label>
            <input type="text" name="heading_highlight_2" defaultValue={initialData?.heading_highlight_2 || "Reality"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all" required />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Spotlight Reveal Text <span className="text-xs text-zinc-400 font-normal ml-2">(Desktop Only Effect)</span></label>
          <input type="text" name="reveal_text" defaultValue={initialData?.reveal_text || "Ready to build something amazing?"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all" placeholder="Text revealed on hover..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Subtext Paragraph</label>
          <textarea name="subtext" rows={3} defaultValue={initialData?.subtext || "We offer hardware and software services..."} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all" required />
        </div>

        <div className="space-y-2 pb-6 flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-zinc-700">Search Placeholder</label>
            <input type="text" name="search_placeholder" defaultValue={initialData?.search_placeholder || "Describe your project idea... (e.g., Smart greenhouse)"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all" required />
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="pt-8 border-t border-zinc-100 italic">
          <h3 className="text-lg font-bold text-zinc-900 mb-6 font-poppins flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-600 rounded-full"></span>
            Social Proof / Trust Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Stat Value (e.g. 20+ Innovators)</label>
              <input type="text" name="trust_stat_value" defaultValue={initialData?.trust_stat_value || "20+ Innovators"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Stat Label (e.g. Projects Delivered)</label>
              <input type="text" name="trust_stat_label" defaultValue={initialData?.trust_stat_label || "Projects Delivered"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white" required />
            </div>
          </div>
        </div>

        {/* Visual Effects Section */}
        <div className="pt-8 border-t border-zinc-100">
          <h3 className="text-lg font-bold text-zinc-900 mb-6 font-poppins flex items-center gap-2">
            <span className="w-1.5 h-6 bg-brand-600 rounded-full"></span>
            Visual Effects
          </h3>
          
          <div className="space-y-8">
            {/* Magic Rings Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRings(!showRings)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                      showRings ? 'bg-brand-600' : 'bg-zinc-200'
                    }`}
                  >
                    <span className="sr-only">Toggle Magic Rings</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        showRings ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <input type="hidden" name="show_magic_rings" value={showRings ? 'on' : 'off'} />
                  <span onClick={() => setShowRings(!showRings)} className="text-sm font-semibold text-zinc-900 cursor-pointer select-none">
                    Show Magic Rings Background
                  </span>
                </div>
              </div>

              {showRings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Primary Color</label>
                    <div className="flex gap-2 p-1 bg-white border border-zinc-200 rounded-lg">
                      <input type="color" name="magic_rings_color" defaultValue={initialData?.magic_rings_color || "#3b82f6"} className="w-10 h-10 rounded-md border-0 p-1 cursor-pointer bg-transparent" />
                      <input type="text" value={initialData?.magic_rings_color || "#3b82f6"} readOnly className="flex-1 bg-transparent px-2 text-xs font-mono text-zinc-500 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Secondary Color</label>
                    <div className="flex gap-2 p-1 bg-white border border-zinc-200 rounded-lg">
                      <input type="color" name="magic_rings_color_2" defaultValue={initialData?.magic_rings_color_2 || "#1d4ed8"} className="w-10 h-10 rounded-md border-0 p-1 cursor-pointer bg-transparent" />
                      <input type="text" value={initialData?.magic_rings_color_2 || "#1d4ed8"} readOnly className="flex-1 bg-transparent px-2 text-xs font-mono text-zinc-500 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Animation Speed</label>
                    <input type="number" step="0.05" name="magic_rings_speed" defaultValue={initialData?.magic_rings_speed ?? 0.25} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Opacity (0-1)</label>
                    <input type="number" step="0.01" min="0" max="1" name="magic_rings_opacity" defaultValue={initialData?.magic_rings_opacity ?? 0.18} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Background Glow Section Restored */}
            <div className="pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOrbs(!showOrbs)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                      showOrbs ? 'bg-brand-600' : 'bg-zinc-200'
                    }`}
                  >
                    <span className="sr-only">Toggle Hero Orbs</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        showOrbs ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <input type="hidden" name="show_hero_orbs" value={showOrbs ? 'on' : 'off'} />
                  <span onClick={() => setShowOrbs(!showOrbs)} className="text-sm font-semibold text-zinc-900 cursor-pointer select-none">
                    Show Background Glow Orbs
                  </span>
                </div>
              </div>

              {showOrbs && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Glow Color</label>
                    <div className="flex gap-2 p-1 bg-white border border-zinc-200 rounded-lg">
                      <input type="color" name="hero_orbs_color" defaultValue={initialData?.hero_orbs_color || "#4f46e5"} className="w-10 h-10 rounded-md border-0 p-1 cursor-pointer bg-transparent" />
                      <input type="text" value={initialData?.hero_orbs_color || "#4f46e5"} readOnly className="flex-1 bg-transparent px-2 text-xs font-mono text-zinc-500 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Glow Opacity (0-1)</label>
                    <input type="number" step="0.01" min="0" max="1" name="hero_orbs_opacity" defaultValue={initialData?.hero_orbs_opacity ?? 0.1} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm bg-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full sm:w-auto bg-brand-900 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-brand-900/10 active:scale-95"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
