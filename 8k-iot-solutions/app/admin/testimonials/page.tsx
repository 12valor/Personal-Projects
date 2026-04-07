import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteTestimonialButton from '../components/DeleteTestimonialButton';
import AdminTabs from '../components/AdminTabs';

export const dynamic = 'force-dynamic';

export default async function TestimonialsAdmin() {
  // @ts-ignore
  const testimonials = (prisma as any).testimonial 
    ? await (prisma as any).testimonial.findMany({ orderBy: { createdAt: 'desc' } })
    : [];

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Testimonials</h2>
          <p className="text-zinc-500">Manage customer and partner testimonials.</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
        >
          Add Testimonial
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto border border-zinc-200">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Testimonial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200">
            {testimonials.map((t: any) => (
              <tr key={t.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {t.avatar ? (
                        <img className="h-10 w-10 rounded-full object-cover border border-zinc-200" src={t.avatar} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                          <span className="text-zinc-500 font-bold">{t.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-zinc-900">{t.name}</div>
                      <div className="text-sm text-zinc-500">{t.position}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-zinc-900 line-clamp-2 max-w-md italic">
                    &quot;{t.text}&quot;
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Link href={`/admin/testimonials/${t.id}`} className="text-zinc-600 hover:text-zinc-900">
                    Edit
                  </Link>
                  <DeleteTestimonialButton id={t.id} />
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                  No testimonials found. Start by adding one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

