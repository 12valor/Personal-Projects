'use client';

import { saveHeroImage } from '../actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroImageForm({ heroImage }: { heroImage?: any }) {
  return (
    <form action={saveHeroImage} className="space-y-8 divide-y divide-zinc-200 bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
      <div className="space-y-8 divide-y divide-zinc-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-zinc-900">
              {heroImage ? 'Edit Hero Image' : 'Add New Hero Image'}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Upload a new image or provide a URL to be used in the hero section.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            {heroImage && <input type="hidden" name="id" value={heroImage.id} />}

            <div className="sm:col-span-4">
              <label htmlFor="label" className="block text-sm font-medium text-zinc-700">
                Label / Name (Internal use)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="label"
                  id="label"
                  placeholder="e.g. Modern Office Setup"
                  defaultValue={heroImage?.label}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="alt" className="block text-sm font-medium text-zinc-700">
                Alt Text (For accessibility)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="alt"
                  id="alt"
                  placeholder="e.g. A high-tech hardware prototype on a desk"
                  defaultValue={heroImage?.alt}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-zinc-700">Hero Image Source</label>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  {heroImage?.url && (
                    <span className="h-20 w-32 overflow-hidden bg-zinc-100 rounded-md border shrink-0 relative">
                      <img src={heroImage.url} className="w-full h-full object-cover" alt="Preview" />
                    </span>
                  )}
                  <div className="flex-1">
                    <label className="block text-xs text-zinc-500 mb-1">Upload Image File</label>
                    <input
                      type="file"
                      name="imageFile"
                      id="imageFile"
                      accept="image/*"
                      className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-1.5"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-zinc-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-zinc-500">OR</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-zinc-700">
                    Image URL
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="url"
                      id="url"
                      placeholder="https://example.com/hero-image.jpg"
                      defaultValue={heroImage?.url?.startsWith('http') ? heroImage.url : ''}
                      className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="makeActive"
                    name="makeActive"
                    type="checkbox"
                    value="true"
                    defaultChecked={heroImage?.isActive}
                    className="focus:ring-zinc-900 h-4 w-4 text-zinc-900 border-zinc-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="makeActive" className="font-medium text-zinc-700">Set as active image</label>
                  <p className="text-zinc-500">If checked, this image will immediately be displayed on the home page hero section.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="pt-5 pb-2">
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
          >
            {heroImage ? 'Update Image' : 'Add Image'}
          </button>
        </div>
      </div>
    </form>
  );
}
