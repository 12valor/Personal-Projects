import TestimonialForm from '../../components/TestimonialForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditTestimonial({ params }: { params: { id: string } }) {
  if (!(prisma as any).testimonial) {
    notFound();
  }
  
  // @ts-ignore
  const testimonial = await (prisma as any).testimonial.findUnique({
    where: { id: params.id }
  });

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-900 mb-8">Edit Testimonial</h1>
      <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
        <TestimonialForm testimonial={testimonial} />
      </div>
    </div>
  );
}
