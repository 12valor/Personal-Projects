import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { toggleProductStatus, deleteProduct } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await (prisma as any).product.findMany({
    orderBy: { order: 'asc' }
  });

  async function handleDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await deleteProduct(id);
  }

  async function handleToggle(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const currentStatus = formData.get('currentStatus') === 'true';
    await toggleProductStatus(id, currentStatus);
  }

  return (
    <div className="p-4 sm:p-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-poppins">Software Products</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Manage your pre-made software products displayed on the website.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none transition-colors"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-zinc-300">
                <thead className="bg-zinc-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Order
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {products.map((product: any) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 sm:pl-6">
                        <div className="flex items-center gap-3">
                          {product.imageUrl && (
                            <img src={product.imageUrl} className="h-8 w-8 rounded object-cover border" alt="" />
                          )}
                          {product.name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        {product.price || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        {product.order}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        <form action={handleToggle}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="currentStatus" value={String(product.isActive)} />
                          <button 
                            type="submit"
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-800'}`}
                          >
                            {product.isActive ? 'Active' : 'Hidden'}
                          </button>
                        </form>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-4">
                          <Link href={`/admin/products/${product.id}`} className="text-zinc-600 hover:text-zinc-900">
                            Edit
                          </Link>
                          <form action={handleDelete}>
                            <input type="hidden" name="id" value={product.id} />
                            <button type="submit" className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-zinc-500">
                        No products found.
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
