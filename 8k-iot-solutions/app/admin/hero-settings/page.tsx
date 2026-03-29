import { prisma } from '@/lib/prisma';
import HeroSettingsForm from './HeroSettingsForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Hero Text Settings",
};

export default async function HeroSettingsPage() {
  const heroSection = await (prisma as any).heroSection.findFirst();

  return (
    <div className="pb-12">
      <div className="mb-10 px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-zinc-900 font-poppins tracking-tight">Hero Configuration</h1>
        <p className="mt-2 text-sm text-zinc-500 font-medium">
          Control the text, spotlights, and background visual effects for the primary hero section.
        </p>
      </div>

      <HeroSettingsForm initialData={heroSection} />
    </div>
  );
}
