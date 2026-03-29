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

          <button type="submit" className="w-full sm:w-auto bg-brand-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-brand-800">
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
