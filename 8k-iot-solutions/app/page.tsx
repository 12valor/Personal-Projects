import HomeContent from '@/components/Home';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: {
    absolute: "Home - 8K IoT Solutions",
  },
};

export default async function Home() {
  // Execute database queries concurrently to reduce server-side blocking time
  const [testimonials, heroImages, schoolLogos] = await Promise.all([
    (prisma as any).testimonial ? (prisma as any).testimonial.findMany({ orderBy: { createdAt: 'desc' } }) : Promise.resolve([]),
    (prisma as any).heroImage ? (prisma as any).heroImage.findMany({ where: { isActive: true } }) : Promise.resolve([]),
    (prisma as any).schoolLogo ? (prisma as any).schoolLogo.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }) : Promise.resolve([])
  ]);

  return <HomeContent initialTestimonials={testimonials} heroImages={heroImages} schoolLogos={schoolLogos} />;
}