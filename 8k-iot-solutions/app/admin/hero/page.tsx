import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import HeroImageForm from './components/HeroImageForm';
import HeroImageList from './components/HeroImageList';
import AdminTabs from '../components/AdminTabs';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Hero Image Management",
};

export default async function HeroAdminPage() {
  const images = await (prisma as any).heroImage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between px-4 sm:px-0 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-poppins">Hero Images</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Manage the images displayed in the home page hero section. You can activate multiple images to create a dynamic rotation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <HeroImageForm />
        </div>
        
        <div className="lg:col-span-2">
          <h3 className="text-lg font-medium text-zinc-900 mb-4">Gallery</h3>
          <HeroImageList images={images} />
        </div>
      </div>
    </div>
  );
}

