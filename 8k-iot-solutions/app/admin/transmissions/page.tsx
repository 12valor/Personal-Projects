import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export const metadata = {
  title: "Inquiries",
};

export default async function TransmissionsPage() {
  const inquiries = await (prisma as any).inquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  async function handleToggleRead(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    const currentStatus = formData.get('isRead') === 'true';
    if (id) {
      await (prisma as any).inquiry.update({
        where: { id },
        data: { isRead: !currentStatus },
      });
      revalidatePath('/admin/transmissions');
    }
  }

  async function handleDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (id) {
      await (prisma as any).inquiry.delete({ where: { id } });
      revalidatePath('/admin/transmissions');
    }
  }

  const unreadCount = inquiries.filter((i: any) => !i.isRead).length;

  // Map inquiry type values to readable labels
  const inquiryTypeLabels: Record<string, string> = {
    hardware: 'Hardware Prototyping',
    software: 'Web Dashboard / Software',
    integration: 'Full IoT Integration',
    other: 'General Inquiry',
  };

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
            className="border-b-2 border-zinc-900 px-1 pb-3 text-sm font-medium text-zinc-900"
          >
            Inquiries
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white">
                {unreadCount}
              </span>
            )}
          </Link>
        </nav>
      </div>

      <div className="sm:flex sm:items-center sm:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-poppins">Inquiries</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Contact form submissions from the website.
            {unreadCount > 0 && (
              <span className="ml-1 font-medium text-zinc-900">{unreadCount} unread</span>
            )}
          </p>
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
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Message
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Date
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
                  {inquiries.map((inquiry: any) => (
                    <tr key={inquiry.id} className={inquiry.isRead ? 'bg-white' : 'bg-blue-50/50'}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <span className={inquiry.isRead ? 'text-zinc-900' : 'font-semibold text-zinc-900'}>
                          {inquiry.fullName}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        <a href={`mailto:${inquiry.email}`} className="hover:text-zinc-900 underline decoration-zinc-300 hover:decoration-zinc-500 transition-colors">
                          {inquiry.email}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        {inquiryTypeLabels[inquiry.inquiryType] || inquiry.inquiryType}
                      </td>
                      <td className="px-3 py-4 text-sm text-zinc-500 max-w-xs">
                        <p className="truncate" title={inquiry.message}>
                          {inquiry.message}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {inquiry.isRead ? (
                          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                            Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            New
                          </span>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-4">
                          <form action={handleToggleRead}>
                            <input type="hidden" name="id" value={inquiry.id} />
                            <input type="hidden" name="isRead" value={String(inquiry.isRead)} />
                            <button type="submit" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                              {inquiry.isRead ? 'Mark Unread' : 'Mark Read'}
                            </button>
                          </form>
                          <form action={handleDelete}>
                            <input type="hidden" name="id" value={inquiry.id} />
                            <button type="submit" className="text-red-600 hover:text-red-900 transition-colors">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-zinc-500">
                        <svg className="mx-auto h-8 w-8 text-zinc-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-10.5 7.5L3 6.75" />
                        </svg>
                        No inquiries yet.
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
