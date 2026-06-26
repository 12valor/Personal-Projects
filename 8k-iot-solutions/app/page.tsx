import HomeContent from '@/components/Home';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: {
    absolute: "Home - 8K IoT Solutions",
  },
};

/**
 * Safely executes a Prisma query, returning a fallback value on failure.
 * Prevents crashes when a table hasn't been migrated yet.
 */
async function safeQuery<T>(queryFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await queryFn();
  } catch {
    return fallback;
  }
}

export default async function Home() {
  // Execute database queries concurrently with safe fallbacks
  const [testimonials, heroImages, schoolLogos, heroSectionData, heroCards, faqs, teamMembers] = await Promise.all([
    safeQuery(() => prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }), []),
    safeQuery(() => prisma.heroImage.findMany({ where: { isActive: true } }), []),
    safeQuery(() => prisma.schoolLogo.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }), []),
    safeQuery(() => prisma.heroSection.findFirst(), null),
    safeQuery(() => prisma.heroCard.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }), []),
    safeQuery(() => prisma.faqItem.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }), []),
    safeQuery(() => prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }), []),
  ]);

  const defaultHeroSection = {
    heading_part_1: "Building",
    heading_highlight_1: "Ideas",
    heading_part_2: "Into",
    heading_highlight_2: "Reality",
    reveal_text: "Crafting Goals Into Results",
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