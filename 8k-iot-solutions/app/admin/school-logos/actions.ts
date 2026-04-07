'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { saveImageFile } from '@/lib/upload';
import { getSession } from '@/lib/auth';

export async function saveSchoolLogo(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string | null;
  const link = formData.get('link') as string | null;
  const isActiveStr = formData.get('isActive') as string | null;
  const isActive = isActiveStr === 'true' || isActiveStr === 'on';
  
  // Handle image upload
  let image = formData.get('existingImage') as string || '';
  const imageFile = formData.get('image') as File | null;
  
  if (imageFile && imageFile.size > 0 && imageFile.name) {
    image = await saveImageFile(imageFile, 'logo');
  }

  const logoData = {
    name: name || null,
    link: link || null,
    image,
    isActive
  };

  // Safe approach handling if Prisma client hasn't been updated immediately
  const prismaClient = prisma as any;
  if (!prismaClient.schoolLogo) {
    throw new Error("SchoolLogo model not found. Ensure 'npx prisma db push' has completed.");
  }

  if (id) {
    await prismaClient.schoolLogo.update({
      where: { id },
      data: logoData,
    });
  } else {
    // New logo, place it at the end of the order
    const count = await prismaClient.schoolLogo.count();
    await prismaClient.schoolLogo.create({
      data: {
        ...logoData,
        order: count,
      },
    });
  }

  revalidatePath('/admin/school-logos');
  revalidatePath('/');
  
  redirect('/admin/school-logos');
}

export async function deleteSchoolLogo(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const prismaClient = prisma as any;
  if (!prismaClient.schoolLogo) return;
  
  // Actually might need to delete the image file, but for simplicity we keep it or can implement it
  // Let's implement filesystem deletion to keep it clean
  const logo = await prismaClient.schoolLogo.findUnique({ where: { id }});
  
  if (logo?.image?.startsWith('/uploads/')) {
    try {
      const filePath = path.join(process.cwd(), 'public', logo.image);
      await fs.unlink(filePath);
    } catch(e) {
      console.error('Failed to delete old image file:', e);
    }
  }

  await prismaClient.schoolLogo.delete({
    where: { id },
  });
  
  revalidatePath('/admin/school-logos');
  revalidatePath('/');
}

export async function reorderSchoolLogos(items: { id: string, order: number }[]) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const prismaClient = prisma as any;
  if (!prismaClient.schoolLogo) return;

  // Use a transaction to perform batch updates
  const transactions = items.map((item: any) => 
    prismaClient.schoolLogo.update({
      where: { id: item.id },
      data: { order: item.order },
    })
  );

  await prismaClient.$transaction(transactions);
  
  revalidatePath('/admin/school-logos');
  revalidatePath('/');
}

