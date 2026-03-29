import { prisma } from '@/lib/prisma';
import AdminTabs from '../components/AdminTabs';
import { updateHeroSection } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Hero Text Settings",
};

export default async function HeroSettingsPage() {
  const heroSection = await (prisma as any).heroSection.findFirst();

  return (
    <div>
      <div className="mb-8 px-4 sm:px-0">
        <h1 className="text-2xl font-bold text-zinc-900 font-poppins">Hero Text Settings</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Manage the primary text content for the homepage hero section.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 lg:p-8 max-w-3xl">
        <form action={updateHeroSection as any} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Heading Part 1</label>
              <input type="text" name="heading_part_1" defaultValue={heroSection?.heading_part_1 || "Building"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 text-brand-700">Heading Highlight 1</label>
              <input type="text" name="heading_highlight_1" defaultValue={heroSection?.heading_highlight_1 || "Ideas"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Heading Part 2</label>
              <input type="text" name="heading_part_2" defaultValue={heroSection?.heading_part_2 || "Into"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 text-brand-700">Heading Highlight 2</label>
              <input type="text" name="heading_highlight_2" defaultValue={heroSection?.heading_highlight_2 || "Reality"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Spotlight Reveal Text <span className="text-xs text-zinc-400 font-normal ml-2">(Desktop Only Effect)</span></label>
            <input type="text" name="reveal_text" defaultValue={heroSection?.reveal_text || "Ready to build something amazing?"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" placeholder="Text revealed on hover..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Subtext Paragraph</label>
            <textarea name="subtext" rows={3} defaultValue={heroSection?.subtext || "We offer hardware and software services..."} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Search Placeholder</label>
            <input type="text" name="search_placeholder" defaultValue={heroSection?.search_placeholder || "Describe your project idea... (e.g., Smart greenhouse)"} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" required />
          </div>

          {/* Visual Effects Section */}
          <div className="pt-6 border-t border-zinc-100">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4 font-poppins">Visual Effects</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="show_magic_rings" 
                  name="show_magic_rings" 
                  defaultChecked={heroSection?.show_magic_rings !== false}
                  className="w-4 h-4 text-brand-600 border-zinc-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="show_magic_rings" className="text-sm font-medium text-zinc-800">Show Magic Rings Background Overlay</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-zinc-50/50 rounded-xl border border-zinc-100">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Primary Ring Color</label>
                  <div className="flex gap-2">
                    <input type="color" name="magic_rings_color" defaultValue={heroSection?.magic_rings_color || "#3b82f6"} className="w-10 h-10 rounded border border-zinc-300 p-1 cursor-pointer" />
                    <input type="text" value={heroSection?.magic_rings_color || "#3b82f6"} readOnly className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-xs bg-white text-zinc-500" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Secondary Ring Color</label>
                  <div className="flex gap-2">
                    <input type="color" name="magic_rings_color_2" defaultValue={heroSection?.magic_rings_color_2 || "#1d4ed8"} className="w-10 h-10 rounded border border-zinc-300 p-1 cursor-pointer" />
                    <input type="text" value={heroSection?.magic_rings_color_2 || "#1d4ed8"} readOnly className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-xs bg-white text-zinc-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Animation Speed</label>
                  <input type="number" step="0.05" name="magic_rings_speed" defaultValue={heroSection?.magic_rings_speed ?? 0.25} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ring Count</label>
                  <input type="number" name="magic_rings_count" defaultValue={heroSection?.magic_rings_count ?? 12} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Overlay Opacity (0-1)</label>
                  <input type="number" step="0.01" min="0" max="1" name="magic_rings_opacity" defaultValue={heroSection?.magic_rings_opacity ?? 0.18} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full sm:w-auto bg-brand-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-brand-800">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
