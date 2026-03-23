import { prisma } from '@/lib/prisma';
import { saveSchoolLogo } from '../actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
  title: "Edit School Logo",
};

export default async function EditSchoolLogoPage({ params }: { params: { id: string } }) {
  const prismaClient = prisma as any;
  if (!prismaClient.schoolLogo) return notFound();

  const logo = await prismaClient.schoolLogo.findUnique({
    where: { id: params.id }
  });

  if (!logo) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/school-logos" className="text-sm text-zinc-500 hover:text-zinc-900 mb-4 inline-block">
          &larr; Back to School Logos
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 font-poppins">Edit School Logo</h1>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-zinc-900/5 sm:rounded-xl md:col-span-2">
        <form action={saveSchoolLogo} className="px-4 py-6 sm:p-8">
          <input type="hidden" name="id" value={logo.id} />
          <input type="hidden" name="existingImage" value={logo.image} />
          
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            
            <div className="col-span-full">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-900">
                School/Company Name <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={logo.name || ''}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="link" className="block text-sm font-medium leading-6 text-zinc-900">
                Link URL <span className="text-zinc-400 font-normal">(Optional)</span>
              </label>
              <div className="mt-2">
                <input
                  type="url"
                  name="link"
                  id="link"
                  defaultValue={logo.link || ''}
                  placeholder="https://example.com"
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="image" className="block text-sm font-medium leading-6 text-zinc-900">
                Logo Image
              </label>
              
              <div className="mt-4 mb-6">
                <p className="text-sm text-zinc-500 mb-2">Current Image:</p>
                <div className="relative h-24 w-48 bg-zinc-50 rounded border border-zinc-200 flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.image} alt="Current logo" className="max-h-full max-w-full object-contain" />
                </div>
              </div>

              <div className="mt-2 flex items-center gap-x-3">
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-50 file:text-zinc-700 hover:file:bg-zinc-100"
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">Only choose a new file if you want to replace the current image.</p>
            </div>

            <div className="col-span-full">
              <div className="flex h-6 items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  defaultChecked={logo.isActive}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <label htmlFor="isActive" className="ml-3 text-sm leading-6 text-zinc-700">
                  Active (display on website)
                </label>
              </div>
            </div>

          </div>

          <div className="mt-8 flex items-center justify-end gap-x-6 border-t border-zinc-900/10 pt-8">
            <Link href="/admin/school-logos" className="text-sm font-semibold leading-6 text-zinc-900 hover:text-zinc-700">
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 transition-colors"
            >
              Update Logo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
