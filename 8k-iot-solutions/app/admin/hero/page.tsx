import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import HeroImageForm from './components/HeroImageForm';
import HeroImageList from './components/HeroImageList';

export const metadata = {
  title: "Hero Image Management",
};

export default async function HeroAdminPage() {
  const images = await (prisma as any).heroImage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 mb-8">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <Link
            href="/admin"
            className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/admin/transmissions"
            className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 transition-colors"
          >
            Inquiries
          </Link>
          <Link
            href="/admin/testimonials"
            className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="/admin/hero"
            className="border-b-2 border-zinc-900 px-1 pb-3 text-sm font-medium text-zinc-900"
          >
            Hero
          </Link>
        </nav>
      </div>

      <div className="sm:flex sm:items-center sm:justify-between px-4 sm:px-0 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-poppins">Hero Images</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Manage the images displayed in the home page hero section. Only one image can be active at a time.
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
