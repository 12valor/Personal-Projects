import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminTabs from './components/AdminTabs';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  async function handleDelete(formData: FormData) {
    'use server';
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const id = formData.get('id') as string;
    if (id) {
      await prisma.project.delete({ where: { id } });
      revalidatePath('/admin');
      revalidatePath('/projects/hardware');
      revalidatePath('/projects/software');
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-poppins">Projects</h1>
          <p className="mt-2 text-sm text-zinc-600">
            A list of all projects currently displayed on the website.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            Add Project
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Slug
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 sm:pl-6">
                        {project.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 capitalize">
                        {project.category}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        {project.slug}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-4">
                          <Link href={`/admin/projects/${project.id}`} className="text-zinc-600 hover:text-zinc-900">
                            Edit
                          </Link>
                          <form action={handleDelete}>
                            <input type="hidden" name="id" value={project.id} />
                            <button type="submit" className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-zinc-500">
                        No projects found.
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
