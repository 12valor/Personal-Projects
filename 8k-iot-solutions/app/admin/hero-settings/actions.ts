"use server"

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function updateHeroSection(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const data = {
    heading_part_1: formData.get('heading_part_1') as string,
    heading_highlight_1: formData.get('heading_highlight_1') as string,
    heading_part_2: formData.get('heading_part_2') as string,
    heading_highlight_2: formData.get('heading_highlight_2') as string,
    reveal_text: formData.get('reveal_text') as string,
    subtext: formData.get('subtext') as string,
    search_placeholder: formData.get('search_placeholder') as string,
    show_magic_rings: formData.get('show_magic_rings') === 'on',
    magic_rings_color: formData.get('magic_rings_color') as string,
    magic_rings_color_2: formData.get('magic_rings_color_2') as string,
    magic_rings_speed: parseFloat(formData.get('magic_rings_speed') as string) || 0.25,
    magic_rings_count: parseInt(formData.get('magic_rings_count') as string) || 12,
    magic_rings_opacity: parseFloat(formData.get('magic_rings_opacity') as string) || 0.18,
    show_hero_orbs: formData.get('show_hero_orbs') === 'on',
    hero_orbs_color: formData.get('hero_orbs_color') as string,
    hero_orbs_opacity: parseFloat(formData.get('hero_orbs_opacity') as string) || 0.1,
    trust_stat_value: formData.get('trust_stat_value') as string,
    trust_stat_label: formData.get('trust_stat_label') as string,
  };

  console.log("Saving dynamic data:", data);

  try {
    const existing = await (prisma as any).heroSection.findFirst();
    console.log("Existing HeroSection found:", !!existing);
    
    if (existing) {
      const result = await (prisma as any).heroSection.update({
        where: { id: existing.id },
        data
      });
      console.log("Prisma Update Result:", { id: result.id, val: result.trust_stat_value });
    } else {
      const result = await (prisma as any).heroSection.create({ data });
      console.log("Prisma Create Result:", { id: result.id, val: result.trust_stat_value });
    }

    revalidatePath('/');
    revalidatePath('/admin/hero-settings');
  } catch (error: any) {
    console.error("Hero Settings Error:", error.message);
  }
}

