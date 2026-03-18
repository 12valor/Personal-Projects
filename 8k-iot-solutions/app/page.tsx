import HomeContent from '@/components/Home';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: {
    absolute: "Home - 8K IoT Solutions",
  },
};

export default async function Home() {
  // @ts-ignore - Handle case where Testimonial model isn't generated yet
  const testimonials = (prisma as any).testimonial 
    ? await (prisma as any).testimonial.findMany({ orderBy: { createdAt: 'desc' } })
    : [];

  return <HomeContent initialTestimonials={testimonials} />;
}