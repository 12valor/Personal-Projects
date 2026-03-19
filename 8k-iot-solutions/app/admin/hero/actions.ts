'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

export async function getHeroImages() {
  return await (prisma as any).heroImage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getActiveHeroImage() {
  return await (prisma as any).heroImage.findFirst({
    where: { isActive: true },
  });
}

export async function saveHeroImage(formData: FormData) {
  const id = formData.get('id') as string | null;
  const urlInput = formData.get('url') as string | null;
  const alt = formData.get('alt') as string | null;
  const label = formData.get('label') as string | null;
  const file = formData.get('imageFile') as File | null;
  const makeActive = formData.get('makeActive') === 'true';

  let imageUrl = urlInput || '';

  if (file && file.size > 0 && file.name) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    
    const uniqueName = `hero-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    await fs.writeFile(filePath, buffer);
    imageUrl = `/uploads/${uniqueName}`;
  }

  if (!imageUrl) {
    throw new Error('Image URL or file is required');
  }

  if (makeActive) {
    // Deactivate all other hero images
    await (prisma as any).heroImage.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  const data = {
    url: imageUrl,
    alt: alt || null,
    label: label || null,
    isActive: makeActive,
  };

  if (id) {
    await (prisma as any).heroImage.update({
      where: { id },
      data,
    });
  } else {
    // If this is the first image, make it active by default
    const count = await (prisma as any).heroImage.count();
    if (count === 0) {
      data.isActive = true;
    }
    await (prisma as any).heroImage.create({ data });
  }

  revalidatePath('/admin/hero');
  revalidatePath('/');
  
  redirect('/admin/hero');
}

export async function deleteHeroImage(id: string) {
  // Check if we're deleting the active image
  const image = await (prisma as any).heroImage.findUnique({ where: { id } });
  
  await (prisma as any).heroImage.delete({
    where: { id },
  });

  // If we deleted the active image, set another one as active if available
  if (image?.isActive) {
    const nextImage = await (prisma as any).heroImage.findFirst();
    if (nextImage) {
      await (prisma as any).heroImage.update({
        where: { id: nextImage.id },
        data: { isActive: true },
      });
    }
  }

  revalidatePath('/admin/hero');
  revalidatePath('/');
}

export async function setActiveHeroImage(id: string) {
  // Deactivate all
  await (prisma as any).heroImage.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  // Activate selected
  await (prisma as any).heroImage.update({
    where: { id },
    data: { isActive: true },
  });

  revalidatePath('/admin/hero');
  revalidatePath('/');
}
