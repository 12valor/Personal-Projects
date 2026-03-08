'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

export async function saveProject(formData: FormData) {
  const id = formData.get('id') as string | null;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const category = formData.get('category') as string;
  const shortDescription = formData.get('shortDescription') as string;
  const fullDescription = formData.get('fullDescription') as string;
  const client = formData.get('client') as string | null;
  const tagsString = formData.get('tags') as string;
  const featuresString = formData.get('features') as string;
  
  // Handle image upload
  let coverImage = formData.get('existingCoverImage') as string;
  const imageFile = formData.get('coverImage') as File | null;
  
  if (imageFile && imageFile.size > 0 && imageFile.name) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    
    const uniqueName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, uniqueName);
    
    await fs.writeFile(filePath, buffer);
    coverImage = `/uploads/${uniqueName}`;
  }

  // Parse arrays
  let tags: string[] = [];
  if (tagsString) {
    tags = tagsString.split(',').map(s => s.trim()).filter(Boolean);
  }
  
  let features: string[] = [];
  if (featuresString) {
    features = featuresString.split('\n').map(s => s.trim()).filter(Boolean);
  }

  const projectData = {
    title,
    slug,
    category,
    shortDescription,
    fullDescription,
    coverImage: coverImage || '',
    tags: JSON.stringify(tags),
    features: JSON.stringify(features),
    client: client || null
  };

  if (id) {
    await prisma.project.update({
      where: { id },
      data: projectData,
    });
  } else {
    await prisma.project.create({
      data: projectData,
    });
  }

  revalidatePath('/admin');
  revalidatePath('/services/hardware');
  revalidatePath('/services/software');
  revalidatePath(`/projects/${slug}`);
  
  redirect('/admin');
}
