import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { deleteSchoolLogo, reorderSchoolLogos } from './actions';
import { revalidatePath } from 'next/cache';

export const metadata = {
  title: "Admin - School Logos",
};

export default async function SchoolLogosAdminPage() {
  const prismaClient = prisma as any;
  const logos = await prismaClient.schoolLogo?.findMany({
    orderBy: { order: 'asc' }
  }) || [];

  async function handleDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await deleteSchoolLogo(id);
  }

  async function moveUp(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const currentIndexStr = formData.get('currentIndex') as string;
    const currentIndex = parseInt(currentIndexStr);
    
    if (currentIndex > 0) {
      const currentLogo = logos[currentIndex];
      const prevLogo = logos[currentIndex - 1];
      await reorderSchoolLogos([
        { id: currentLogo.id, order: currentIndex - 1 },
        { id: prevLogo.id, order: currentIndex }
      ]);
    }
  }

  async function moveDown(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const currentIndexStr = formData.get('currentIndex') as string;
    const currentIndex = parseInt(currentIndexStr);
    
    if (currentIndex < logos.length - 1) {
      const currentLogo = logos[currentIndex];
      const nextLogo = logos[currentIndex + 1];
      await reorderSchoolLogos([
        { id: currentLogo.id, order: currentIndex + 1 },
        { id: nextLogo.id, order: currentIndex }
      ]);
    }
  }

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 mb-8">
        <nav className="-mb-px flex gap-6" aria-label="Tabs" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <Link href="/admin" className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 transition-colors">
            Projects
          </Link>
          <Link href="/admin/transmissions" className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 transition-colors">
            Inquiries
          </Link>
          <Link href="/admin/testimonials" className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 transition-colors">
            Testimonials
          </Link>
          <Link href="/admin/hero" className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 transition-colors">
            Hero
          </Link>
          <Link href="/admin/school-logos" className="border-b-2 border-zinc-900 px-1 pb-3 text-sm font-medium text-zinc-900">
            School Logos
          </Link>
        </nav>
      </div>

      <div className="sm:flex sm:items-center sm:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-poppins">School Logos</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Manage the displayed school/client logos. Use the arrows to reorder them on the website.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-4">
          <Link
            href="/admin/school-logos/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            Add Logo
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-zinc-300">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 sm:pl-6 w-24">Order</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">Logo</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">Link</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {logos.map((logo: any, index: number) => (
                    <tr key={logo.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 sm:pl-6">
                        <div className="flex flex-col gap-1 items-center w-8">
                          <form action={moveUp}>
                            <input type="hidden" name="id" value={logo.id} />
                            <input type="hidden" name="currentIndex" value={index} />
                            <button type="submit" disabled={index === 0} className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30">
                              ▲
                            </button>
                          </form>
                          <span className="text-xs text-zinc-400">{index + 1}</span>
                          <form action={moveDown}>
                            <input type="hidden" name="id" value={logo.id} />
                            <input type="hidden" name="currentIndex" value={index} />
                            <button type="submit" disabled={index === logos.length - 1} className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30">
                              ▼
                            </button>
                          </form>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        <div className="relative h-12 w-24 bg-zinc-50 rounded border border-zinc-100 p-2">
                          <Image src={logo.image} alt={logo.name || 'Logo'} fill className="object-contain" unoptimized />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-900">
                        {logo.name || '-'}
                      </td>
                      <td className="px-3 py-4 text-sm text-zinc-500 max-w-[200px] truncate">
                        {logo.link ? <a href={logo.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{logo.link}</a> : '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${logo.isActive ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-800'}`}>
                          {logo.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-4">
                          <Link href={`/admin/school-logos/${logo.id}`} className="text-zinc-600 hover:text-zinc-900">
                            Edit
                          </Link>
                          <form action={handleDelete}>
                            <input type="hidden" name="id" value={logo.id} />
                            <button type="submit" className="text-red-600 hover:text-red-900 ml-4">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {logos.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-zinc-500">
                        No logos uploaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
