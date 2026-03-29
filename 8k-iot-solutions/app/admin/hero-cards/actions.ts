"use server"

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';

export async function createHeroCard(formData: FormData) {
  try {
    const type = formData.get('type') as string;
    const content = formData.get('content') as string;
    const label = formData.get('label') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    
    let imageUrl = null;
    
    // Only handle file upload for client_project types
    if (type === 'client_project') {
      const file = formData.get('imageFile') as File;
      if (file && file.size > 0) {
        const blob = await put(`hero-cards/${Date.now()}-${file.name}`, file, {
          access: 'public',
        });
        imageUrl = blob.url;
      }
    }

    await (prisma as any).heroCard.create({
      data: {
        type,
        content,
        label: label || null,
        imageUrl: imageUrl || null,
        order,
        isActive: true
      }
    });

    revalidatePath('/');
    revalidatePath('/admin/hero-cards');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create hero card:", error);
    return { error: error.message };
  }
}

export async function deleteHeroCard(id: string, imageUrl?: string | null) {
  try {
    // Clean up Vercel Blob if exists
    if (imageUrl && imageUrl.includes('public.blob.vercel-storage.com')) {
      await del(imageUrl);
    }
    
    await (prisma as any).heroCard.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin/hero-cards');
  } catch (error: any) {
    console.error("Failed to delete hero card:", error);
  }
}

export async function toggleHeroCardStatus(id: string, isActive: boolean) {
  await (prisma as any).heroCard.update({
    where: { id },
    data: { isActive: !isActive }
  });
  revalidatePath('/');
  revalidatePath('/admin/hero-cards');
}
