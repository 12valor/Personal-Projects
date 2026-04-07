"use server"

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';
import { getSession } from '@/lib/auth';

export async function createHeroCard(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  
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

export async function updateHeroCard(id: string, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  try {
    const type = formData.get('type') as string;
    const content = formData.get('content') as string;
    const label = formData.get('label') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const oldImageUrl = formData.get('oldImageUrl') as string | null;
    
    let imageUrl = oldImageUrl;
    
    // Handle file upload if a new file is provided
    const file = formData.get('imageFile') as File;
    if (file && file.size > 0) {
      // Clean up old image if exists
      if (oldImageUrl && oldImageUrl.includes('public.blob.vercel-storage.com')) {
        try {
          await del(oldImageUrl);
        } catch (e) {
          console.error("Failed to delete old image during update:", e);
        }
      }
      
      const blob = await put(`hero-cards/${Date.now()}-${file.name}`, file, {
        access: 'public',
      });
      imageUrl = blob.url;
    }

    await (prisma as any).heroCard.update({
      where: { id },
      data: {
        type,
        content,
        label: label || null,
        imageUrl: imageUrl || null,
        order,
      }
    });

    revalidatePath('/');
    revalidatePath('/admin/hero-cards');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update hero card:", error);
    return { error: error.message };
  }
}

export async function deleteHeroCard(id: string, imageUrl?: string | null) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

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
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await (prisma as any).heroCard.update({
    where: { id },
    data: { isActive: !isActive }
  });
  revalidatePath('/');
  revalidatePath('/admin/hero-cards');
}
