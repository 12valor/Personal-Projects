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
  const [testimonials, heroImages, schoolLogos, heroSectionData, heroCards, faqs, teamMembers] = await Promise.all([
    (prisma as any).testimonial ? (prisma as any).testimonial.findMany({ orderBy: { createdAt: 'desc' } }) : Promise.resolve([]),
    (prisma as any).heroImage ? (prisma as any).heroImage.findMany({ where: { isActive: true } }) : Promise.resolve([]),
    (prisma as any).schoolLogo ? (prisma as any).schoolLogo.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }) : Promise.resolve([]),
    (prisma as any).heroSection ? (prisma as any).heroSection.findFirst() : Promise.resolve(null),
    (prisma as any).heroCard ? (prisma as any).heroCard.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }) : Promise.resolve([]),
    (prisma as any).faqItem ? (prisma as any).faqItem.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }) : Promise.resolve([]),
    (prisma as any).teamMember ? (prisma as any).teamMember.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }) : Promise.resolve([])
  ]);

  const defaultHeroSection = {
    heading_part_1: "Building",
    heading_highlight_1: "Ideas",
    heading_part_2: "Into",
    heading_highlight_2: "Reality",
    reveal_text: "Crafting Vision Into Results",
    subtext: "We offer hardware and software services, including device prototyping and web-based solutions, tailored to help students and innovators bring their ideas to life.",
    search_placeholder: "Describe your project idea... (e.g., Smart greenhouse)"
  };

  const heroSectionToUse = heroSectionData || defaultHeroSection;

  return <HomeContent 
           initialTestimonials={testimonials} 
           heroImages={heroImages} 
           schoolLogos={schoolLogos} 
           heroSection={heroSectionToUse}
           heroCards={heroCards}
           faqs={faqs}
           teamMembers={teamMembers}
         />;
}