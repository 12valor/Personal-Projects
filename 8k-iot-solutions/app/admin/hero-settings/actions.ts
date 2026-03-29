"use server"

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateHeroSection(formData: FormData) {
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
  };

  try {
    const existing = await (prisma as any).heroSection.findFirst();
    if (existing) {
      await (prisma as any).heroSection.update({
        where: { id: existing.id },
        data
      });
    } else {
      await (prisma as any).heroSection.create({ data });
    }

    revalidatePath('/');
    revalidatePath('/admin/hero-settings');
  } catch (error: any) {
    console.error("Hero Settings Error:", error.message);
  }
}
