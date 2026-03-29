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
