'use client';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveProduct } from '../products/actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductForm({ product }: { product?: any }) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(saveProduct, { error: null });
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [manualSlug, setManualSlug] = useState(!!product?.slug);

  // Auto-generate slug from name for new products
  useEffect(() => {
    if (!product && !manualSlug && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [name, manualSlug, product]);

  // Handle successful submission
  useEffect(() => {
    if (state?.success) {
      router.push('/admin/products');
      router.refresh();
    }
  }, [state, router]);

  // Parse existing JSON
  let features = '';
  if (product?.features) {
    features = typeof product.features === 'string' ? JSON.parse(product.features).join('\n') : product.features.join('\n');
  }
  
  return (
    <form action={action} className="space-y-8 divide-y divide-zinc-200">
      <div className="space-y-8 divide-y divide-zinc-200">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-zinc-900">
              {product ? 'Edit Product' : 'New Product'}
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              This information will be displayed on the Products showcase page.
            </p>
          </div>

          {state?.error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            {product && <input type="hidden" name="id" value={product.id} />}
            {product && <input type="hidden" name="existingImageUrl" value={product.imageUrl} />}

            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
                Product Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="slug" className="block text-sm font-medium text-zinc-700">
                Slug (URL)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setManualSlug(true);
                  }}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="price" className="block text-sm font-medium text-zinc-700">
                Price (Optional, e.g. ₱999)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="price"
                  id="price"
                  defaultValue={product?.price}
                  placeholder="e.g. ₱999 or Contact for Price"
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="order" className="block text-sm font-medium text-zinc-700">
                Display Order
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="order"
                  id="order"
                  defaultValue={product?.order || 0}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border-zinc-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  defaultValue={product?.description}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="features" className="block text-sm font-medium text-zinc-700">
                Key Features (One per line)
              </label>
              <div className="mt-1">
                <textarea
                  id="features"
                  name="features"
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2"
                  defaultValue={features}
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-zinc-700">Product Image</label>
              <div className="mt-1 flex items-center">
                {product?.imageUrl && (
                  <span className="h-16 w-16 overflow-hidden bg-zinc-100 rounded-md border mr-4 shrink-0 relative">
                    <img src={product.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                  </span>
                )}
                <input
                  type="file"
                  name="imageFile"
                  id="imageFile"
                  accept="image/*"
                  className="shadow-sm focus:ring-zinc-900 focus:border-zinc-900 block w-full sm:text-sm border border-zinc-300 rounded-md p-1.5"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="bg-white py-2 px-4 border border-zinc-300 rounded-md shadow-sm text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </form>
  );
}
