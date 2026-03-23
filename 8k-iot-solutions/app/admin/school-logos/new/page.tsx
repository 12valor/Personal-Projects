import { saveSchoolLogo } from '../actions';
import Link from 'next/link';

export const metadata = {
  title: "Add School Logo",
};

export default function NewSchoolLogoPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/school-logos" className="text-sm text-zinc-500 hover:text-zinc-900 mb-4 inline-block">
          &larr; Back to School Logos
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 font-poppins">Add School Logo</h1>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-zinc-900/5 sm:rounded-xl md:col-span-2">
        <form action={saveSchoolLogo} className="px-4 py-6 sm:p-8">
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
                  placeholder="https://example.com"
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="image" className="block text-sm font-medium leading-6 text-zinc-900">
                Logo Image <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-50 file:text-zinc-700 hover:file:bg-zinc-100"
                />
              </div>
            </div>

            <div className="col-span-full">
              <div className="flex h-6 items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  defaultChecked
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
              Save Logo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
