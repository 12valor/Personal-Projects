import { prisma } from '@/lib/prisma';
import HeroCardsClient from './HeroCardsClient';

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
          Curate the client portfolio and project track displayed on your homepage.
        </p>
      </div>

      <HeroCardsClient initialCards={cards} />
    </div>
  );
}
